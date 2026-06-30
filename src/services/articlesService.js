import { articleMetadataBySlug } from "../data/articleMetadata";
import { articles } from "../data/articles.generated";
import { authors } from "../data/authors";

const authorById = new Map(authors.map((author) => [author.id, author]));

export const enrichedArticles = articles.map((article) => {
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
});

export const newestArticles = [...enrichedArticles].reverse();

export function getArticleBySlug(slug) {
  return enrichedArticles.find((article) => article.slug === slug);
}

export function getAuthorById(authorId) {
  return authorById.get(authorId);
}
