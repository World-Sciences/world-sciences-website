import { Avatar, Box, Chip, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { articles } from "../data/articles";
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

      <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "4.5rem" }, lineHeight: 1 }}>
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

      <Box
        component="img"
        src={article.image}
        alt={article.title}
        sx={{
          width: "100%",
          maxHeight: 460,
          objectFit: "cover",
          borderRadius: 3,
          mb: 5,
        }}
      />

      <Typography
        variant="body1"
        sx={{
          fontSize: "1.15rem",
          lineHeight: 1.9,
        }}
      >
        {article.content}
      </Typography>
    </Container>
  );
}
