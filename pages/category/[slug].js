import React, { useState } from "react";
import { categoryToJSON, db, postToJSON } from "../../lib/firebase";
import {
  collection,
  query as firestoreQuery,
  where,
  Timestamp,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { Typography, Container, Button, CircularProgress } from "@mui/material";
import Content from "../../components/Content";
import Articles from "../../components/Articles";

const LIMIT = 10;

export async function getStaticPaths() {
  const categories = (await getDocs(collection(db, "Category"))).docs.map(
    categoryToJSON
  );

  const paths = categories.map((category) => {
    return {
      params: {
        slug: category.id + "-" + category.name,
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
  const categoryId = slug.split("-")[0];

  const articles = (
    await getDocs(
      firestoreQuery(
        collection(db, "Article"),
        where("category", "==", categoryId),
        where("published", "==", true),
        orderBy("date", "desc"),
        limit(LIMIT)
      )
    )
  ).docs.map(postToJSON);

  return {
    props: { slug, articles },
    revalidate: 60 * 60 * 6,
  };
}

export default function Category(props) {
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
          firestoreQuery(
            collection(db, "Article"),
            where("category", "==", props.slug.split("-")[0]),
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
    <Content>
      <Typography variant="h3">{props.slug.split("-")[1]}</Typography>
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
    </Content>
  );
}
