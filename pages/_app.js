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
import { CookiesProvider } from "react-cookie";
import Footer from "../src/Footer";
import "../styles/tags.css";
import "../styles/index.css";

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
            <link rel="shortcut icon" href="/favicon.ico" />
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
