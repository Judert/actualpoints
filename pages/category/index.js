import Content from "../../components/Content";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export { getStaticProps } from "../index";

export default function CategoryAll(props) {
  return (
    <Content>
      <Typography variant="h3">Categories</Typography>
      <Grid container spacing={2}>
        {props.categories.map((category) => (
          <Link href={`/category/${category.id}`} passHref key={category.id}>
            <Grid xs={12} sm={6} md={4} item>
              <Paper elevation={6} style={{ position: "relative" }}>
                <Image
                  alt={category.name}
                  src={category.img}
                  width={1000}
                  height={1000}
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
