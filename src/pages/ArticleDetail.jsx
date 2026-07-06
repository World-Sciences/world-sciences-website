import { Box, Chip, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ArticleContent from "../components/article_content/ArticleContent";
import ArticleByline from "../components/article_by_line/ArticleByLine";
import { getArticleBySlug, getAuthorById, getLocalArticleBySlug } from "../services/articlesService";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(() => getLocalArticleBySlug(slug));
  const author = article?.author || getAuthorById(article?.authorId);

  useEffect(() => {
    let isMounted = true;

    getArticleBySlug(slug).then((loadedArticle) => {
      if (isMounted) {
        setArticle(loadedArticle);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Typography variant="h3">Article not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 7 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {(article.topics || [article.topic]).map((topic) => (
          <Chip key={topic} label={topic} />
        ))}
      </Box>

      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "3rem", md: "4.5rem" },
          lineHeight: 1,
        }}
      >
        {article.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        {article.excerpt}
      </Typography>

      <ArticleByline article={article} author={author} sx={{ my: 4 }} />

      <ArticleContent blocks={article.contentBlocks} />
    </Container>
  );
}
