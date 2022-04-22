import Container from "@mui/material/Container";

export default function Content(props) {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        rowGap: 2,
        // textAlign: "left",
      }}
    >
      {props.children}
    </Container>
  );
}
