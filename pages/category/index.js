import Category from "../../data/category.json";
import Content from "../../components/Content";
import { Box, Card, CardMedia, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CategoryAll() {
  return (
    <Content>
      <Typography variant="h4">Categories</Typography>
      <Grid container spacing={2}>
        {Category.map((category) => (
          <Link href={`/category/${category.id}`} passHref key={category.id}>
            <Grid md={4} item style={{ position: "relative" }}>
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
          </Link>
        ))}
      </Grid>
    </Content>
  );
}
