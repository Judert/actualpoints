import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import { SnackbarProvider } from "notistack";
import { Box, Button, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CookiesProvider } from "react-cookie";
import { useCookies } from "react-cookie";
import Copyright from "../src/Copyright";
import { useSnackbar } from "notistack";
import "../styles/tags.css";
import "../styles/index.css";
import { useEffect } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const userData = useUserData();

  return (
    <CookiesProvider>
      <UserContext.Provider value={userData}>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <CssBaseline />
              <Navbar />
              <Component {...pageProps} />
              <Footer />
            </SnackbarProvider>
          </ThemeProvider>
        </CacheProvider>
      </UserContext.Provider>
    </CookiesProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

function Footer() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cookies, setCookie] = useCookies(["consent"]);

  useEffect(() => {
    if (!cookies.consent) {
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
          rowGap: 2,
        }}
      >
        <Copyright />
      </Container>
    </Box>
  );
}
