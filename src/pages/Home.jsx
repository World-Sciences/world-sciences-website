import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArticleCard from "../components/article_card/ArticleCard";
import { articles } from "../data/articles";

export default function Home() {
  const featured = articles[0];
  const latest = articles.slice(1);

  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      <Grid container spacing={5} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="overline" color="text.secondary">
            Independent Analysis
          </Typography>

          <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "5rem" }, lineHeight: 1 }}>
            Exploring the Deeper Implications of World Events.
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 3, maxWidth: 560 }}>
            Our editorial work focuses on providing context and thoughtful perspective to 
            readers through examining global events, emerging trends, and the broader forces shaping the modern world.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="contained" component={Link} to="/articles">
              Read Articles
            </Button>
            <Button variant="outlined" component={Link} to="/about">
              About Us
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={featured.image}
            alt={featured.title}
            sx={{
              width: "100%",
              height: { xs: 280, md: 430 },
              objectFit: "cover",
              borderRadius: 3,
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Latest Articles
        </Typography>

        <Grid container spacing={3}>
          {latest.map((article) => (
            <Grid size={{ xs: 12, md: 6 }}>
              <ArticleCard article={article} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
