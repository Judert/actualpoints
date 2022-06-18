import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Error({ error }) {
  const [selected, setSelected] = useState(false);
  const router = useRouter();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}>
      <Typography>Sorry, something went wrong</Typography>
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelected(!selected);
          }}
        >
          {selected ? "Less details" : "More details"}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={() => router.reload()}
        >
          Reload Page
        </Button>
      </Stack>
      {selected && <Typography>{JSON.stringify(error)}</Typography>}
    </Box>
  );
}
