import Link from "../src/Link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import Content from "./Content";

export default function Authorize(props) {
  const { username, email } = useContext(UserContext);

  return (
    <Content>
      {email ? (
        username ? (
          props.children
        ) : (
          <Link href="/admin">You must be signed in</Link>
        )
      ) : (
        <Link href="/">You do not have permission to view this page</Link>
      )}
    </Content>
  );
}
