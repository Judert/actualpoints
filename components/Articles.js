import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function Articles({ articles }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {articles.map((article) => (
        <Link href={"/article/" + article.id} passHref key={article.id}>
          <Paper sx={{ display: "flex" }}>
            <Box
              sx={{
                flexGrow: 1,
                height: 250,
                width: 500,
                py: 3,
                px: 3,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Avatar sx={{ width: 28, height: 28 }} src={article.photoURL} />
                <Typography variant="subtitle1">
                  {article.displayName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {new Date(article.date).toLocaleDateString()}
                </Typography>
                <LocalOfferIcon color="disabled" sx={{ fontSize: 20 }} />
                <Typography variant="subtitle1" color="text.secondary">
                  {article.tags[0].id}
                </Typography>
              </Stack>
              <Typography gutterBottom variant="h5">
                {article.title}
              </Typography>
              <Typography
                sx={{ textOverflow: "ellipsis" }}
                variant="body1"
                color="text.secondary"
                gutterBottom
              >
                {article.subtitle}
              </Typography>
              {/* {article.tags.map((tag) => ( */}
              {/* <Chip
                key={article.tags[0].id}
                sx={{ mr: 0.5 }}
                variant="outlined"
                label={article.tags[0].id}
              /> */}
              {/* ))} */}
            </Box>
            <Image
              alt={article.alt}
              src={article.image}
              width={250}
              height={250}
              layout="fixed"
            />
          </Paper>
        </Link>
      ))}
    </Stack>
  );
}
