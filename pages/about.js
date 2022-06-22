import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ProTip from "../src/ProTip";
import Link from "../src/Link";
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
        About
      </Typography>
    </Box>
  );
}
