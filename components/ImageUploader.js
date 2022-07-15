import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useSnackbar } from "notistack";
import Resizer from "react-image-file-resizer";

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      750,
      750,
      "PNG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

export default function ImageUploader({ markdown }) {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);
  const [checked, setChecked] = useState(markdown);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    let file = Array.from(e.target.files)[0];
    // const extension = file.type.split("/")[1];

    try {
      file = await resizeFile(file);
    } catch (error) {
      enqueueSnackbar("Upload Failed: " + error, { variant: "error" });
    }

    // Makes reference to the storage bucket location
    const storageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.png`
    );
    setUploading(true);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // switch (snapshot.state) {
        //   case "paused":
        //     console.log("Upload is paused");
        //     break;
        //   case "running":
        //     console.log("Upload is running");
        //     break;
        // }
      },
      (error) => {
        // Handle unsuccessful uploads
        enqueueSnackbar("Upload Failed: " + error, {
          variant: "error",
        });
        setUploading(false);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          setUploading(false);
        });
        enqueueSnackbar("Upload Success!", { variant: "success" });
      }
    );
  };

  return (
    <Box>
      <CircularProgressWithLabel
        show={uploading ? "inline-flex" : "none"}
        value={progress}
      />

      {!uploading && (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CameraAltIcon />}
          >
            Upload Img
            <input
              type="file"
              hidden
              onChange={uploadFile}
              accept="image/x-png,image/jpeg"
            />
          </Button>
          {downloadURL && (
            <Button
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(
                  checked
                    ? `![alt{aspect}{caption}](${downloadURL})`
                    : downloadURL
                );
              }}
            >
              Copy URL
            </Button>
          )}
          {/* <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "Markdown/URL Switch" }}
                />
              }
              label={checked ? "Markdown" : "URL"}
            />
          </FormGroup> */}
        </Stack>
      )}
    </Box>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: props.show }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
