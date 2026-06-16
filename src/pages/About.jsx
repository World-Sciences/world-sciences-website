import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export default function About() {
  return (
    <Box sx={{ backgroundColor: "#000", color: "#fff", py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Who We Are */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4.5rem" },
                mb: 4,
                color: "#e5e5e5",
              }}
            >
              Who we are
            </Typography>

            <Typography
              sx={{
                fontSize: "1.2rem",
                lineHeight: 1.8,
                color: "#f1f1f1",
              }}
            >
              World Sciences is an independent publication focused on examining
              global events, emerging trends, and the broader systems shaping the
              modern world. Through thoughtful editorial work and long-form
              analysis, World Sciences explores the deeper context behind
              geopolitical developments, economic shifts, and societal change.
              Rather than reacting to headlines alone, World Sciences is
              dedicated to understanding the patterns, forces, and historical
              context that influence events across regions and industries.
            </Typography>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4.5rem" },
                mb: 4,
                color: "#e5e5e5",
              }}
            >
              Contact Us
            </Typography>

            <Typography sx={{ mb: 1 }}>Name</Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#ddd" } }}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#ddd" } }}
                  sx={fieldStyles}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ style: { color: "#ddd" } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ style: { color: "#ddd" } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  sx={fieldStyles}
                  InputLabelProps={{ style: { color: "#ddd" } }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                px: 4,
                py: 1.4,
                borderRadius: 999,
                backgroundColor: "#e8e8e8",
                color: "#000",
                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const fieldStyles = {
  mb: 2,

  "& .MuiInputLabel-root": {
    color: "#9e9e9e", // medium gray
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#bdbdbd",
  },

  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "8px",

    "& fieldset": {
      borderColor: "#ddd",
    },

    "&:hover fieldset": {
      borderColor: "#fff",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#fff",
    },
  },
};
