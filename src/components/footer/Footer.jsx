import { Box, Container, Divider, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 8, py: 4 }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          Copyright 2026 World Sciences. A modern publication prototype.
        </Typography>
      </Container>
    </Box>
  );
}
