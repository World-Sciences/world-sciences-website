import * as cheerio from "cheerio";
import {
  cleanText,
  estimateReadTime,
  getArticleSlug,
  getJsonLdObjects,
  imageKey,
  isLikelyContentImage,
  makeSlug,
  normalizeUrl,
  toPublishedDate,
  uniqueSorted,
} from "./utils.js";
import { articleOverridesBySlug } from "./articleOverrides.js";
import { articleMetadataBySlug } from "../../src/data/articleMetadata.js";

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function getStructuredArticle($) {
  return (
    getJsonLdObjects($).find((item) => {
      const type = item["@type"];
      return type === "Article" || (Array.isArray(type) && type.includes("Article"));
    }) || {}
  );
}

function getAuthorName($, structuredArticle) {
  const structuredAuthor = structuredArticle.author;

  if (typeof structuredAuthor === "string") {
    return cleanText(structuredAuthor);
  }

  if (structuredAuthor?.name) {
    return cleanText(structuredAuthor.name);
  }

  return cleanText(
    $(".blog-meta-item--author").first().text().replace(/^Written By/i, "") ||
      $("[rel='author']").first().text()
  );
}

function getImageSrc($, element, baseUrl) {
  const raw =
    $(element).attr("data-src") ||
    $(element).attr("data-image") ||
    $(element).attr("data-image-src") ||
    $(element).attr("src") ||
    "";

  return normalizeUrl(raw, baseUrl);
}

function getFigureCaption($, figure) {
  return cleanText(
    $(figure).find("figcaption").first().text() ||
      $(figure).find(".image-caption").first().text() ||
      $(figure).find("p").first().text()
  );
}

function getImageAlt($, image, caption) {
  return cleanText($(image).attr("alt") || caption);
}

function findArticleRoot($) {
  const selectors = [".blog-item-content.e-content", ".blog-item-content", "article.h-entry", "main"];

  for (const selector of selectors) {
    const root = $(selector).first();

    if (root.length) {
      return root;
    }
  }

  return $("body");
}

function isOpaqueSquarespaceSlug(slug) {
  return /^[a-z0-9]{20,}$/i.test(slug);
}

function buildSitemapImageLookup(sitemapImages, baseUrl) {
  return new Map(
    sitemapImages
      .filter((image) => image.key || image.src)
      .map((image) => [image.key || imageKey(image.src, baseUrl), image])
  );
}

function createImageBlock({ src, alt, caption, sortOrder }) {
  return {
    sortOrder,
    type: "image",
    text: null,
    src,
    alt: alt || "",
    caption: caption || "",
  };
}

function createTextBlock({ type, text, sortOrder }) {
  return {
    sortOrder,
    type,
    text,
    src: null,
    alt: null,
    caption: null,
  };
}

export async function scrapeArticle(entry, { baseUrl }) {
  const html = await fetchText(entry.url);
  const $ = cheerio.load(html);
  const structuredArticle = getStructuredArticle($);
  const articleRoot = findArticleRoot($);
  const sitemapImagesByKey = buildSitemapImageLookup(entry.sitemapImages || [], baseUrl);
  const seenImages = new Set();
  const captionsToSkip = new Set();
  const contentBlocks = [];

  let sortOrder = 1;

  articleRoot.find("h2, h3, h4, p, figure").each((_, element) => {
    const tagName = element.tagName?.toLowerCase();

    if (tagName === "figure") {
      const image = $(element).find("img").first();
      const src = getImageSrc($, image, baseUrl);
      const key = imageKey(src, baseUrl);

      if (!src || seenImages.has(key) || !isLikelyContentImage(src)) {
        return;
      }

      const sitemapImage = sitemapImagesByKey.get(key);
      const caption = getFigureCaption($, element) || sitemapImage?.caption || "";

      seenImages.add(key);

      if (caption) {
        captionsToSkip.add(caption.toLowerCase());
      }

      contentBlocks.push(
        createImageBlock({
          src,
          alt: getImageAlt($, image, caption),
          caption,
          sortOrder: sortOrder++,
        })
      );

      return;
    }

    const text = cleanText($(element).text());

    if (!text || captionsToSkip.has(text.toLowerCase())) {
      return;
    }

    if (tagName === "p") {
      contentBlocks.push(createTextBlock({ type: "paragraph", text, sortOrder: sortOrder++ }));
      return;
    }

    contentBlocks.push(createTextBlock({ type: "heading", text, sortOrder: sortOrder++ }));
  });

  for (const image of entry.sitemapImages || []) {
    const key = image.key || imageKey(image.src, baseUrl);

    if (!seenImages.has(key) && isLikelyContentImage(image.src)) {
      seenImages.add(key);
      contentBlocks.push(
        createImageBlock({
          src: image.src,
          alt: image.caption || image.title || "",
          caption: image.caption || "",
          sortOrder: sortOrder++,
        })
      );
    }
  }

  const sourceSlug = getArticleSlug(entry.url);
  const override = articleOverridesBySlug[sourceSlug] || {};
  const metadata = articleMetadataBySlug[sourceSlug] || articleMetadataBySlug[override.slug] || {};
  const title = cleanText(
    structuredArticle.headline ||
      $("meta[property='og:title']").attr("content")?.replace(" — World Sciences", "") ||
      $("h1").first().text()
  );
  const excerpt = cleanText(
    $("meta[property='og:description']").attr("content") ||
      contentBlocks.find((block) => block.type === "paragraph")?.text ||
      ""
  );
  const publishedAt =
    toPublishedDate(structuredArticle.datePublished) ||
    toPublishedDate(entry.lastModified) ||
    toPublishedDate($("time").first().attr("datetime"));
  const imageUrl = normalizeUrl(
    structuredArticle.image || $("meta[property='og:image']").attr("content") || entry.sitemapImages?.[0]?.src,
    baseUrl
  );

  return {
    url: entry.url,
    slug: override.slug || (isOpaqueSquarespaceSlug(sourceSlug) ? makeSlug(title) : sourceSlug),
    title,
    excerpt,
    authorName: override.authorName || getAuthorName($, structuredArticle) || "World Sciences",
    publishedAt: override.publishedAt || publishedAt,
    readTime: override.readTime || estimateReadTime(contentBlocks),
    imageUrl: override.imageUrl || imageUrl,
    topics: uniqueSorted([
      ...(entry.topics || []),
      ...(metadata.topics || []),
      ...(override.topics || []),
    ]),
    contentBlocks,
  };
}
