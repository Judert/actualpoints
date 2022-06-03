import React, { useState } from "react";
import Copyright from "../src/Copyright";
import Content from "../components/Content";
import Carousel, { consts } from "react-elastic-carousel";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
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
import { db, postToJSON } from "../lib/firebase";
import Articles from "../components/Articles";

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

  console.log(articles);

  return {
    props: { articles },
  };
}

export default function Index(props) {
  return (
    <>
      <Container
        // component="main"
        maxWidth="lg"
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
      </Container>
      <Content>
        <ArticlesLatest {...props} />
        <Copyright />
      </Content>
    </>
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
      <Typography variant="h4">Latest Articles:</Typography>
      <Articles articles={articles} />
      {!end && !loading && (
        <Button variant="contained" onClick={loadMore}>
          Load More
        </Button>
      )}
      {loading && <div>Loading...</div>}
      {end && <div>End</div>}
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
    <Paper sx={{ display: "flex" }}>
      <Box sx={{ flex: 1, py: 3, px: 3 }}>
        <Typography variant="h1" noWrap>
          {title1}
        </Typography>
        <Typography variant="h1" noWrap>
          {title2}
        </Typography>
        <Typography variant="h5" color={"text.secondary"} py={2}>
          {desc}
        </Typography>
        <Button variant="contained" mr={2}>
          Learn More
        </Button>
        <Button variant="outlined">Join us</Button>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Image src={img} alt={alt} width={350} height={350} layout="fixed" />
      </Box>
    </Paper>
  );
}
