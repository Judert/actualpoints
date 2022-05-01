import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  Typography,
} from "@mui/material";
import Content from "../../components/Content";
import Category from "../../data/category.json";
import { WithContext as ReactTags } from "react-tag-input";
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

const LIMIT = 5;

export default function Search() {
  const router = useRouter();
  const [tags, setTags] = useState(null);
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    setTags(
      router.query.tags?.split(" ").map((tag) => ({ id: tag, text: tag }))
    );
  }, [router.query.tags]);

  const fetchArticles = useCallback(async () => {
    if (tags) {
      console.log(tags);
      let snapshot = await getDocs(
        query(
          collection(db, "Article"),
          where("published", "==", true),
          where("tags", "array-contains-any", tags),
          orderBy("date", "desc"),
          limit(LIMIT)
        )
      ).catch((e) => console.error(e));
      console.log(snapshot);
      setArticles(snapshot.docs.map(postToJSON));
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
      {tags && <Tags tags={tags} setTags={setTags} />}
      {articles && <Articles articles={articles} />}
      {!end && !loading && (
        <Button variant="contained" onClick={loadMore}>
          Load More
        </Button>
      )}
      {loading && <div>Loading...</div>}
      {end && <div>End</div>}
    </Content>
  );
}
