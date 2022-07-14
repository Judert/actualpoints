import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  NativeSelect,
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
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { ReactSortable } from "react-sortablejs";

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

const types = {
  main: {
    name: "Main",
    count: 1,
  },
  landscape: {
    name: "Landscape",
    count: 1,
  },
  portrait: {
    name: "Portrait",
    count: 3,
  },
  square: {
    name: "Square",
    count: 2,
  },
};

const imagesAll = [
  { id: 0, image: "", alt: "" },
  { id: 1, image: "", alt: "" },
  { id: 2, image: "", alt: "" },
  { id: 3, image: "", alt: "" },
];

export default function ImageMarkdown() {
  const [type, setType] = useState("main");
  const [markdown, setMarkdown] = useState(false);

  const handleChange = (event) => {
    setType(event.target.value);
    setImages(imagesAll.slice(0, types[event.target.value].count));
  };

  const [images, setImages] = useState(imagesAll.slice(0, types[type].count));

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box sx={{ minWidth: 200 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="controlled-native">
              Image Type
            </InputLabel>
            <NativeSelect
              value={type}
              onChange={handleChange}
              inputProps={{
                name: "type",
                id: "controlled-native",
              }}
            >
              {Object.keys(types).map((key) => (
                <option key={key} value={key}>
                  {types[key].name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
        <Button
          variant="outlined"
          onClick={() => {
            navigator.clipboard.writeText();
          }}
        >
          Copy {type !== "main" ? "Markdown" : "URL"}
        </Button>
        {type !== "main" && (
          <Button
            variant="outlined"
            onClick={() => {
              navigator.clipboard.readText();
            }}
          >
            Paste Markdown
          </Button>
        )}
      </Stack>
      <List dense>
        <ReactSortable list={images} setList={setImages}>
          {images.map((image) => (
            <ListItem
              key={image.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <DragIndicatorIcon />
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar>{/* Firebase image upload */}</Avatar>
              </ListItemAvatar>
              <ListItemText primary="Single-line item" />
            </ListItem>
          ))}
        </ReactSortable>
      </List>
      <Markdown />
    </>
  );
}

function Markdown() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

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

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
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
  return <></>;
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
