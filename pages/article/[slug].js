import {
  Avatar,
  Grid,
  Paper,
  Typography,
  Chip,
  Box,
  Container,
} from "@mui/material";
import { postToJSON } from "../../lib/firebase";
import Link from "next/link";
import Markdown from "../../components/Markdown";
import Articles from "../../components/Articles";
import Article from "../../components/Article";
import SEO from "../../components/SEO";
import ImageShimmer from "../../components/ImageShimmer";
import { useHeight } from "../../lib/hooks";
import desc from "../../data/descriptions.json";
import { db } from "../../lib/firebase-admin";

const LIMIT = 10;

export async function getStaticPaths() {
  const articles = (
    await db.collection("Article").where("published", "==", true).get()
  ).docs.map(postToJSON);

  const paths = articles.map((doc) => {
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
  const ref = db.collection("Article").doc(params.slug);
  const path = ref.path;
  const post = postToJSON(await ref.get());

  const articles = (
    await db
      .collection("Article")
      .where("published", "==", true)
      .orderBy("date", "desc")
      .limit(LIMIT)
      .get()
  ).docs.map(postToJSON);

  return {
    props: { post, path, articles },
    revalidate: 43200,
  };
}

export default function ArticleMain(props) {
  const article = props.post;
  const articles = props.articles.filter((x) => x.id !== article.id);
  const height = useHeight();

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        my: 4,
        display: "flex",
        alignItems: "left",
        flexDirection: "column",
        rowGap: 2,
        minHeight: height,
      }}
    >
      <SEO
        title={article.title}
        description={article.subtitle}
        image={article.image}
        type={"article"}
        url={`${desc.url}/article/${props.path}`}
        date={new Date(article.date).toISOString()}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={8}>
          <Paper
            elevation={2}
            sx={{ p: 3, display: "flex", flexDirection: "column", rowGap: 3 }}
          >
            <Typography
              component="h1"
              variant="h2"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              {article.title}
            </Typography>
            <Typography
              component="h1"
              variant="h3"
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              {article.title}
            </Typography>
            <Typography component="h2" variant="h5" color="text.secondary">
              {article.subtitle}
            </Typography>
            <Typography
              component="h3"
              variant="subtitle1"
              color="text.secondary"
            >
              Last Updated: {new Date(article.date).toGMTString()}
            </Typography>
            <ImageShimmer
              alt={article.alt}
              src={article.image}
              width={712}
              height={400.5}
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
            <Typography component="h4" variant="h5" color="text.secondary">
              Article contributed by
            </Typography>
            <Grid container spacing={3} pl={1}>
              <Grid item xs="auto">
                <Avatar sx={{ width: 150, height: 150 }}>
                  <ImageShimmer
                    src={article.photoURL}
                    alt={article.username}
                    layout="fill"
                  />
                </Avatar>
              </Grid>
              <Grid item container xs={9}>
                <Grid item xs={12}>
                  <Typography component="h5" variant="h6">
                    {article.displayName}
                  </Typography>
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
                <Link href={"/search/" + tag.id} passHref key={tag.id}>
                  <Chip sx={{ m: 0.5 }} variant="outlined" label={tag.id} />
                </Link>
              ))}
            </Box>
            {articles[0] && (
              <Typography
                variant="h4"
                color="text.secondary"
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                Latest Articles
              </Typography>
            )}
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
            {articles[0] && (
              <Typography variant="h4" color="text.secondary">
                Latest Articles
              </Typography>
            )}

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
