import fs from "fs/promises";
import path from "path";
import { makeSlug, uniqueSorted } from "./utils.js";

function authorBio(name) {
  return `${name} is a World Sciences contributor.`;
}

function buildAuthors(articles) {
  const names = uniqueSorted(articles.map((article) => article.authorName));

  return names.map((name, index) => ({
    id: index + 1,
    name,
    slug: makeSlug(name),
    avatarUrl: null,
    bio: authorBio(name),
  }));
}

function buildTopics(articles) {
  const names = uniqueSorted(articles.flatMap((article) => article.topics));

  return names.map((name, index) => ({
    id: index + 1,
    name,
    slug: makeSlug(name),
  }));
}

function buildArticles(articles, authors) {
  const authorBySlug = new Map(authors.map((author) => [author.slug, author]));

  return articles
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .map((article, index) => ({
      id: index + 1,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      authorId: authorBySlug.get(makeSlug(article.authorName))?.id || 1,
      publishedAt: article.publishedAt,
      readTime: article.readTime,
      imageUrl: article.imageUrl,
      topics: article.topics,
      contentBlocks: article.contentBlocks.map((block, blockIndex) => ({
        ...block,
        sortOrder: blockIndex + 1,
      })),
    }));
}

function buildReport(articles) {
  return {
    generatedAt: new Date().toISOString(),
    articleCount: articles.length,
    articles: articles.map((article) => ({
      slug: article.slug,
      title: article.title,
      url: article.url,
      authorName: article.authorName,
      publishedAt: article.publishedAt,
      topics: article.topics,
      imageCount: article.contentBlocks.filter((block) => block.type === "image").length,
      paragraphCount: article.contentBlocks.filter((block) => block.type === "paragraph").length,
      warnings: [
        !article.title && "Missing title",
        !article.publishedAt && "Missing published date",
        !article.topics.length && "Missing topics",
        !article.imageUrl && "Missing cover image",
        !article.contentBlocks.length && "Missing content blocks",
      ].filter(Boolean),
    })),
  };
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

export async function exportSeedData(articles, { outputDir = "seed", dryRun = false } = {}) {
  const authors = buildAuthors(articles);
  const topics = buildTopics(articles);
  const seedArticles = buildArticles(articles, authors);
  const report = buildReport(articles);

  if (!dryRun) {
    await writeJson(path.join(outputDir, "authors.json"), authors);
    await writeJson(path.join(outputDir, "topics.json"), topics);
    await writeJson(path.join(outputDir, "articles.json"), seedArticles);
    await writeJson(path.join(outputDir, "scrape-report.json"), report);
  }

  return {
    authors,
    topics,
    articles: seedArticles,
    report,
  };
}
