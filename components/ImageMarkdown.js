import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  NativeSelect,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useSnackbar } from "notistack";
import Resizer from "react-image-file-resizer";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageShimmer from "./ImageShimmer";
import { useCookies } from "react-cookie";

const resizeFileSmall = (file) =>
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

const resizeFileLarge = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1920,
      1920,
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
    aspect: 0,
  },
  portrait: {
    name: "Portrait",
    count: 4,
    aspect: 2,
  },
  square: {
    name: "Square",
    count: 2,
    aspect: 1,
  },
};

// const imageDefaults = [
//   { id: 0, url: "", alt: "" },
//   { id: 1, url: "", alt: "" },
//   { id: 2, url: "", alt: "" },
//   { id: 3, url: "", alt: "" },
// ];

export default function ImageMarkdown() {
  const [type, setType] = useState("main");
  const [cookies, setCookie] = useCookies([
    "image0",
    "image1",
    "image2",
    "image3",
  ]);
  const [alts, setAlts] = useState(["", "", "", ""]);
  const [caption, setCaption] = useState("");
  const [captionURL, setCaptionURL] = useState("");

  const handleChange = (event) => {
    // if (type === "main") {
    //   setCookie("image0", "", { path: "/" });
    // }
    setType(event.target.value);
  };

  const handleAlts = (event, index) => {
    const newAlts = [...alts];
    newAlts[index] = event.target.value;
    setAlts(newAlts);
  };

  return (
    <>
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
      <List dense>
        {alts.map(
          (alt, index) =>
            index < types[type].count && (
              <ListItem key={index}>
                <Markdown name={"image" + index} type={type} />
                {type !== "main" && (
                  <TextField
                    fullWidth
                    label="Alt Text"
                    variant="standard"
                    value={alts[index]}
                    onChange={(e) => handleAlts(e, index)}
                  />
                )}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setCookie("image" + index, "", { path: "/" });
                    if (type !== "main") {
                      const newAlts = [...alts];
                      newAlts[index] = "";
                      setAlts(newAlts);
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            )
        )}
      </List>
      {type !== "main" && (
        <>
          <TextField
            fullWidth
            label="Caption"
            variant="outlined"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
          <TextField
            fullWidth
            label="Caption URL"
            variant="outlined"
            value={captionURL}
            onChange={(event) => setCaptionURL(event.target.value)}
          />
        </>
      )}
      <Stack direction="row" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => {
            if (type === "main") {
              navigator.clipboard.writeText(cookies["image0"]);
            } else {
              const length = types[type].count;
              let altsCopy = "";
              let urls = "";
              let aspect = "";
              for (let i = 0; i < length; i++) {
                altsCopy += alts[i];
                urls += cookies["image" + i] ? cookies["image" + i] : "";
                aspect += types[type].aspect;
                if (i < length - 1) {
                  altsCopy += ",";
                  urls += ",";
                  aspect += ",";
                }
              }
              navigator.clipboard.writeText(
                "![" +
                  altsCopy +
                  "{aspect: " +
                  aspect +
                  "}{caption: " +
                  caption +
                  "," +
                  captionURL +
                  "}](" +
                  urls +
                  ")"
              );
            }
          }}
        >
          Copy {type !== "main" ? "Markdown" : "URL"}
        </Button>
        {/* {type !== "main" && (
          <Button
            variant="outlined"
            onClick={() => {
              navigator.clipboard.readText();
            }}
          >
            Paste Markdown
          </Button>
        )} */}
        <Button
          variant="outlined"
          onClick={() => {
            for (let i = 0; i < 4; i++) {
              setCookie("image" + i, "", { path: "/" });
            }
            setAlts(["", "", "", ""]);
          }}
        >
          Clear
        </Button>
      </Stack>
    </>
  );
}

function Markdown({ name, type }) {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cookies, setCookie] = useCookies([name]);
  // const [downloadURL, setDownloadURL] = useState(cookies[name]);

  // useEffect(() => {
  //   setDownloadURL(cookies[name]);
  // }, [cookies[name]]);

  const uploadFile = async (e) => {
    // Get the file
    let file = Array.from(e.target.files)[0];
    // const extension = file.type.split("/")[1];

    try {
      if (type === "main") {
        file = await resizeFileLarge(file);
      } else {
        file = await resizeFileSmall(file);
      }
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
          // const newImages = [...images];
          // newImages[index].url = downloadURL;
          // setCookie("images", newImages, { path: "/" });
          // setDownloadURL(downloadURL);
          setCookie(name, downloadURL, { path: "/" });
          setUploading(false);
        });

        enqueueSnackbar("Upload Success!", { variant: "success" });
      }
    );
  };

  return (
    <ListItemAvatar>
      <Avatar>
        {!uploading ? (
          cookies[name] ? (
            <ImageShimmer src={cookies[name]} alt={name} layout="fill" />
          ) : (
            <IconButton aria-label="upload" component="label">
              <CameraAltIcon />
              <input
                type="file"
                hidden
                onChange={uploadFile}
                accept="image/x-png,image/jpeg"
              />
            </IconButton>
          )
        ) : (
          <CircularProgressWithLabel
            show={uploading ? "inline-flex" : "none"}
            value={progress}
          />
        )}
      </Avatar>
    </ListItemAvatar>
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
