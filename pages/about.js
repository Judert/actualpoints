import * as React from "react";
import Typography from "@mui/material/Typography";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";
import { Container, Box } from "@mui/material";

export default function About() {
  return (
    <Box
      sx={{
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
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography>{desc.about}</Typography>
      </Container>
    </Box>
  );
}
