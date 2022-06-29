import { Box, Typography } from "@mui/material";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";

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
        description={desc.apply}
        type={"website"}
        url={`${desc.url}/apply`}
      />
      <Typography>{desc.email}</Typography>
    </Box>
  );
}
