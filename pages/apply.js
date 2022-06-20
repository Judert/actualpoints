import { Box, Typography } from "@mui/material";

export default function Apply() {
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
      <Typography>info@veselcode.com</Typography>
    </Box>
  );
}
