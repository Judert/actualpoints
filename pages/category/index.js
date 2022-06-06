import Content from "../../components/Content";
import { Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
import { categoryToJSON, db } from "../../lib/firebase";

export async function getStaticProps() {
  const categories = (await getDocs(collection(db, "Category"))).docs.map(
    categoryToJSON
  );

  return {
    props: { categories },
    revalidate: 60 * 60 * 6,
  };
}

export default function CategoryAll(props) {
  console.log(props);
  return (
    <Content>
      <Typography variant="h3">Categories</Typography>
      <Grid container spacing={2}>
        {props.categories.map((category) => (
          <Link href={`/category/${category.id}`} passHref key={category.id}>
            <Grid md={4} item style={{ position: "relative" }}>
              <Paper elevation={6}>
                <Image
                  alt={category.name}
                  src={category.img}
                  width={300}
                  height={300}
                  layout="responsive"
                />
                <Typography
                  variant="h5"
                  style={{
                    position: "absolute",
                    color: "white",
                    top: "12.5%",
                    left: "12.5%",
                  }}
                >
                  {category.name}
                </Typography>
              </Paper>
            </Grid>
          </Link>
        ))}
      </Grid>
    </Content>
  );
}
