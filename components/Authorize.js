import Link from "../src/Link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import Content from "./Content";
import SEO from "./SEO";
import desc from "../data/descriptions.json";

export default function Authorize(props) {
  const { username, email } = useContext(UserContext);

  return (
    <Content>
      <SEO
        title={"Admin"}
        description={desc.login}
        type={"website"}
        url={`${desc.url}/admin`}
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
