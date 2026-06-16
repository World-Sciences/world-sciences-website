import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import slugify from "slugify";
import { articleUrls } from "./articleUrls.js";

const CONTENT_DIR = path.resolve("src/content");
const GENERATED_DATA_FILE = path.resolve("src/data/articles.generated.js");

fs.mkdirSync(CONTENT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(GENERATED_DATA_FILE), { recursive: true });

function makeSlug(text) {
  return slugify(text || "untitled-article", {
    lower: true,
    strict: true,
  });
}

function makeVariableName(slug) {
  return (
    slug
      .split("-")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("") + "Content"
  );
}

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function getImageSrc($, img) {
  return (
    $(img).attr("src") ||
    $(img).attr("data-src") ||
    $(img).attr("data-image") ||
    $(img).attr("data-image-src") ||
    ""
  );
}

function getCaption($, img) {
  const figure = $(img).closest("figure");
  const caption =
    figure.find("figcaption").text().trim() ||
    figure.find(".image-caption").text().trim() ||
    $(img).closest(".sqs-block-image").find(".image-caption").text().trim() ||
    $(img).attr("alt") ||
    "";

  return cleanText(caption);
}

function estimateReadTime(blocks) {
  const words = blocks
    .filter((block) => block.type === "paragraph")
    .map((block) => block.text)
    .join(" ")
    .split(/\s+/).length;

  return `${Math.max(1, Math.ceil(words / 225))} min read`;
}

async function scrapeArticle(url, index) {
  console.log(`Importing: ${url}`);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    cleanText($("h1").first().text()) ||
    cleanText($("meta[property='og:title']").attr("content") || "") ||
    "Untitled Article";

  const slugFromUrl = url.split("/").filter(Boolean).pop();
  const slug = slugFromUrl || makeSlug(title);
  const variableName = makeVariableName(slug);

  const excerpt =
    cleanText($("meta[property='og:description']").attr("content") || "") ||
    cleanText($("p").first().text()).slice(0, 220);

  const coverImage =
    $("meta[property='og:image']").attr("content") ||
    $("article img").first().attr("src") ||
    $("img").first().attr("src") ||
    "";

  const date =
    cleanText($("time").first().attr("datetime") || $("time").first().text()) ||
    "";

  const author =
    cleanText($("[rel='author']").first().text()) ||
    cleanText($(".author").first().text()) ||
    "World Sciences";

  const contentBlocks = [];
  const seenImages = new Set();

  const articleRoot =
    $("article").first().length > 0
      ? $("article").first()
      : $(".blog-item-content, .entry-content, main").first();

  articleRoot.find("p, h2, h3, figure, img").each((_, el) => {
    const tag = el.tagName?.toLowerCase();

    if (tag === "p") {
      const text = cleanText($(el).text());

      if (
        text &&
        text !== title &&
        !text.toLowerCase().includes("subscribe")
      ) {
        contentBlocks.push({
          type: "paragraph",
          text,
        });
      }
    }

    if (tag === "h2" || tag === "h3") {
      const text = cleanText($(el).text());

      if (text) {
        contentBlocks.push({
          type: "heading",
          text,
        });
      }
    }

    if (tag === "figure") {
      const img = $(el).find("img").first();
      const src = getImageSrc($, img);

      if (src && !seenImages.has(src)) {
        seenImages.add(src);

        contentBlocks.push({
          type: "image",
          src,
          alt: img.attr("alt") || "",
          caption: cleanText($(el).find("figcaption").text()) || getCaption($, img),
        });
      }
    }

    if (tag === "img") {
      const src = getImageSrc($, el);

      if (src && !seenImages.has(src)) {
        seenImages.add(src);

        contentBlocks.push({
          type: "image",
          src,
          alt: $(el).attr("alt") || "",
          caption: getCaption($, el),
        });
      }
    }
  });

  const contentFileName = `${slug}.js`;
  const contentFilePath = path.join(CONTENT_DIR, contentFileName);

  const contentFile = `export const ${variableName} = ${JSON.stringify(
    contentBlocks,
    null,
    2
  )};
`;

  fs.writeFileSync(contentFilePath, contentFile);

  return {
    id: index + 1,
    slug,
    title,
    excerpt,
    topic: "Geopolitical Strategy",
    authorId: 1,
    author,
    date: date ? date.slice(0, 10) : "",
    readTime: estimateReadTime(contentBlocks),
    image: coverImage,
    contentImport: variableName,
    contentFile: contentFileName.replace(".js", ""),
  };
}

async function run() {
  const articles = [];

  for (let i = 0; i < articleUrls.length; i++) {
    try {
      const article = await scrapeArticle(articleUrls[i], i);
      articles.push(article);
    } catch (err) {
      console.error(err.message);
    }
  }

  const imports = articles
    .map(
      (article) =>
        `import { ${article.contentImport} } from "../content/${article.contentFile}";`
    )
    .join("\n");

  const articleObjects = articles
    .map(
      (article) => `  {
    id: ${article.id},
    slug: "${article.slug}",
    title: ${JSON.stringify(article.title)},
    excerpt: ${JSON.stringify(article.excerpt)},
    topic: "${article.topic}",
    authorId: ${article.authorId},
    date: "${article.date}",
    readTime: "${article.readTime}",
    image: ${JSON.stringify(article.image)},
    contentBlocks: ${article.contentImport},
  }`
    )
    .join(",\n");

  const generatedFile = `${imports}

export const articles = [
${articleObjects},
];
`;

  fs.writeFileSync(GENERATED_DATA_FILE, generatedFile);

  console.log("\nDone.");
  console.log("Generated content files in: src/content/");
  console.log("Generated article metadata at: src/data/articles.generated.js");
}

run();