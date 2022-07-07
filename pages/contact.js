import { Typography } from "@mui/material";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";
import ContentInfo from "../components/ContentInfo";

export default function Apply() {
  return (
    <>
      <SEO
        title={"Contact Us"}
        description={desc.contact}
        type={"website"}
        url={`${desc.url}/contact`}
      />
      <ContentInfo>
        <Typography>{desc.email}</Typography>
      </ContentInfo>
    </>
  );
}
