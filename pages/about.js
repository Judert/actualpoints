import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SEO from "../components/SEO";

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
        // TODO: Add a description
        description={
          "We condense high quality information for your reading pleasure"
        }
        type={"website"}
        url={`https://www.actualpoints.com/about`}
      />
      <Typography // TODO: add a description
      >
        We condense high quality information for your reading pleasure
      </Typography>
    </Box>
  );
}
