import Category from "../../data/category.json";
import Content from "../../components/Content";
import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export default function CategoryAll() {
  const router = useRouter();

  return (
    <Content>
      <Typography variant="h4">Categories</Typography>
      <Grid container spacing={2}>
        {Category.map((category) => (
          <Grid
            md={4}
            item
            key={category.id}
            style={{ position: "relative" }}
            onClick={() => router.push("/category/" + category.id)}
          >
            <Image
              alt={category.name}
              src={category.image}
              width={300}
              height={300}
              layout="intrinsic"
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
          </Grid>
        ))}
      </Grid>
    </Content>
  );
}
