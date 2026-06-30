import { Box, Chip, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import ArticleByline from "../components/article_by_line/ArticleByLine";
import { getArticleBySlug, getAuthorById } from "../services/articlesService";

export default function ArticleDetail() {
  const { slug } = useParams();

  const article = getArticleBySlug(slug);
  const author = getAuthorById(article?.authorId);

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

      {article.contentBlocks?.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <Typography
              key={index}
              variant="body1"
              sx={{
                fontSize: "1.15rem",
                lineHeight: 1.9,
                mb: 3,
              }}
            >
              {block.text}
            </Typography>
          );
        }

        if (block.type === "image") {
          return (
            <Box key={index} sx={{ my: 5 }}>
              <Box
                component="img"
                src={block.src}
                alt={block.alt || ""}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  display: "block",
                }}
              />

              {block.caption && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 1,
                    fontStyle: "italic",
                  }}
                >
                  {block.caption}
                </Typography>
              )}
            </Box>
          );
        }

        if (block.type === "heading") {
          return (
            <Typography key={index} variant="h4" sx={{ mt: 5, mb: 2 }}>
              {block.text}
            </Typography>
          );
        }

        if (block.type === "caption") {
          return (
            <Typography
              key={index}
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 4,
                mb: 2,
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              {block.text}
            </Typography>
          );
        }

        return null;
      })}
    </Container>
  );
}
