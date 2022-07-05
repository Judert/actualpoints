import { Box, Container, Typography } from "@mui/material";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";

export default function Apply() {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <SEO
        title={"Contact Us"}
        description={desc.contact}
        type={"website"}
        url={`${desc.url}/contact`}
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
        <Typography>{desc.email}</Typography>
      </Container>
    </Box>
  );
}
