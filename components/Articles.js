import { Stack } from "@mui/material";
import Article from "./Article";

export default function Articles({ articles, small = false }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {articles.map((article) => (
        <Article key={article.id} article={article} small={small} />
      ))}
    </Stack>
  );
}
