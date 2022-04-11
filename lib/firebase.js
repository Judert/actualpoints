import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDbsLODWl27EF-1Oek7OGIQl4LShitLSwE",
  authDomain: "blog-veselcode.firebaseapp.com",
  projectId: "blog-veselcode",
  storageBucket: "blog-veselcode.appspot.com",
  messagingSenderId: "501553963979",
  appId: "1:501553963979:web:8d0c21fb51f57260fa8c4e",
  measurementId: "G-E2VS58EBVT",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
