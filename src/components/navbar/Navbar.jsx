import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
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
              letterSpacing: 0,
              flexGrow: 1,
            }}
          >
            World Sciences
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                disableRipple
                sx={{
                  position: "relative",
                  color: "text.primary",
                  textTransform: "none",
                  minWidth: "auto",
                  px: 0,
                  py: 1,
                  borderRadius: 0,
                  backgroundColor: "transparent",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "&:focus": {
                    outline: "none",
                    backgroundColor: "transparent",
                  },

                  "&:active": {
                    backgroundColor: "transparent",
                  },

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: 4,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "black",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 0.25s ease",
                  },

                  "&:hover::after": {
                    transform: "scaleX(1)",
                  },

                  "&.active::after": {
                    transform: "scaleX(1)",
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
