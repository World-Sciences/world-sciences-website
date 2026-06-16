import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function NewsletterSignup() {
  return (
    <Box sx={{ py: 8, backgroundColor: "background.default" }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h3" gutterBottom>
            Never miss a World Sciences article.
          </Typography>

          <Typography color="text.secondary" sx={{ maxWidth: 720, mx: "auto" }}>
            Join the World Sciences newsletter for periodic updates on newly published
            articles and ongoing analysis
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backgroundColor: "#f8f8f8",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Name
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="First Name" variant="outlined" />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Last Name" variant="outlined" />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Email" type="email" variant="outlined" />
            </Grid>
          </Grid>

          <FormControlLabel
            sx={{ mt: 1 }}
            control={<Checkbox />}
            label="Sign up for news and updates"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 999,
              backgroundColor: "#000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#222",
              },
            }}
          >
            Submit
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}