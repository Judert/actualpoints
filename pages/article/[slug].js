import { Typography } from "@mui/material";
import Content from "../../components/Content";
import { db, app, postToJSON, firebaseConfig } from "../../lib/firebase";
import {
  query,
  getDoc,
  getDocs,
  collection,
  where,
  doc,
  getFirestore,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { initializeApp } from "firebase/app";

export async function getStaticProps({ params }) {
  const { slug } = params;

  const ref = doc(db, "Article", slug);
  const path = ref.path;
  const post = postToJSON(await getDoc(ref));

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  const snapshot = await getDocs(
    query(collection(db, "Article"), where("published", "==", true))
  );

  const paths = snapshot.docs.map((doc) => {
    const slug = doc.id;
    return {
      params: { slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Article(props) {
  const [realtimePost] = useDocumentData(doc(props.path));
  const post = realtimePost || props.post;

  return (
    <Content>
      <Typography variant="h1">{post.title}</Typography>
    </Content>
  );
}
