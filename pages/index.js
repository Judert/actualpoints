import React, { useRef, useState } from "react";
import Copyright from "../src/Copyright";
import Content from "../components/Content";
// import Carousel, { consts } from "react-elastic-carousel";
import Carousel from "react-material-ui-carousel";
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
import { db, postToJSON, otherToJSON } from "../lib/firebase";
import Articles from "../components/Articles";
import MUILink from "../src/Link";
import Link from "next/link";
import SquareIcon from "@mui/icons-material/Square";

const LIMIT = 10;

export async function getStaticProps() {
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
  ).docs.map(otherToJSON);

  const categories = (await getDocs(collection(db, "Category"))).docs.map(
    otherToJSON
  );

  const slides = (
    await getDocs(
      query(
        collection(db, "Slide"),
        where("active", "==", true),
        orderBy("order", "asc")
      )
    )
  ).docs.map(otherToJSON);

  return {
    props: { articles, tags, categories, slides },
    revalidate: 60 * 60 * 6,
  };
}

export default function Index(props) {
  return (
    <Box
      component="main"
      sx={{ display: "flex", flexDirection: "column", rowGap: 3, mb: 4 }}
    >
      <Slides {...props} />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={3}>
            <Categories {...props} />
            <AllTags {...props} />
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <ArticlesLatest {...props} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Slides(props) {
  const slides = props.slides.map((slide) => (
    <Slide
      key={slide.id}
      title1={slide.title1}
      title2={slide.title2}
      alt={slide.alt}
      desc={slide.desc}
      img={slide.img}
      link={slide.link}
    />
  ));

  // function materialArrow({ type, onClick, isEdge }) {
  //   const pointer = type === consts.PREV ? "❮" : "❯";
  //   return (
  //     <Button size="large" onClick={onClick} disabled={isEdge}>
  //       {pointer}
  //     </Button>
  //   );
  // }

  // const carouselRef = React.useRef(null);
  // const onNextStart = (currentItem, nextItem) => {
  //   if (currentItem.index === nextItem.index) {
  //     // we hit the last item, go to first item
  //     carouselRef.current.goTo(0);
  //   }
  // };
  // const onPrevStart = (currentItem, nextItem) => {
  //   if (currentItem.index === nextItem.index) {
  //     // we hit the first item, go to last item
  //     carouselRef.current.goTo(slides.length);
  //   }
  // };

  return (
    <>
      {/* <Box sx={{ display: { xs: "flex", md: "none" } }}> */}
      {/* <Carousel
        itemsToShow={1}
        renderArrow={materialArrow}
        showArrows={false}
        pagination={false}
        enableAutoPlay={true}
        onPrevStart={onPrevStart}
        onNextStart={onNextStart}
        ref={carouselRef}
      > */}
      <Carousel
        autoPlay="true"
        infiniteLoop="true"
        navButtonsProps={{
          style: {
            borderRadius: 0,
          },
        }}
        IndicatorIcon={
          <SquareIcon fontSize="small" className="indicatorIcon" />
        }
        animation="slide"
      >
        {slides}
      </Carousel>

      {/* </Carousel> */}
      {/* </Box> */}
      {/* <Box sx={{ display: { xs: "none", md: "flex" }, my: 6 }}>
        <Carousel
          itemsToShow={1}
          renderArrow={materialArrow}
          showArrows={true}
          pagination={false}
          enableAutoPlay={true}
        >
          {slides}
        </Carousel>
      </Box> */}
    </>
  );
}

function Slide({ title1, title2, desc, img, alt, link }) {
  return (
    <Paper elevation={6} sx={{ display: "flex", position: "relative" }}>
      <Image
        src={img}
        alt={alt}
        width={3840}
        height={2160}
        // layout="responsive"
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
      <Box
        sx={{
          position: "absolute",
          color: "white",
          left: "25%",
          top: "45%",
          transform: "translate(-25%, -45%)",
        }}
      >
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Typography variant="h1" noWrap>
            {title1}
          </Typography>
          <Typography variant="h1" noWrap>
            {title2}
          </Typography>
          <Typography variant="h5" py={2} pb={4}>
            {desc}
          </Typography>
          <Button
            variant="contained"
            component={MUILink}
            noLinkStyle
            href={link}
          >
            Learn More
          </Button>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "block", md: "none" },
          }}
        >
          <Typography variant="h3" noWrap>
            {title1}
          </Typography>
          <Typography variant="h3" noWrap>
            {title2}
          </Typography>
          <Typography py={2} pb={2}>
            {desc}
          </Typography>
          <Button
            variant="contained"
            component={MUILink}
            noLinkStyle
            href={link}
          >
            Learn More
          </Button>
        </Box>
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          <Typography variant="h4" noWrap>
            {title1}
          </Typography>
          <Typography variant="h4" noWrap gutterBottom>
            {title2}
          </Typography>
          <Button
            size="small"
            variant="contained"
            component={MUILink}
            noLinkStyle
            href={link}
          >
            Learn More
          </Button>
        </Box>
      </Box>
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
        {/* {end && <Typography>End</Typography>} */}
      </Container>
    </>
  );
}

function Categories(props) {
  return (
    <Box pb={2}>
      <Typography variant="h5" color={"text.secondary"} gutterBottom>
        Categories
      </Typography>
      <Box>
        {props.categories.map((category) => (
          <Link
            // underline="none"
            href={`/category/${category.id}`}
            passHref
            key={category.id}
          >
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
          <Link
            // underline="none"
            href={"/search?tags=" + tag.id}
            passHref
            key={tag.id}
          >
            <Chip
              size="small"
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
