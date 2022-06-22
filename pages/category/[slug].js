import React, { useState } from "react";
import { otherToJSON, db, postToJSON } from "../../lib/firebase";
import {
  collection,
  query as firestoreQuery,
  where,
  Timestamp,
  getDocs,
  orderBy,
  limit,
  startAfter,
  getDoc,
  doc,
} from "firebase/firestore";
import { Typography, Container, Button, CircularProgress } from "@mui/material";
import Content from "../../components/Content";
import Articles from "../../components/Articles";
import SEO from "../../components/SEO";

const LIMIT = 10;

export async function getStaticPaths() {
  const categories = (await getDocs(collection(db, "Category"))).docs.map(
    otherToJSON
  );

  const paths = categories.map((category) => {
    return {
      params: {
        slug: category.id,
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
  const category = otherToJSON(await getDoc(doc(db, "Category", slug)));

  const articles = (
    await getDocs(
      firestoreQuery(
        collection(db, "Article"),
        where("category", "==", slug),
        where("published", "==", true),
        orderBy("date", "desc"),
        limit(LIMIT)
      )
    )
  ).docs.map(postToJSON);

  return {
    props: { slug, category, articles },
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
            where("category", "==", props.slug),
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
      <SEO
        title={props.category.name}
        description={"Explore " + props.category.name + " related articles"}
        type={"website"}
        url={`https://www.actualpoints.com/category/${props.slug}`}
      />
      <Typography variant="h3">{props.category.name}</Typography>
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
        }}
      >
        {articles[0] && !end && !loading && (
          <Button variant="contained" onClick={loadMore}>
            Load More
          </Button>
        )}
        {loading && <CircularProgress />}
        {/* {end && <Typography>End</Typography>} */}
      </Container>
    </Content>
  );
}
