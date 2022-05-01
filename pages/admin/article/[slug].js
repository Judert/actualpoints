import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import SaveIcon from "@mui/icons-material/Save";
import { ButtonGroup, Divider, Typography, Checkbox } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { db } from "../../../lib/firebase";
import {
  doc,
  updateDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import Category from "../../../data/category.json";
import Content from "../../../components/Content";
import Authorize from "../../../components/Authorize";
import dynamic from "next/dynamic";
import Tags from "../../../components/Tags";

const Editor = dynamic(
  () => {
    return import("react-draft-wysiwyg").then((mod) => mod.Editor);
  },
  { ssr: false }
);

export default function AdminArticleEdit() {
  return (
    <Authorize>
      <ArticleEdit />
    </Authorize>
  );
}

function ArticleEdit() {
  // Firebase Get
  const router = useRouter();
  const { slug } = router.query;
  const [valueArticle, loadingArticle, errorArticle] = useDocumentData(
    doc(db, "Article", slug)
  );

  // React hook form
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Please give a title"),
    subtitle: Yup.string().required("Please give a subtitle"),
    image: Yup.string().required("Please give a url"),
    // published: Yup.boolean(),
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
    router.push("/admin/article");
  };
  const handleCancel = () => {
    router.push("/admin/article");
  };
  const handleSave = (data) => {
    update(data);
  };
  const update = async (data) => {
    await updateDoc(doc(db, "Article", slug), {
      title: data.title,
      subtitle: data.subtitle,
      image: data.image,
      category: category,
      tags: tags,
      published: checked,
      date: serverTimestamp(),
      content: JSON.parse(
        JSON.stringify(convertToRaw(editorState.getCurrentContent()))
      ),
    });
    const batch = writeBatch(db);
    for (let i = 0; i < tags.length; i++) {
      batch.set(doc(db, "Tag", tags[i].id), {});
    }
    await batch.commit();
  };

  // Initialize to pass
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(EditorState.createEmpty().getCurrentContent())
  );
  const [checked, setChecked] = React.useState(false);
  const [category, setCategory] = React.useState(Category[0].id);
  const [tags, setTags] = React.useState([]);

  return (
    <Content>
      {errorArticle && (
        <Typography>Error: {JSON.stringify(errorArticle)}</Typography>
      )}
      {loadingArticle && <Typography>Collection: Loading...</Typography>}
      {valueArticle && (
        <>
          <TextField
            fullWidth
            multiline
            variant="standard"
            label={"Title"}
            defaultValue={valueArticle.title}
            id="title"
            name="title"
            {...register("title")}
            error={errors.title ? true : false}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth
            multiline
            variant="standard"
            label={"Subtitle"}
            defaultValue={valueArticle.subtitle}
            id="subtitle"
            name="subtitle"
            {...register("subtitle")}
            error={errors.subtitle ? true : false}
            helperText={errors.subtitle?.message}
          />
          <TextField
            fullWidth
            multiline
            variant="standard"
            label={"Front Image"}
            defaultValue={valueArticle.image}
            id="image"
            name="image"
            {...register("image")}
            error={errors.image ? true : false}
            helperText={errors.image?.message}
          />
          <CategorySelect
            valueArticle={valueArticle}
            category={category}
            setCategory={setCategory}
          />
          <Tags initial={valueArticle.tags} tags={tags} setTags={setTags} />
          <Published
            valueArticle={valueArticle}
            checked={checked}
            setChecked={setChecked}
          />
          <Divider />
          <TextEditor
            valueArticle={valueArticle}
            editorState={editorState}
            setEditorState={setEditorState}
          />
          <Divider />
          <ButtonGroup sx={{ my: 4 }}>
            <Button variant="contained" onClick={handleSubmit(handleDone)}>
              Save and complete
            </Button>
            <Button variant="outlined" onClick={() => handleCancel()}>
              Cancel
            </Button>
            <Button startIcon={<SaveIcon />} onClick={handleSubmit(handleSave)}>
              Save
            </Button>
          </ButtonGroup>
        </>
      )}
    </Content>
  );
}

function TextEditor({ valueArticle, editorState, setEditorState }) {
  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(convertFromRaw(valueArticle.content))
    );
  }, []);

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={(editorState) => setEditorState(editorState)}
      defaultValue={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
    />
  );
}

function Published({ valueArticle, checked, setChecked }) {
  useEffect(() => {
    setChecked(valueArticle.published);
  }, []);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Typography>
      Published
      <Checkbox value={checked} onChange={handleChange} />
    </Typography>
  );
}

function CategorySelect({ valueArticle, category, setCategory }) {
  useEffect(() => {
    setCategory(valueArticle.category);
  }, []);
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
          Category
        </InputLabel>
        <NativeSelect
          value={category}
          onChange={handleChangeCategory}
          inputProps={{
            name: "category",
            id: "uncontrolled-native",
          }}
        >
          {Category.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </Box>
  );
}
