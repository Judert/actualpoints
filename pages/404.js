import { Box, Container, Typography } from "@mui/material";

export default function Custom404() {
  return (
    <Box
      component="main"
      sx={{
        height: window.outerHeight,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        // alignItems: "center",
        backgroundColor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Typography mt={20}>404 - Page not found</Typography>
    </Box>
  );
}
