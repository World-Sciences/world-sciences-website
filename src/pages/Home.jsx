import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticleByline from "../components/article_by_line/ArticleByLine";
import ArticleCard from "../components/article_card/ArticleCard";
import NewsletterSignUp from "../components/newsletter/NewsletterSignUp";
import wsLogo from "../assets/images/ws_logo.jpg";
import { getArticles, getAuthorById, newestArticles } from "../services/articlesService";

export default function Home() {
  const [homeArticles, setHomeArticles] = useState(newestArticles);
  const featured = homeArticles[0];
  const latest = homeArticles.slice(1, 4);
  const featuredAuthor = featured?.author || getAuthorById(featured?.authorId);

  useEffect(() => {
    let isMounted = true;

    getArticles().then((articles) => {
      if (isMounted) {
        setHomeArticles(articles);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!featured) {
    return <Typography>No featured article found.</Typography>;
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Grid container spacing={6} sx={{ alignItems: "center", mb: 10 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0 }}>
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
              src={wsLogo}
              alt="World Sciences hero"
              sx={{
                width: "100%",
                height: { xs: 300, md: 460 },
                objectFit: "contain",
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
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {(featured.topics || [featured.topic]).slice(0, 4).map((topic) => (
                    <Chip key={topic} label={topic} size="small" />
                  ))}
                </Box>

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

                <ArticleByline article={featured} author={featuredAuthor} />
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button variant="outlined" component={Link} to="/articles">
              View All Articles
            </Button>
          </Box>
        </Box>
      </Container>

      <NewsletterSignUp />
    </>
  );
}
