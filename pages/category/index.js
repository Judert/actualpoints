import Content from "../../components/Content";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";
import SEO from "../../components/SEO";
import { collection, getDocs } from "firebase/firestore";
import { db, otherToJSON } from "../../lib/firebase";
import ImageShimmer from "../../components/ImageShimmer";
import desc from "../../data/descriptions.json";

export async function getStaticProps() {
  const categories = (await getDocs(collection(db, "Category"))).docs.map(
    otherToJSON
  );

  return {
    props: { categories },
    revalidate: 43200,
  };
}

export default function CategoryAll(props) {
  return (
    <Content>
      <SEO
        title={"Categories"}
        description={desc.categories}
        type={"website"}
        url={`${desc.url}/category`}
      />
      <Typography component="h1" variant="h3">
        Categories
      </Typography>
      <Grid container spacing={2}>
        {props.categories.map((category) => (
          <Category key={category.id} category={category} />
        ))}
      </Grid>
    </Content>
  );
}

function Category({ category }) {
  return (
    <Link href={`/category/${category.id}`} passHref>
      <Grid xs={12} sm={6} md={4} item>
        <Paper elevation={6} style={{ position: "relative" }}>
          <ImageShimmer
            alt={category.name}
            src={category.img}
            width={1000}
            height={400}
            layout="responsive"
            priority={true}
            objectFit="cover"
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "primary.main",
              opacity: 0.7,
              height: "100%",
              width: "100%",
              // zIndex: "100",
            }}
          />
          <Typography
            component="h2"
            variant="h5"
            style={{
              position: "absolute",
              color: "white",
              left: "12.5%",
              top: "50%",
              transform: "translate(-12.5%, -50%)",
            }}
          >
            {category.name}
          </Typography>
        </Paper>
      </Grid>
    </Link>
  );
}
