import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";

export default function About() {
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
        title={"About"}
        description={desc.about}
        type={"website"}
        url={`${desc.url}/about`}
      />
      <Typography>{desc.about}</Typography>
    </Box>
  );
}
