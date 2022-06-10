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
  const articles = props.articles;

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
            elevation={3}
            sx={{ p: 3, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h3">{article.title}</Typography>
            <Typography variant="h6" color="text.secondary">
              {article.subtitle}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Last Updated: {new Date(article.date).toDateString()}
            </Typography>
            <Image
              alt={article.alt}
              src={article.image}
              width={300}
              height={200}
              layout="responsive"
            />
            <Markdown>{article.content}</Markdown>
          </Paper>
          <Typography variant="h6" color="text.secondary">
            Article contributed by:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs="auto">
              <Avatar sx={{ width: 56, height: 56 }} src={article.photoURL} />
            </Grid>
            <Grid item container xs="auto">
              <Grid item xs={12}>
                <Typography variant="body1">{article.displayName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {"@" + article.username}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">{article.desc}</Typography>
            </Grid>
          </Grid>
          <Box>
            {article.tags.map((tag) => (
              <Link href={"/search?tags=" + tag.id} passHref key={tag.id}>
                <Chip sx={{ m: 0.5 }} variant="outlined" label={tag.id} />
              </Link>
            ))}
          </Box>
        </Grid>
        {articles.map((article) => (
          <Grid key={article.id} item xs={6} sm={6} md={4}>
            <Article article={article} small={true} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
