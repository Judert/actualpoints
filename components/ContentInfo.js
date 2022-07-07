import { Box, Container } from "@mui/material";
import { useHeight } from "../lib/hooks";

export default function ContentInfo(props) {
  const height = useHeight();
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          minHeight: height,
        }}
      >
        {props.children}
      </Container>
    </Box>
  );
}
