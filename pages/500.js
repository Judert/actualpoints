import { Box, Typography } from "@mui/material";

export default function Custom500() {
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
      <Typography>500 - An error occurred</Typography>
    </Box>
  );
}
