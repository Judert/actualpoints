import React, { useState } from "react";
import { otherToJSON, postToJSON } from "../../lib/firebase";
import { Timestamp } from "firebase/firestore";
import { Typography, Container, Button, CircularProgress } from "@mui/material";
import Content from "../../components/Content";
import Articles from "../../components/Articles";
import SEO from "../../components/SEO";
import desc from "../../data/descriptions.json";
import { db } from "../../lib/firebase-admin";

const LIMIT = 10;

export async function getStaticPaths() {
  const tags = (
    await db.collection("Tag").where("count", ">", 0).get()
  ).docs.map(otherToJSON);

  const paths = tags.map((tag) => {
    return {
      params: {
        slug: tag.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const articles = (
    await db
      .collection("Article")
      .where("published", "==", true)
      .where("tags", "array-contains", { id: slug, text: slug })
      .orderBy("date", "desc")
      .limit(LIMIT)
      .get()
  ).docs.map(postToJSON);

  return {
    props: { slug, articles },
    revalidate: 43200,
  };
}

export default function Search(props) {
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

      const response = await fetch(
        "/api/search/" + start + "/" + LIMIT + "/" + props.slug,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
    <Content>
      <SEO
        title={`Search by "${props.slug}"`}
        description={"Search for " + props.slug + " related articles"}
        type={"website"}
        url={`${desc.url}/search/${props.slug}`}
      />
      <Typography component="h1" variant="h3">
        Search by {`"${props.slug}"`}
      </Typography>
      {articles[0] ? (
        <Articles articles={articles} />
      ) : (
        <Typography variant="h5" color="text.secondary">
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
    </Content>
  );
}
