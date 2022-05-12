import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import {
  ButtonGroup,
  Divider,
  Typography,
  Checkbox,
  CircularProgress,
} from "@mui/material";
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
import Tags from "../../../components/Tags";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import Editor, { Plugins } from "react-markdown-editor-lite";
import Markdown from "../../../components/Markdown";
import ImageUploader from "../../../components/ImageUploader";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

Editor.unuse(Plugins.Image);
Editor.unuse(Plugins.FontUnderline);
let mounted = false;

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
    alt: Yup.string().required("Please give alt text for the front image"),
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
      alt: data.alt,
      category: category,
      tags: tags,
      published: checked,
      date: serverTimestamp(),
      content: content,
    });
    const batch = writeBatch(db);
    for (let i = 0; i < tags.length; i++) {
      batch.set(doc(db, "Tag", tags[i].id), {});
    }
    await batch.commit();
  };

  // Initialize to pass
  const [checked, setChecked] = React.useState(false);
  const [category, setCategory] = React.useState(Category[0].id);
  const [content, setContent] = React.useState("");

  // wait for article then set for components
  const [tags, setTags] = React.useState([]);
  useEffect(() => {
    if (!mounted) {
      if (valueArticle) {
        setTags(valueArticle.tags);
        setContent(valueArticle.content);
        setChecked(valueArticle.published);
        setCategory(valueArticle.category);
        mounted = true;
      }
    }
  }, [valueArticle]);

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
          <TextField
            fullWidth
            multiline
            variant="standard"
            label={"Front Image Alt Text"}
            defaultValue={valueArticle.alt}
            id="alt"
            name="alt"
            {...register("alt")}
            error={errors.alt ? true : false}
            helperText={errors.alt?.message}
          />
          <CategorySelect
            valueArticle={valueArticle}
            category={category}
            setCategory={setCategory}
          />
          <Tags tags={tags} setTags={setTags} />
          <Published checked={checked} setChecked={setChecked} />
          <Divider />
          <ImageUploader markdown={true} />
          <TextEditor value={content} onChange={setContent} />
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

function TextEditor({ value, onChange }) {
  return (
    <MdEditor
      htmlClass={null}
      style={{ height: "500px" }}
      value={value}
      // eslint-disable-next-line react/no-children-prop
      renderHTML={(value) => <Markdown>{value}</Markdown>}
      onChange={({ html, text }, event) => {
        onChange(text);
      }}
    />
  );
}

function Published({ checked, setChecked }) {
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

function CategorySelect({ category, setCategory }) {
  const handleChange = (event) => {
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
          onChange={handleChange}
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
