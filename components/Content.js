import Container from "@mui/material/Container";

export default function Content(props) {
  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{
        my: 4,
        display: "flex",
        // justifyContent: "center",
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
