import {
  Avatar,
  Grid,
  Paper,
  Stack,
  Typography,
  Chip,
  Box,
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
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Image from "next/image";
import draftToHtml from "draftjs-to-html";
import parse from "html-react-parser";

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

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export default function Article(props) {
  // const [realtimePost] = useDocumentData(doc(db, props.path));
  // const post = realtimePost || props.post;
  const article = props.post;
  const html = parse(draftToHtml(article.content));

  return (
    <Content>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">{article.title}</Typography>
        <Typography variant="h6" color="text.secondary">
          {article.subtitle}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Last Updated: {new Date(article.date).toDateString()}
        </Typography>
        <Image
          alt={article.tags[0]?.id}
          src={article.image}
          width={900}
          height={600}
          layout="responsive"
        />
        {html}
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
            <Typography variant="body1">{"@" + article.username}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="body1">
            A super long or not super long writer description goes here, im not
            actually sure how long theyll usually be
          </Typography>
        </Grid>
      </Grid>
      <Box>
        {article.tags.map((tag) => (
          <Chip variant="outlined" key={tag.id} label={tag.id} />
          // TODO: add links to search with tag
        ))}
      </Box>
    </Content>
  );
}
