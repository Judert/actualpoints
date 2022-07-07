import Container from "@mui/material/Container";
import { useHeight } from "../lib/hooks";

export default function Content(props) {
  const height = useHeight();
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        mt: 3,
        mb: 4,
        display: "flex",
        alignItems: "left",
        flexDirection: "column",
        rowGap: 2,
        minHeight: height,
      }}
    >
      {props.children}
    </Container>
  );
}
