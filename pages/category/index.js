import Content from "../../components/Content";
import { Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
import { categoryToJSON, db } from "../../lib/firebase";

export { getStaticProps } from "../index";

export default function CategoryAll(props) {
  return (
    <Content>
      <Typography variant="h3">Categories</Typography>
      <Grid container spacing={2}>
        {props.categories.map((category) => (
          <Link href={`/category/${category.id}`} passHref key={category.id}>
            <Grid xs={12} sm={6} md={4} item style={{ position: "relative" }}>
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
