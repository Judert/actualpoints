import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Inconsolata:300,400,500,700&display=swap"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="theme-color" content="#ffffff" />
          {/* Pinterest */}
          <meta
            name="p:domain_verify"
            content="8f86e083fcc386b32c20771a3692c197"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(e){if(!window.pintrk){window.pintrk = function () {
                window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                  n=window.pintrk;n.queue=[],n.version="3.0";var
                  t=document.createElement("script");t.async=!0,t.src=e;var
                  r=document.getElementsByTagName("script")[0];
                  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
                pintrk('load', '2614021609838');
                pintrk('page');
      `,
            }}
          />
          {/* Adsense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5229445093898575"
            crossOrigin="anonymous"
          ></script>
          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
