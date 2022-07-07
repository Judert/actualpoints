import { Button } from "@mui/material";
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
