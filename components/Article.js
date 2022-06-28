import {
  Avatar,
  Box,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { createTheme, useTheme } from "@mui/material/styles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ImageShimmer from "./ImageShimmer";
import Link from "../src/Link";

export default function Article({ article, small }) {
  const theme = useTheme();
  const themeNested = createTheme(
    small
      ? {
          ...theme,
          breakpoints: {
            values: {
              xs: 0,
              sm: -1,
              md: -1,
              lg: -1,
              xl: -1,
            },
          },
        }
      : theme
  );

  return (
    <ThemeProvider theme={themeNested}>
      <Link
        underline="none"
        href={"/article/" + article.id}
        // passHref
        key={article.id}
      >
        <Paper
          elevation={1}
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
              <Avatar sx={{ width: 32, height: 32 }}>
                <ImageShimmer
                  src={article.photoURL}
                  alt={article.username}
                  layout="fill"
                />
              </Avatar>
              <Stack direction="column">
                <Typography
                  component="span"
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
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="text.secondary"
                  >
                    {new Date(article.date).toLocaleDateString()}
                  </Typography>
                  <LocalOfferIcon color="disabled" sx={{ fontSize: 20 }} />
                  <Typography
                    component="span"
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
              component="h5"
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
              component="span"
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
              <ImageShimmer
                alt={article.alt}
                src={article.image}
                width={320}
                height={180}
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
            <ImageShimmer
              alt={article.alt}
              src={article.image}
              width={250}
              height={250}
              objectFit="cover"
            />
          </Box>
        </Paper>
      </Link>
    </ThemeProvider>
  );
}
