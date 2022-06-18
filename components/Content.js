import Container from "@mui/material/Container";

export default function Content(props) {
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
        height: "100%",
      }}
    >
      {props.children}
    </Container>
  );
}
