import { Container, Grid, Paper, Typography } from "@mui/material";

export default function About() {
  return (
    <Container maxWidth="lg" sx={{ py: 7 }}>
      <Typography variant="h1" sx={{ fontSize: { xs: "3rem", md: "4.5rem" }, mb: 3 }}>
        About World Sciences
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            World Sciences is an independent publication focused on examining global events, emerging trends, 
            and the broader systems shaping the modern world. Through thoughtful editorial work and long-form analysis, 
            World Sciences explores the deeper context behind geopolitical developments, economic shifts, and societal change. 
            Rather than reacting to headlines alone, World Sciences is dedicated to understanding the patterns, forces, and 
            historical context that influence events across regions and industries. 
            The goal of World Sciences is to provide readers with structured insight and perspective, offering a space for careful analysis of the developments 
            that continue to shape the global landscape.
          </Typography>
        </Grid>

        <Grid item xs={12} md={7}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
                Our editorial work focuses on providing context and thoughtful perspective to readers through examining global events, 
                emerging trends, and the broader forces shaping the modern world.
            </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 4, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h5" gutterBottom>
              TODO:
            </Typography>
            <Typography color="text.secondary">
              Cleaner article browsing, stronger visual hierarchy, responsive layouts,
              author profiles, and a future-ready structure for search, filtering, and admin tools.

              Expand About page to feature authors, editors, etc.

              Basically do a lot more work than this, but still a decent prototype.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
