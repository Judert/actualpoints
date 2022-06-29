import React, { useCallback, useEffect, useState } from "react";
import { Button, CircularProgress, Container, Typography } from "@mui/material";
import Content from "../../components/Content";
import Tags from "../../components/Tags";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import Articles from "../../components/Articles";
import { db, postToJSON } from "../../lib/firebase";
import SEO from "../../components/SEO";
import desc from "../../data/descriptions.json";

const LIMIT = 10;

export default function Search() {
  let initialized = false;
  let mounted = false;
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    if (!mounted) {
      if (router.query.tags) {
        setTags(
          router.query.tags?.split(" ").map((tag) => ({ id: tag, text: tag }))
        );
        mounted = true;
      }
    }
  }, [router.query.tags]);

  const fetchArticles = useCallback(async () => {
    if (tags[0]) {
      initialized = true;
      setLoading(true);
      let snapshot = await getDocs(
        query(
          collection(db, "Article"),
          where("published", "==", true),
          where("tags", "array-contains-any", tags),
          orderBy("date", "desc"),
          limit(LIMIT)
        )
      ).catch((e) => console.error(e));
      if (!snapshot.empty) {
        setArticles(snapshot.docs.map(postToJSON));
      }
      setLoading(false);
    } else {
      setArticles(null);
      setLoading(false);
      setEnd(false);
    }
    if (initialized) {
      router.push(
        "/search?tags=" + tags.map((tag) => tag.id).join("+"),
        undefined,
        { shallow: true }
      );
    }
  }, [tags]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

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
            where("tags", "array-contains-any", tags),
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
        title={"Search"}
        description={desc.search}
        type={"website"}
        url={`${desc.url}/search`}
      />
      <Tags tags={tags} setTags={setTags} />
      {articles ? (
        <Articles articles={articles} />
      ) : (
        !loading &&
        tags[0] && (
          <Typography variant="h5" color="text.secondary">
            No articles yet
          </Typography>
        )
      )}
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {articles && !end && !loading && (
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
