import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(false);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribeUsername;
    let unsubscribeEmail;

    if (user) {
      unsubscribeUsername = onSnapshot(doc(db, "User", user.uid), (doc) => {
        setUsername(doc.data()?.username);
      });
      unsubscribeEmail = onSnapshot(doc(db, "Email", user.email), (doc) => {
        setEmail(doc.exists());
      });
    } else {
      setUsername(null);
      setEmail(false);
    }

    return () => {
      unsubscribeUsername;
      unsubscribeEmail;
    };
  }, [user]);

  return { user, username, email };
}
