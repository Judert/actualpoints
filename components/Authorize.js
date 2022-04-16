import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Authorize(props) {
  const { username, email } = useContext(UserContext);

  return email ? (
    username ? (
      props.children
    ) : (
      <Link href="/admin">You must be signed in</Link>
    )
  ) : (
    <Link href="/">You do not have permission to view this page.</Link>
  );
}
