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
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              sx={{
                flexGrow: { xs: 0, sm: 1 },
                height: { xs: "none", sm: 250 },
                width: { xs: "none", sm: 500 },
                py: 2,
                px: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
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
                  WebkitLineClamp: { xs: 4, sm: 2 },
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
                  display: { xs: "none", sm: "-webkit-box" },
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
                variant="body1"
                color="text.secondary"
                gutterBottom
              >
                {article.subtitle}
              </Typography>
              <Box
                sx={{
                  justifyContent: "center",
                  py: 1,
                  display: { xs: "flex", sm: "none" },
                }}
              >
                <Image
                  alt={article.alt}
                  src={article.image}
                  width={320}
                  height={180}
                  // layout="responsive"
                  objectFit="cover"
                />
              </Box>
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
          </Paper>
        </Link>
      ))}
    </Stack>
  );
}
