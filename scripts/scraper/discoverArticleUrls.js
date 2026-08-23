import * as cheerio from "cheerio";
import {
  cleanText,
  imageKey,
  isArticleUrl,
  normalizeUrl,
  topicNameFromListingUrl,
} from "./utils.js";

const DEFAULT_BASE_URL = "https://www.worldsciences.info";

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function readSitemapImages($, urlElement, baseUrl) {
  return $(urlElement)
    .find("image\\:image")
    .toArray()
    .map((imageElement) => {
      const src = normalizeUrl($(imageElement).find("image\\:loc").first().text(), baseUrl);

      return {
        src,
        key: imageKey(src, baseUrl),
        title: cleanText($(imageElement).find("image\\:title").first().text()),
        caption: cleanText($(imageElement).find("image\\:caption").first().text()),
      };
    })
    .filter((image) => image.src);
}

function parseSitemap(xml, baseUrl) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const articles = new Map();
  const listingUrls = [];

  $("url").each((_, element) => {
    const loc = normalizeUrl($(element).find("loc").first().text(), baseUrl);

    if (!loc) {
      return;
    }

    if (isArticleUrl(loc, baseUrl)) {
      articles.set(loc, {
        url: loc,
        lastModified: cleanText($(element).find("lastmod").first().text()),
        sitemapImages: readSitemapImages($, element, baseUrl),
        topics: [],
      });

      return;
    }

    if (loc.includes("/articles/category/") || loc.includes("/articles/tag/")) {
      listingUrls.push(loc);
    }
  });

  return { articles, listingUrls };
}

async function discoverTopicsFromListing(url, baseUrl) {
  const topic = topicNameFromListingUrl(url);

  if (!topic) {
    return [];
  }

  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const articleUrls = new Set();

  $("a[href]").each((_, element) => {
    const href = normalizeUrl($(element).attr("href"), baseUrl);

    if (isArticleUrl(href, baseUrl)) {
      articleUrls.add(href);
    }
  });

  return [...articleUrls].map((articleUrl) => ({ articleUrl, topic }));
}

export async function discoverArticleUrls({ baseUrl = DEFAULT_BASE_URL } = {}) {
  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();
  const sitemapXml = await fetchText(sitemapUrl);
  const { articles, listingUrls } = parseSitemap(sitemapXml, baseUrl);

  for (const listingUrl of listingUrls) {
    const mappings = await discoverTopicsFromListing(listingUrl, baseUrl);

    for (const mapping of mappings) {
      const article = articles.get(mapping.articleUrl);

      if (article && !article.topics.includes(mapping.topic)) {
        article.topics.push(mapping.topic);
      }
    }
  }

  return [...articles.values()];
}
