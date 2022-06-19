import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    info: {
      main: "#000000",
    },
  },
  typography: {
    fontFamily: ["Inconsolata", "monospace"].join(","),
  },
  shape: {
    borderRadius: 0,
  },
});

export default theme;
