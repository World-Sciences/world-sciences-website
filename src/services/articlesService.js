import { articleMetadataBySlug } from "../data/articleMetadata";
import { articles } from "../data/articles.generated";
import { authors } from "../data/authors";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5156";
const authorById = new Map(authors.map((author) => [author.id, author]));

export const enrichedArticles = articles.map(enrichLocalArticle);
export const newestArticles = [...enrichedArticles].reverse();

export async function getArticles() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles`);

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.status}`);
    }

    const apiArticles = await response.json();

    return apiArticles
      .map(mapApiArticle)
      .sort((left, right) => new Date(right.publishedAt) - new Date(left.publishedAt));
  } catch {
    return newestArticles;
  }
}

export async function getArticleBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const apiArticle = await response.json();

    return mapApiArticle(apiArticle);
  } catch {
    return getLocalArticleBySlug(slug);
  }
}

export function getLocalArticleBySlug(slug) {
  return enrichedArticles.find((article) => article.slug === slug);
}

export function getAuthorById(authorId) {
  return authorById.get(authorId);
}

function enrichLocalArticle(article) {
  const metadata = articleMetadataBySlug[article.slug] || {};
  const author = authorById.get(article.authorId);

  return {
    ...article,
    topics: metadata.topics || [article.topic],
    searchTerms: metadata.searchTerms || [],
    authorName: author?.name || "",
    authorSlug: author?.slug || "",
    authorBio: author?.bio || "",
  };
}

function mapApiArticle(apiArticle) {
  const metadata = articleMetadataBySlug[apiArticle.slug] || {};
  const topics = apiArticle.topics?.length ? apiArticle.topics : metadata.topics || [];
  const author = mapApiAuthor(apiArticle.author);

  return {
    id: apiArticle.id,
    slug: apiArticle.slug,
    title: apiArticle.title,
    excerpt: apiArticle.excerpt,
    topic: topics[0] || "World Affairs",
    topics,
    searchTerms: metadata.searchTerms || [],
    author,
    authorId: author.id,
    authorName: author.name || "",
    authorSlug: author.slug || "",
    authorBio: author.bio || "",
    date: formatArticleDate(apiArticle.publishedAt),
    publishedAt: apiArticle.publishedAt,
    readTime: apiArticle.readTime,
    image: apiArticle.imageUrl,
    contentBlocks: mapApiContentBlocks(apiArticle.contentBlocks || []),
  };
}

function mapApiAuthor(author = {}) {
  return {
    id: author.id,
    name: author.name || "",
    slug: author.slug || "",
    avatar: author.avatarUrl || "",
    bio: author.bio || "",
  };
}

function mapApiContentBlocks(blocks) {
  return [...blocks]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((block) => ({
      type: block.type,
      text: block.text,
      src: block.src,
      alt: block.alt,
      caption: block.caption,
    }));
}

function formatArticleDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
