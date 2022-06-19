import {
  Avatar,
  Grid,
  Paper,
  Typography,
  Chip,
  Box,
  Stack,
  Container,
} from "@mui/material";
import Content from "../../components/Content";
import { db, postToJSON } from "../../lib/firebase";
import {
  query,
  getDoc,
  getDocs,
  collection,
  where,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Markdown from "../../components/Markdown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Articles from "../../components/Articles";
import Article from "../../components/Article";

const LIMIT = 10;

export async function getStaticPaths() {
  const snapshot = await getDocs(
    query(collection(db, "Article"), where("published", "==", true))
  );

  const paths = snapshot.docs.map((doc) => {
    return {
      params: { slug: doc.id },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const ref = doc(db, "Article", params.slug);
  const path = ref.path;
  const post = postToJSON(await getDoc(ref));

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

  return {
    props: { post, path, articles },
    revalidate: 60 * 60 * 6,
  };
}

export default function ArticleMain(props) {
  const article = props.post;
  const articles = props.articles.filter((x) => x.id !== article.id);

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        my: 4,
        display: "flex",
        // justifyContent: "center",
        alignItems: "left",
        flexDirection: "column",
        rowGap: 2,
        // minHeight: window.outerHeight,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8}>
          <Paper
            elevation={2}
            sx={{ p: 3, display: "flex", flexDirection: "column", rowGap: 2 }}
          >
            <Typography variant="h3">{article.title}</Typography>
            <Typography variant="h6" color="text.secondary">
              {article.subtitle}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Last Updated: {new Date(article.date).toGMTString()}
            </Typography>
            <Image
              alt={article.alt}
              src={article.image}
              width={16000}
              height={9000}
            />
            <Box sx={{ rowGap: 0 }}>
              <Markdown>{article.content}</Markdown>
            </Box>
          </Paper>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 3,
              pt: 3,
              pb: 0,
            }}
          >
            <Typography variant="h5" color="text.secondary">
              Article contributed by
            </Typography>
            <Grid container spacing={3} pl={1}>
              <Grid item xs="auto">
                <Avatar sx={{ width: 150, height: 150 }}>
                  <Image
                    src={article.photoURL}
                    alt={article.username}
                    layout="fill"
                  />
                </Avatar>
              </Grid>
              <Grid item container xs={9}>
                <Grid item xs={12}>
                  <Typography variant="h6">{article.displayName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" color="text.secondary">
                    {"@" + article.username}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">{article.desc}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Box>
              {article.tags.map((tag) => (
                <Link href={"/search?tags=" + tag.id} passHref key={tag.id}>
                  <Chip sx={{ m: 0.5 }} variant="outlined" label={tag.id} />
                </Link>
              ))}
            </Box>
            <Typography
              variant="h4"
              color="text.secondary"
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              Latest Articles
            </Typography>
          </Box>
        </Grid>
        <Grid item container spacing={2} xs={12} sm={12} md={4}>
          <Grid
            item
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
            }}
            md={12}
          >
            <Typography variant="h4" color="text.secondary">
              Latest Articles
            </Typography>
            <Articles articles={articles} small={true} />
          </Grid>
          {articles.map((article) => (
            <Grid
              key={article.id}
              item
              sx={{ display: { xs: "flex", md: "none" } }}
              xs={12}
              sm={6}
              md={12}
            >
              <Article article={article} small={true} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}
