import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
// import "react-markdown-editor-lite/lib/index.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "../src/Link";
// import "../../styles/markdown.module.css";

const components = {
  h1: ({ children }) => {
    return <Typography variant="h4">{children}</Typography>;
  },
  h2: ({ children }) => {
    return <Typography variant="h5">{children}</Typography>;
  },
  h3: ({ children }) => {
    return <Typography variant="h6">{children}</Typography>;
  },
  h4: ({ children }) => {
    return <></>;
  },
  h5: ({ children }) => {
    return <></>;
  },
  h6: ({ children }) => {
    return <></>;
  },
  img: ({ node, children }) => {
    const metastring = node.properties.alt;
    const alt = metastring?.replace(/ *\{[^)]*\} */g, "");
    const metaWidth = metastring.match(/{([^}]+)x/);
    const metaHeight = metastring.match(/x([^}]+)}/);
    const width = metaWidth ? metaWidth[1] : "768";
    const height = metaHeight ? metaHeight[1] : "432";
    const isPriority = metastring?.toLowerCase().match("{priority}");
    const hasCaption = metastring?.toLowerCase().includes("{caption:");
    const caption = metastring?.match(/{caption: (.*?)}/)?.pop();

    if (
      !node.properties.src.startsWith("https://firebasestorage.googleapis.com")
    ) {
      //// br and strong cause no errors nested in a p tag
      return <></>;
    }

    return (
      <>
        <Image
          src={node.properties.src}
          width={width}
          height={height}
          alt={alt}
          priority={isPriority}
          // layout="responsive"
        />
        {hasCaption ? (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 1,
            }}
            component={"span"}
            aria-label={caption}
            variant="subtitle2"
          >
            {caption}
          </Typography>
        ) : null}
      </>
    );
  },
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  input: ({ node, children, ...props }) => {
    return <></>;
  },
  hr: () => {
    return <Divider />;
  },
  a: ({ node, children, ...props }) => {
    return <Link href={props.href}>{children}</Link>;
  },
  table: ({ children }) => {
    return (
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          {children}
        </Table>
      </TableContainer>
    );
  },
  thead: ({ children }) => {
    return <TableHead>{children}</TableHead>;
  },
  tbody: ({ children }) => {
    return <TableBody>{children}</TableBody>;
  },
  th: ({ children }) => {
    return <TableCell>{children}</TableCell>;
  },
  td: ({ children }) => {
    return <TableCell>{children}</TableCell>;
  },
  tr: ({ children }) => {
    return <TableRow>{children}</TableRow>;
  },
};

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      // className="custom-html-style"
      components={components}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  );
}
