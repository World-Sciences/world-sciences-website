import { Box, Chip, Container, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ArticleCard from "../components/article_card/ArticleCard";
import { articles } from "../data/articles";

export default function Articles() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");

  const topics = ["All", ...new Set(articles.map((article) => article.topic))];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase());

      const matchesTopic = topic === "All" || article.topic === topic;

      return matchesSearch && matchesTopic;
    });
  }, [search, topic]);

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "4.5rem" }, mb: 2 }}>
        Articles
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Browse analysis, essays, and commentary by topic.
      </Typography>

      <TextField
        fullWidth
        label="Search articles"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
        {topics.map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            color={topic === item ? "primary" : "default"}
            onClick={() => setTopic(item)}
          />
        ))}
      </Stack>

      <Grid container spacing={3}>
        {filteredArticles.map((article) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
            <ArticleCard article={article} />
          </Grid>
        ))}
      </Grid>

      {filteredArticles.length === 0 && (
        <Box sx={{ py: 6 }}>
          <Typography>No articles found.</Typography>
        </Box>
      )}
    </Container>
  );
}
