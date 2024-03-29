import React, { useState } from "react";
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
import { Timestamp } from "firebase/firestore";
import { postToJSON, otherToJSON } from "../lib/firebase";
import Articles from "../components/Articles";
import MUILink from "../src/Link";
import Link from "next/link";
import SquareIcon from "@mui/icons-material/Square";
import SEO from "../components/SEO";
import ImageShimmer from "../components/ImageShimmer";
import desc from "../data/descriptions.json";
import { useHeight } from "../lib/hooks";
import { db } from "../lib/firebase-admin";

const LIMIT = 10;

export async function getStaticProps() {
  const articles = (
    await db
      .collection("Article")
      .where("published", "==", true)
      .orderBy("date", "desc")
      .limit(LIMIT)
      .get()
  ).docs.map(postToJSON);

  const slides = (
    await db
      .collection("Slide")
      .where("active", "==", true)
      .orderBy("order", "asc")
      .get()
  ).docs.map(otherToJSON);

  const tags = (
    await db
      .collection("Tag")
      .where("count", ">", 0)
      .orderBy("count", "desc")
      .limit(100)
      .get()
  ).docs.map(otherToJSON);

  const categories = (await db.collection("Category").get()).docs.map(
    otherToJSON
  );

  return {
    props: { articles, tags, categories, slides },
    revalidate: 43200,
  };
}

export default function Index(props) {
  const height = useHeight();
  return (
    <Container
      maxWidth="xl"
      component="main"
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: 3,
        mb: 4,
        minHeight: height,
      }}
    >
      <SEO
        title={"Home"}
        description={desc.about}
        type={"website"}
        url={`${desc.url}`}
      />
      <Slides {...props} />
      <Container sx={{ minHeight: height }} maxWidth="lg">
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
    </Container>
  );
}

function Slides(props) {
  return (
    <Carousel
      autoPlay="true"
      infiniteLoop="true"
      navButtonsProps={{
        style: {
          borderRadius: 0,
        },
      }}
      IndicatorIcon={<SquareIcon fontSize="small" className="indicatorIcon" />}
      animation="slide"
    >
      {props.slides.map((slide) => (
        <Slide
          key={slide.id}
          title1={slide.title1}
          title2={slide.title2}
          alt={slide.alt}
          desc={slide.desc}
          img={slide.img}
          link={slide.link}
          buttonText={slide.buttonText}
        />
      ))}
    </Carousel>
  );
}

function Slide({ title1, title2, desc, img, alt, link, buttonText }) {
  return (
    <Paper elevation={6} sx={{ display: "flex", position: "relative" }}>
      <ImageShimmer
        src={img}
        alt={alt}
        width={1536}
        height={864}
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
          <Typography component="p" variant="h1" noWrap>
            {title1}
          </Typography>
          <Typography component="p" variant="h1" noWrap>
            {title2}
          </Typography>
          <Typography component="p" variant="h5" py={2} pb={4}>
            {desc}
          </Typography>
          <Button
            variant="contained"
            component={MUILink}
            noLinkStyle
            href={link}
          >
            {buttonText}
          </Button>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "block", md: "none" },
          }}
        >
          <Typography component="p" variant="h3" noWrap>
            {title1}
          </Typography>
          <Typography component="p" variant="h3" noWrap>
            {title2}
          </Typography>
          <Typography component="p" py={2} pb={2}>
            {desc}
          </Typography>
          <Button
            variant="contained"
            component={MUILink}
            noLinkStyle
            href={link}
          >
            {buttonText}
          </Button>
        </Box>
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          <Typography component="p" variant="h4" noWrap>
            {title1}
          </Typography>
          <Typography component="p" variant="h4" noWrap gutterBottom>
            {title2}
          </Typography>
          <Button
            size="small"
            variant="contained"
            component={MUILink}
            noLinkStyle
            href={link}
          >
            {buttonText}
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
  const [message, setMessage] = useState("");

  const loadMore = async () => {
    setMessage("");
    setLoading(true);
    const last = articles[articles.length - 1];
    if (last) {
      const start =
        typeof last.date === "number"
          ? last.date
          : Timestamp.toMillis(last.date);

      const response = await fetch("/api/" + start + "/" + LIMIT, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const temp = await response.json();
        setArticles(articles.concat(temp));
        if (temp.length < LIMIT) {
          setEnd(true);
        }
      } else if (response.status === 429) {
        setMessage("Too many requests, please try again later.");
      }
    } else {
      setEnd(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Typography component="h1" variant="h4">
        Latest Articles
      </Typography>
      {articles[0] ? (
        <Articles articles={articles} />
      ) : (
        <Typography component="p" variant="h5" color="text.secondary">
          No articles yet
        </Typography>
      )}
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 2,
        }}
      >
        {articles[0] && !end && !loading && (
          <Button variant="contained" onClick={loadMore}>
            Load More
          </Button>
        )}
        {loading && <CircularProgress />}
        {/* {end && <Typography>End</Typography>} */}
        {message && <Typography>{message}</Typography>}
      </Container>
    </>
  );
}

function Categories(props) {
  return (
    <Box pb={2}>
      <Typography
        component="h2"
        variant="h5"
        color={"text.secondary"}
        gutterBottom
      >
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
      <Typography
        component="h2"
        variant="h5"
        color={"text.secondary"}
        gutterBottom
      >
        Popular Tags
      </Typography>
      {!props.tags[0] ? (
        <Typography component="p" variant="subtitle1" color={"text.secondary"}>
          No tags yet
        </Typography>
      ) : (
        <Box>
          {props.tags.map((tag) => (
            <Link
              // underline="none"
              href={"/search/" + tag.id}
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
      )}
    </Box>
  );
}
