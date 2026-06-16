import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArticleCard from "../components/article_card/ArticleCard";
import NewsletterSignup from "../components/newsletter/NewsletterSignup";
import { articles } from "../data/articles.generated";
import { authors } from "../data/authors";

export default function Home() {
  const featured = articles[0];
  const latest = articles.slice(1);
  const featuredAuthor = authors.find((a) => a.id === featured?.authorId);

  if (!featured) {
    return <Typography>No featured article found.</Typography>;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Grid container spacing={6} sx={{ alignItems: "center", mb: 10 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
              Independent Analysis
            </Typography>

            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "3rem", md: "5rem" }, lineHeight: 1, mb: 3 }}
            >
              Exploring the deeper implications of world events.
            </Typography>

            <Typography color="text.secondary" sx={{ maxWidth: 560, mb: 4 }}>
              World Sciences provides thoughtful analysis on geopolitics, science,
              technology, history, and the forces shaping the modern world.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button variant="contained" component={Link} to="/articles">
                Read Articles
              </Button>

              <Button variant="outlined" component={Link} to="/about">
                Learn More
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={featured.image}
              alt="World Sciences hero"
              sx={{
                width: "100%",
                height: { xs: 300, md: 460 },
                objectFit: "cover",
                borderRadius: 3,
                display: "block",
              }}
            />
          </Grid>
        </Grid>

        {/* Featured Article Card */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h3" sx={{ mb: 4 }}>
            Featured Article
          </Typography>

          <Box
            component={Link}
            to={`/articles/${featured.slug}`}
            sx={{ display: "block", textDecoration: "none", color: "inherit" }}
          >
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden",
                backgroundColor: "background.paper",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Box
                component="img"
                src={featured.image}
                alt={featured.title}
                sx={{
                  width: "100%",
                  height: { xs: 300, md: 520 },
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <Box sx={{ p: { xs: 3, md: 5 } }}>
                <Chip label={featured.topic} size="small" sx={{ mb: 2 }} />

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.25rem", md: "4rem" },
                    lineHeight: 1,
                    mb: 2,
                  }}
                >
                  {featured.title}
                </Typography>

                <Typography color="text.secondary" sx={{ maxWidth: 850, fontSize: "1.1rem", mb: 3 }}>
                  {featured.excerpt}
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar src={featuredAuthor?.avatar} alt={featuredAuthor?.name}>
                    {featuredAuthor?.name?.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography variant="body2">{featuredAuthor?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {featured.date} · {featured.readTime}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Latest Articles */}
        <Box>
          <Typography variant="h3" sx={{ mb: 4 }}>
            Latest Articles
          </Typography>

          <Grid container spacing={3}>
            {latest.map((article) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                <ArticleCard article={article} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <NewsletterSignup />
    </>
  );
}
