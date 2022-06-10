import { Stack } from "@mui/material";
import Article from "./Article";

export default function Articles({ articles }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {articles.map((article) => (
        <Article key={article.id} article={article} small={false} />
      ))}
    </Stack>
  );
}
