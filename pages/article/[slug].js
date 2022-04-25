import { Grid, Typography } from "@mui/material";
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
      <Grid container spacing={3}>
        <Grid item md={12} sx={{ backgroundColor: "error.main" }}>
          <Typography variant="h4">{article.title}</Typography>
          <Typography variant="h6" color="text.secondary">
            {article.subtitle}
          </Typography>
          <Image
            alt={article.tags[0]?.id}
            src={article.image}
            width={900}
            height={600}
            layout="responsive"
          />
          {html}
        </Grid>
      </Grid>
    </Content>
  );
}
