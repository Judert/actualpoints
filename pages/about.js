import Typography from "@mui/material/Typography";
import SEO from "../components/SEO";
import desc from "../data/descriptions.json";
import ContentInfo from "../components/ContentInfo";

export default function About() {
  return (
    <>
      <SEO
        title={"About"}
        description={desc.about}
        type={"website"}
        url={`${desc.url}/about`}
      />
      <ContentInfo>
        <Typography>{desc.about}</Typography>
      </ContentInfo>
    </>
  );
}
