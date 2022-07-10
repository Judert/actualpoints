import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
// import "react-markdown-editor-lite/lib/index.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "../src/Link";
import ImageShimmer from "./ImageShimmer";
import React from "react";
// import "../../styles/markdown.module.css";

const aspectData = {
  widths: {
    0: 750,
    1: 750,
    2: 500,
  },
  heights: {
    0: 422,
    1: 750,
    2: 750,
  },
  xs: {
    0: 12,
    1: 6,
    2: 6,
  },
  sm: {
    0: 12,
    1: 4,
    2: 3,
  },
};

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
    const alts = metastring?.replace(/ *\{[^)]*\} */g, "").split(",");
    const hasCaption = metastring?.toLowerCase().includes("{caption: ");
    const hasAspect = metastring?.toLowerCase().includes("{aspect: ");
    const caption = metastring?.match(/{caption: (.*?)}/)?.pop();
    const aspect = metastring
      ?.match(/{aspect: (.*?)}/)
      ?.pop()
      .split(",");
    const images = node.properties.src
      .split(",")
      .filter((image) =>
        image.startsWith("https://firebasestorage.googleapis.com")
      );

    if (!hasAspect) {
      return <></>;
    }

    if (!(images.length === alts.length && images.length === aspect.length)) {
      return <></>;
    }

    return (
      <>
        <Grid component="span" container spacing={1}>
          {
            // map images to grid
            images.map((image, index) => {
              return (
                <Grid
                  item
                  component="span"
                  key={index}
                  xs={aspectData.xs[aspect[index]]}
                  sm={aspectData.sm[aspect[index]]}
                >
                  <ImageShimmer
                    src={image}
                    width={aspectData.widths[aspect[index]]}
                    height={aspectData.heights[aspect[index]]}
                    alt={alts[index]}
                    objectFit="cover"
                  />
                </Grid>
              );
            })
          }
        </Grid>

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
