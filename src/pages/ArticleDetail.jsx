import { Avatar, Box, Chip, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { articles } from "../data/articles.generated";
import { authors } from "../data/authors";

export default function ArticleDetail() {
  const { slug } = useParams();

  const article = articles.find((item) => item.slug === slug);
  const author = authors.find((a) => a.id === article?.authorId);

  if (!article) {
    return (
      <Container maxWidth="md" sx={{ py: 7 }}>
        <Typography variant="h3">Article not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 7 }}>
      <Chip label={article.topic} sx={{ mb: 3 }} />

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

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ my: 4 }}>
        <Avatar src={author?.avatar} alt={author?.name}>
          {author?.name?.charAt(0)}
        </Avatar>

        <Box>
          <Typography>{author?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {article.date} · {article.readTime}
          </Typography>
        </Box>
      </Stack>

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
