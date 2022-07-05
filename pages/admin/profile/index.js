import Authorize from "../../../components/Authorize";
import Content from "../../../components/Content";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, Stack, TextField } from "@mui/material";
import ImageUploader from "../../../components/ImageUploader";
import { UserContext } from "../../../lib/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useSnackbar } from "notistack";

export default function Profile() {
  return (
    <Authorize>
      <ProfileEdit />
    </Authorize>
  );
}

function ProfileEdit() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { displayName, desc, photoURL, user } = useContext(UserContext);

  // React hook form
  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required("Required").max(50, "Too long"),
    desc: Yup.string().required("Required").max(255, "Too long"),
    photoURL: Yup.string()
      .url("Not valid")
      .required("Required")
      .matches(
        /^https:\/\/firebasestorage.googleapis.com/,
        "firebasestorage.googleapis.com image required"
      ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Firebase Updates
  const handleDone = (data) => {
    update(data).then(
      function (value) {
        enqueueSnackbar("Update Success!", { variant: "success" });
        router.push("/admin");
      },
      function (error) {
        enqueueSnackbar("Update Failed: " + error, { variant: "error" });
      }
    );
  };
  const handleCancel = () => {
    router.push("/admin");
  };
  const update = async (data) => {
    await updateDoc(doc(db, "User", user.uid), {
      displayName: data.displayName,
      desc: data.desc,
      photoURL: data.photoURL,
    });
  };

  return (
    <Content>
      <TextField
        fullWidth
        variant="standard"
        label={"Display Name"}
        defaultValue={displayName}
        id="displayName"
        name="displayName"
        {...register("displayName")}
        error={errors.displayName ? true : false}
        helperText={errors.displayName?.message}
      />
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Description"}
        defaultValue={desc}
        id="desc"
        name="desc"
        {...register("desc")}
        error={errors.desc ? true : false}
        helperText={errors.desc?.message}
      />
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Profile Photo"}
        defaultValue={photoURL}
        id="photoURL"
        name="photoURL"
        {...register("photoURL")}
        error={errors.photoURL ? true : false}
        helperText={errors.photoURL?.message}
      />
      <ImageUploader markdown={false} />
      {/* <Stack direction="row" spacing={1}> */}
      <Button
        sx={{ alignSelf: "flex-start" }}
        variant="contained"
        onClick={handleSubmit(handleDone)}
      >
        Save and complete
      </Button>
      {/* <Button variant="outlined" onClick={() => handleCancel()}>
          Cancel
        </Button> */}
      {/* </Stack> */}
    </Content>
  );
}
