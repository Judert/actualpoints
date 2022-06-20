import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDetectAdBlock } from "adblock-detect-react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Adblock() {
  const adBlockDetected = useDetectAdBlock();
  const [open, setOpen] = useState(false);
  // const { router } = useRouter();

  return (
    <Dialog
      open={adBlockDetected}
      //   onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Disable Adblock"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please disable adblock and reload the page
        </DialogContentText>
      </DialogContent>
      {/* <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            router.reload();
          }}
        >
          Reload Page
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
