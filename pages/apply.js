import { Box, Typography } from "@mui/material";
import SEO from "../components/SEO";

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
      <SEO
        title={"Apply"}
        description={
          "Apply for a position at Actual Points. We are looking for talented people to join our team."
        }
        type={"website"}
        url={`https://www.actualpoints.com/apply`}
      />
      <Typography>info@veselcode.com</Typography>
    </Box>
  );
}
