import { Box, Container, Typography } from "@mui/material";

export default function Custom404() {
  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Typography>404 - Page not found</Typography>
    </Box>
  );
}
