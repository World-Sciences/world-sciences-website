import { Autocomplete, Box, Chip, Container, Grid, TextField, Typography } from "@mui/material";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import ArticleCard from "../components/article_card/ArticleCard";
import { getArticles, newestArticles } from "../services/articlesService";

const suggestionTypeOrder = {
  Topic: 0,
  Article: 1,
  Author: 2,
};

export default function Articles() {
  const [articles, setArticles] = useState(newestArticles);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");

  useEffect(() => {
    let isMounted = true;

    getArticles().then((loadedArticles) => {
      if (isMounted) {
        setArticles(loadedArticles);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const searchSuggestions = [
    ...articles.map((article) => ({
      label: article.title,
      type: "Article",
      keywords: [
        ...article.topics,
        ...article.searchTerms,
        article.authorName,
      ],
    })),
    ...[...new Set(articles.flatMap((article) => article.topics))].map((item) => ({
      label: item,
      type: "Topic",
      keywords: [],
    })),
    ...[...new Set(articles.map((article) => article.authorName).filter(Boolean))].map(
      (authorName) => ({
        label: authorName,
        type: "Author",
        keywords: [],
      })
    ),
  ];

  const suggestionSearch = new Fuse(searchSuggestions, {
    ignoreLocation: true,
    minMatchCharLength: 2,
    shouldSort: true,
    threshold: 0.35,
    keys: [
      { name: "label", weight: 0.75 },
      { name: "keywords", weight: 0.25 },
    ],
  });

  const articleSearch = new Fuse(articles, {
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
    shouldSort: true,
    threshold: 0.35,
    keys: [
      { name: "title", weight: 0.35 },
      { name: "excerpt", weight: 0.2 },
      { name: "topics", weight: 0.2 },
      { name: "searchTerms", weight: 0.2 },
      { name: "authorName", weight: 0.2 },
      { name: "authorSlug", weight: 0.15 },
      { name: "authorBio", weight: 0.1 },
    ],
  });

  const topics = [
    "All",
    ...new Set(articles.flatMap((article) => article.topics)),
  ].sort((left, right) => {
    if (left === "All") {
      return -1;
    }

    if (right === "All") {
      return 1;
    }

    return left.localeCompare(right);
  });

  const searchedArticles = search.trim()
    ? articleSearch.search(search.trim()).map((result) => result.item)
    : articles;

  const visibleSearchSuggestions =
    search.trim().length >= 2
      ? suggestionSearch
          .search(search.trim())
          .slice(0, 12)
          .map((result, index) => ({ ...result.item, scoreIndex: index }))
          .sort((left, right) => {
            const typeDifference = suggestionTypeOrder[left.type] - suggestionTypeOrder[right.type];

            if (typeDifference !== 0) {
              return typeDifference;
            }

            return left.scoreIndex - right.scoreIndex;
          })
          .slice(0, 6)
      : [];

  const filteredArticles = searchedArticles.filter((article) => {
    const matchesTopic = topic === "All" || article.topics.includes(topic);

    return matchesTopic;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "4.5rem" }, mb: 2 }}>
        Articles
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Browse analysis, essays, and commentary by topic.
      </Typography>

      <Autocomplete
        freeSolo
        fullWidth
        clearOnBlur={false}
        filterOptions={(options) => options}
        getOptionLabel={(option) => (typeof option === "string" ? option : option.label)}
        groupBy={(option) => option.type}
        open={visibleSearchSuggestions.length > 0}
        options={visibleSearchSuggestions}
        inputValue={search}
        value={null}
        onChange={(_, value) => {
          if (typeof value === "string") {
            setSearch(value);
            return;
          }

          setSearch(value?.label || "");
        }}
        onInputChange={(_, value, reason) => {
          if (reason !== "reset") {
            setSearch(value);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search articles, topics, or authors" />
        )}
        sx={{ mb: 3 }}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mb: 4,
          maxWidth: 1100,
        }}
      >
        {topics.map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            color={topic === item ? "primary" : "default"}
            onClick={() => setTopic(item)}
          />
        ))}
      </Box>

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
