// ChatGPT

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Define the theme
let theme = createTheme({
  palette: {
    background: {
      default: "#8E2DE2",
      paper: "#f2f2f2",
    },
    primary: {
      //lila
      main: "#8E2DE2",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f2f2f2",
    },
    error: {
      main: "#ff3131",
    },
    info: {
      // orange/yellow
      main: "#2E5EAA",
    },
    text: {
      primary: "#ffffff",
      secondary: "#000000",
    },
  },
  typography: {
    fontFamily: "'Inter', Helvetica, Arial, sans-serif",
    h1: {
      fontSize: "4.5rem", // Adjust the size as needed
      // fontWeight: "bold",
    },
    h4: {
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1rem",
    },
    h5: {
      fontSize: "1.7rem",
    },
    body1: {
      fontSize: "1.4rem",
    },
    button: {
      textTransform: "none",
    },
  },
});

// Make the font sizes responsive
theme = responsiveFontSizes(theme);

export default theme;
