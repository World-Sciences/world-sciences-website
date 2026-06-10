import { createTheme } from "@mui/material/styles"

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#0b0b0b" },
        secondary: { main: "#666666"},
        background: {
            default: "#ffffff",
            paper: "#f7f7f4",
        },
        text: {
            primary: "#0b0b0b",
            secondary: "#5f5f5f",
        },
        divider: "#deded8",
    },
    
    typography: {
        fontFamily: `"Inter", "Halventica", "Arial", sans-serif`,
        h1: { fontFamily: `"Georgia", serif`, fontWeight: 500 },
        h2: { fontFamily: `"Georgia", serif`, fontWeight: 500 },
        h3: { fontFamily: `"Georgia", serif`, fontWeight: 500 },
        h4: { fontFamily: `"Georgia", serif`, fontWeight: 500 },
        h5: { fontFamily: `"Georgia", serif`, fontWeight: 500 },
        button: { textTransform: "none", fontWeight: 600 },  
    },
    shape: {
        borderRadius: 10,
    },
});

export default theme;