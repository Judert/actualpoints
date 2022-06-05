import React, { useState } from "react";
import Copyright from "../src/Copyright";
import Content from "../components/Content";
import Carousel, { consts } from "react-elastic-carousel";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import {
  collection,
  limit,
  orderBy,
  where,
  query,
  getDocs,
  Timestamp,
  startAfter,
} from "firebase/firestore";
import { db, postToJSON, tagToJSON } from "../lib/firebase";
import Articles from "../components/Articles";
import Link from "next/link";
import Category from "../data/category.json";

const slides = [
  {
    id: 1,
    img: "https://firebasestorage.googleapis.com/v0/b/blog-veselcode.appspot.com/o/Carousel%2Fuser-smile-fill-svgrepo-com.svg?alt=media&token=77687758-f189-43d2-af82-b5ca49c6fcbf",
    alt: "Logo",
    title1: "Welcome to",
    title2: "Actual Points",
    desc: "We condense high quality information for your reading pleasure.",
  },
];

const LIMIT = 10;

export async function getServerSideProps() {
  const articles = (
    await getDocs(
      query(
        collection(db, "Article"),
        where("published", "==", true),
        orderBy("date", "desc"),
        limit(LIMIT)
      )
    )
  ).docs.map(postToJSON);

  const tags = (
    await getDocs(query(collection(db, "Tag"), orderBy("count", "desc")))
  ).docs.map(tagToJSON);

  return {
    props: { articles, tags },
  };
}

export default function Index(props) {
  return (
    <>
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "left",
          flexDirection: "column",
          rowGap: 2,
        }}
      >
        <Slides />
        <Container
          maxWidth="lg"
          sx={{
            my: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "left",
            flexDirection: "column",
            rowGap: 2,
            // backgroundColor: "secondary.main",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Categories />
              <AllTags {...props} />
            </Grid>
            <Grid item xs={9}>
              <ArticlesLatest {...props} />
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

function Slides() {
  const Cards = slides.map((slide) => (
    <Slide
      key={slide.id}
      title1={slide.title1}
      title2={slide.title2}
      alt={slide.alt}
      desc={slide.desc}
      img={slide.img}
    />
  ));

  function materialArrow({ type, onClick, isEdge }) {
    const pointer = type === consts.PREV ? "❮" : "❯";
    return (
      <Button size="large" onClick={onClick} disabled={isEdge}>
        {pointer}
      </Button>
    );
  }

  return (
    <Carousel itemsToShow={1} renderArrow={materialArrow} pagination={false}>
      {Cards}
    </Carousel>
  );
}

function Slide({ title1, title2, desc, img, alt }) {
  return (
    <Paper sx={{ display: "flex" }} elevation={6}>
      <Box sx={{ flexGrow: 1, py: 6, px: 6 }}>
        <Typography variant="h1" noWrap>
          {title1}
        </Typography>
        <Typography variant="h1" noWrap>
          {title2}
        </Typography>
        <Typography variant="h5" color={"text.secondary"} py={2} pb={4}>
          {desc}
        </Typography>
        <Button variant="contained" mr={2}>
          Learn More
        </Button>
        <Button variant="outlined">Join us</Button>
      </Box>
      <Image src={img} alt={alt} width={450} height={450} layout="fixed" />
    </Paper>
  );
}

function ArticlesLatest(props) {
  const [articles, setArticles] = useState(props.articles);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const last = articles[articles.length - 1];
    if (last) {
      const start =
        typeof last.date === "number"
          ? Timestamp.fromMillis(last.date)
          : last.date;
      const temp = (
        await getDocs(
          query(
            collection(db, "Article"),
            where("published", "==", true),
            orderBy("date", "desc"),
            startAfter(start),
            limit(LIMIT)
          )
        )
      ).docs.map(postToJSON);
      setArticles(articles.concat(temp));
      setLoading(false);
      if (temp.length < LIMIT) {
        setEnd(true);
      }
    } else {
      setLoading(false);
      setEnd(true);
    }
  };

  return (
    <>
      <Typography variant="h4">Latest Articles</Typography>
      <Articles articles={articles} />
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!end && !loading && (
          <Button variant="contained" onClick={loadMore}>
            Load More
          </Button>
        )}
        {loading && <CircularProgress />}
        {end && <Typography>End</Typography>}
      </Container>
    </>
  );
}

function Categories() {
  return (
    <Box pb={2}>
      <Typography variant="h5" color={"text.secondary"} gutterBottom>
        Categories
      </Typography>
      <Box>
        {Category.map((category) => (
          <Link href={`/category/${category.id}`} passHref key={category.id}>
            <Chip sx={{ m: 0.5 }} variant="contained" label={category.name} />
          </Link>
        ))}
      </Box>
    </Box>
  );
}

function AllTags(props) {
  return (
    <Box>
      <Typography variant="h5" color={"text.secondary"} gutterBottom>
        Popular Tags
      </Typography>
      <Box>
        {props.tags.map((tag) => (
          <Link href={"/search?tags=" + tag.id} passHref key={tag.id}>
            <Chip
              sx={{ m: 0.5 }}
              variant="outlined"
              label={tag.id + " (" + tag.count + ")"}
            />
          </Link>
        ))}
      </Box>
    </Box>
  );
}

function Footer() {
  return (
    <Box sx={{ display: "flex", backgroundColor: "primary.main" }}>
      <Container
        maxWidth="md"
        sx={{
          my: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 2,
        }}
      >
        <Copyright />
      </Container>
    </Box>
  );
}
