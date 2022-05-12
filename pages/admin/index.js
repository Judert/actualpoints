import { useEffect, useState, useCallback, useContext } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google";
import Image from "next/image";
import { auth, db, googleAuthProvider } from "../../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { Typography } from "@mui/material";
import { UserContext } from "../../lib/context";
import debounce from "lodash.debounce";
import { doc, writeBatch, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Content from "../../components/Content";
import Link from "../../src/Link";

export default function Admin() {
  const { user, username, email } = useContext(UserContext);

  return (
    <Content>
      {user ? (
        email ? (
          !username ? (
            <SignUp />
          ) : (
            <>
              <EditProfile />
              <ManageArticles />
              <SignOutButton />
            </>
          )
        ) : (
          <PermissionDenied />
        )
      ) : (
        <SignInButton />
      )}
    </Content>
  );
}

function EditProfile() {
  return (
    <Button
      variant="contained"
      component={Link}
      noLinkStyle
      href="/admin/profile"
    >
      Edit Profile
    </Button>
  );
}

function ManageArticles() {
  return (
    <Button
      variant="outlined"
      component={Link}
      noLinkStyle
      href="/admin/article"
    >
      Manage Articles
    </Button>
  );
}

function PermissionDenied() {
  return <Typography>You do not have permission to view this page.</Typography>;
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider).catch((e) => {
      return <Typography>{e.message}</Typography>;
    });
  };
  return (
    <Button
      startIcon={<GoogleIcon />}
      variant="contained"
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </Button>
  );
}

function SignOutButton() {
  const signOutButton = async () => {
    await signOut(auth).catch((e) => {
      return <Typography>{e.message}</Typography>;
    });
  };
  return (
    <Button variant="outlined" onClick={signOutButton}>
      Sign Out
    </Button>
  );
}

function SignUp() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(db, "User", user.uid);
    const usernameDoc = doc(db, "Username", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(db);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
      desc: "",
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const exists = (await getDoc(doc(db, "Username", username))).exists();
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
