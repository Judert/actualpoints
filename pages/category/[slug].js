import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import { useCollection } from "react-firebase-hooks/firestore";
import { db, postToJSON } from "../../lib/firebase";
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
import {
  Checkbox,
  Typography,
  Container,
  Stack,
  Grid,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import { WithContext as ReactTags } from "react-tag-input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Content from "../../components/Content";
import { useRouter } from "next/router";
import category from "../../data/category.json";
import find from "lodash.find";
import Image from "next/image";
import styles from "../../styles/CategorySlug.module.css";
import Link from "next/link";
import Articles from "../../components/Articles";

const LIMIT = 5;

export async function getServerSideProps({ query }) {
  const { slug } = query;
  const cat = find(category, ["id", slug]);

  if (!cat) {
    return {
      notFound: true,
    };
  }

  const articles = (
    await getDocs(
      firestoreQuery(
        collection(db, "Article"),
        where("category", "==", cat.id),
        where("published", "==", true),
        orderBy("date", "desc"),
        limit(LIMIT)
      )
    )
  ).docs.map(postToJSON);

  return {
    props: { cat, articles },
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
            where("category", "==", props.cat.id),
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
      <Typography variant="h4">{props.cat.name}</Typography>
      <Articles articles={articles} />
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
