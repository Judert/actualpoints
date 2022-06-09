import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function Articles({ articles }) {
  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {articles.map((article) => (
        <Link href={"/article/" + article.id} passHref key={article.id}>
          <Paper
            elevation={1}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                height: 250,
                width: 500,
                py: 2,
                px: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  // width: 500
                }}
              >
                <Avatar sx={{ width: 32, height: 32 }} src={article.photoURL} />
                <Stack direction="column">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {article.displayName}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography variant="subtitle1" color="text.secondary">
                      {new Date(article.date).toLocaleDateString()}
                    </Typography>
                    <LocalOfferIcon color="disabled" sx={{ fontSize: 20 }} />
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {article.tags[0].id}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Typography
                gutterBottom
                variant="h5"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {article.title}
              </Typography>
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
                variant="body1"
                color="text.secondary"
                gutterBottom
              >
                {article.subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 250,
                height: 250,
                display: { xs: "none", sm: "flex" },
              }}
            >
              <Image
                alt={article.alt}
                src={article.image}
                width={250}
                height={250}
                // layout="fixed"
                objectFit="cover"
              />
            </Box>
            <Box
              sx={{
                width: 500,
                height: 281.25,
                display: { xs: "flex", sm: "none" },
              }}
            >
              <Image
                alt={article.alt}
                src={article.image}
                width={500}
                height={281.25}
                // layout="fixed"
                objectFit="cover"
              />
            </Box>
          </Paper>
        </Link>
      ))}
    </Stack>
  );
}
