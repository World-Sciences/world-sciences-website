import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Articles", path: "/articles" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Typography
            component={NavLink}
            to="/"
            variant="h5"
            sx={{
              color: "text.primary",
              textDecoration: "none",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.03em",
              flexGrow: 1,
            }}
          >
            World Sciences
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "text.primary",
                  "&.active": {
                    borderBottom: "2px solid black",
                    borderRadius: 0,
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
