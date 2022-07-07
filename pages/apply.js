import { Button } from "@mui/material";
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
        <Button
          sx={{ textTransform: "none" }}
          color="inherit"
          onClick={() =>
            window.open(
              "mailto:" + desc.email + "?subject=Enquiry&body=Hi there,%0A%0A"
            )
          }
        >
          {desc.email}
        </Button>
      </ContentInfo>
    </>
  );
}
