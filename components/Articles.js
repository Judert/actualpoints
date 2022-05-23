import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function Articles({ articles }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {articles.map((article) => (
        <Link href={"/article/" + article.id} passHref key={article.id}>
          <Card sx={{ display: "flex" }}>
            <CardContent sx={{ flex: 3, py: 3, pl: 3 }}>
              <Stack direction="row">
                <Avatar sx={{ width: 28, height: 28 }} src={article.photoURL} />
                <Typography variant="subtitle1">
                  {article.displayName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {new Date(article.date).toDateString()}
                </Typography>
              </Stack>
              <Typography gutterBottom variant="h5">
                {article.title}
              </Typography>
              <Typography
                sx={{ textOverflow: "ellipsis" }}
                variant="body1"
                color="text.secondary"
              >
                {article.subtitle}
              </Typography>
              {article.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  sx={{ mr: 0.5 }}
                  variant="outlined"
                  label={tag.id}
                />
              ))}
            </CardContent>
            <Box sx={{ flex: 1 }}>
              <Image
                alt={article.alt}
                src={article.image}
                width={150}
                height={150}
                layout="responsive"
              />
            </Box>
          </Card>
        </Link>
      ))}
    </Stack>
  );
}
