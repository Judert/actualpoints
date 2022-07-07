import { Typography } from "@mui/material";
import ContentInfo from "../components/ContentInfo";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";

export default function Apply() {
  return (
    <>
      <SEO
        title={"Apply"}
        description={desc.apply}
        type={"website"}
        url={`${desc.url}/apply`}
      />
      <ContentInfo>
        <Typography>{desc.email}</Typography>
      </ContentInfo>
    </>
  );
}
