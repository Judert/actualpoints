import Authorize from "../../../components/Authorize";
import Content from "../../../components/Content";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Button, ButtonGroup, TextField } from "@mui/material";
import ImageUploader from "../../../components/ImageUploader";
import { UserContext } from "../../../lib/context";
import { useContext } from "react";
import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function Profile() {
  return (
    <Authorize>
      <ProfileEdit />
    </Authorize>
  );
}

function ProfileEdit() {
  const router = useRouter();
  const { displayName, desc, photoURL, user } = useContext(UserContext);

  // React hook form
  const validationSchema = Yup.object().shape({
    displayName: Yup.string()
      .required("Please give a display name")
      .max(50, "Display name is too long"),
    desc: Yup.string()
      .required("Please give a description")
      .max(255, "Description is too long"),
    photoURL: Yup.string()
      .url("Url is not valid")
      .required("Please give a url")
      .matches(
        /^https:\/\/firebasestorage.googleapis.com/,
        "firebasestorage.googleapis.com image required"
      ),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Firebase Updates
  const handleDone = (data) => {
    update(data);
    router.push("/admin");
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
      <ButtonGroup sx={{ my: 2 }}>
        <Button variant="contained" onClick={handleSubmit(handleDone)}>
          Save and complete
        </Button>
        <Button variant="outlined" onClick={() => handleCancel()}>
          Cancel
        </Button>
      </ButtonGroup>
    </Content>
  );
}
