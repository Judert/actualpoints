import Typography from "@mui/material/Typography";
import desc from "../data/descriptions.json";
import ContentInfo from "../components/ContentInfo";
import Head from "next/head";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
      </Head>
      <ContentInfo>
        <Typography>{desc.error500}</Typography>
      </ContentInfo>
    </>
  );
}
