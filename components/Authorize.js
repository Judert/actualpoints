import Link from "../src/Link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import Content from "./Content";
import SEO from "./SEO";

export default function Authorize(props) {
  const { username, email } = useContext(UserContext);

  return (
    <Content>
      <SEO
        title={"Login"}
        description={"Login to manage your articles and profile"}
        type={"website"}
        url={`https://www.actualpoints.com/admin`}
        noindex={true}
      />
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
