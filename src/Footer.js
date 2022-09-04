import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "../src/Link";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { Box, Button, Container, IconButton, Stack } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";

export default function Footer() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cookies, setCookie] = useCookies(["consent"]);

  useEffect(() => {
    if (cookies["consent"] == null) {
      enqueueSnackbar("Please accept the cookies to use this site", {
        variant: "info",
        preventDuplicate: true,
        persist: true,
        action,
      });
    }
  }, []);

  const action = (key) => (
    <React.Fragment>
      <Button
        size="small"
        color="inherit"
        onClick={() => {
          setCookie("consent", true, { path: "/" });
          closeSnackbar(key);
        }}
      >
        Accept
      </Button>
    </React.Fragment>
  );

  return (
    <Box sx={{ display: "flex", backgroundColor: "primary.main" }}>
      <Container
        maxWidth="md"
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 3,
          color: "white",
        }}
      >
        <Stack spacing={1} direction={"row"}>
          <Button color="inherit" component={Link} noLinkStyle href="/">
            Home
          </Button>
          <Button color="inherit" component={Link} noLinkStyle href="/about">
            About
          </Button>
          <Button color="inherit" component={Link} noLinkStyle href="/contact">
            Contact Us
          </Button>
        </Stack>
        <Stack spacing={1} direction={"row"}>
          <IconButton
            // passHref
            href="https://www.pinterest.com/actualpoints/"
            color="inherit"
            component={Link}
            noLinkStyle
            aria-label="Pinterest"
          >
            <PinterestIcon />
          </IconButton>
          <IconButton
            // passHref
            href="https://www.instagram.com/actualpoints/"
            color="inherit"
            component={Link}
            noLinkStyle
            aria-label="Instagram"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            // passHref
            href="https://twitter.com/actualpoints"
            color="inherit"
            component={Link}
            noLinkStyle
            aria-label="Twitter"
          >
            <TwitterIcon />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="inherit" align="center">
          {"Copyright © veselcode"} {new Date().getFullYear()}.
        </Typography>
      </Container>
    </Box>
  );
}
