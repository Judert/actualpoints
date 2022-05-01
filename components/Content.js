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
        alignItems: "left",
        flexDirection: "column",
        rowGap: 2,
        // backgroundColor: "secondary.main",
        // textAlign: "left",
      }}
    >
      {props.children}
    </Container>
  );
}
