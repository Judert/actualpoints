import Typography from "@mui/material/Typography";
import desc from "../data/descriptions.json";
import ContentInfo from "../components/ContentInfo";
import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>400 - Page not found</title>
      </Head>
      <ContentInfo>
        <Typography>{desc.error404}</Typography>
      </ContentInfo>
    </>
  );
}
