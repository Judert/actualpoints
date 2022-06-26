import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyDbsLODWl27EF-1Oek7OGIQl4LShitLSwE",
  authDomain: "blog-veselcode.firebaseapp.com",
  projectId: "blog-veselcode",
  storageBucket: "blog-veselcode.appspot.com",
  messagingSenderId: "501553963979",
  appId: "1:501553963979:web:8d0c21fb51f57260fa8c4e",
  measurementId: "G-E2VS58EBVT",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
let analytics;
if (app.name && typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    date: data?.date.toMillis() || 0,
    id: doc?.id,
  };
}
export function otherToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    id: doc?.id,
  };
}
