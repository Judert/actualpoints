import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [desc, setDesc] = useState(null);
  // auth.onIdTokenChanged

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribeUsername;

    if (user) {
      unsubscribeUsername = onSnapshot(doc(db, "User", user.uid), (doc) => {
        setUsername(doc.data()?.username);
        setDisplayName(doc.data()?.displayName);
        setPhotoURL(doc.data()?.photoURL);
        setDesc(doc.data()?.desc);
      });
      user
        .getIdTokenResult(true)
        .then((token) => setEmail(token.claims.verified));
    } else {
      setUsername(null);
      setEmail(false);
      setDesc(null);
      setDisplayName(null);
      setPhotoURL(null);
    }

    return () => {
      unsubscribeUsername;
    };
  }, [user]);

  return { user, username, email, displayName, photoURL, desc };
}
