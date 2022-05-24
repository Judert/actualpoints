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

  return (
    <Content>
      {errorArticle && (
        <Typography>Error: {JSON.stringify(errorArticle)}</Typography>
      )}
      {loadingArticle && <Typography>Collection: Loading...</Typography>}
      {valueArticle && (
        <Edit router={router} slug={slug} valueArticle={valueArticle} />
      )}
    </Content>
  );
}

function Edit({ router, slug, valueArticle }) {
  // React hook form
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title required")
      .min(3, "Too short")
      .max(60, "Too long"),
    subtitle: Yup.string()
      .required("Subtitle required")
      .min(3, "Too short")
      .max(255, "Too long"),
    image: Yup.string()
      .url("Url not valid")
      .required("Image url required")
      .matches(
        /^https:\/\/firebasestorage.googleapis.com/,
        "firebasestorage.googleapis.com url required"
      ),
    alt: Yup.string()
      .required("Alt text required")
      .min(3, "Too short")
      .max(100, "Too long"),
    category: Yup.string(),
    tags: Yup.array()
      .min(3, "Too few tags")
      .of(
        Yup.object().shape({
          id: Yup.string()
            .min(25, "Tag(s) too long")
            .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tag(s) not valid"),
          text: Yup.string()
            .min(25, "Tag(s) too long")
            .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Tag(s) not valid"),
        })
      ),
    published: Yup.boolean(),
    content: Yup.string()
      .required("Content required")
      .matches(/^[\s\S]{1,}$/, "Content required"),
    // .default(valueArticle.content),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // defaultValues: validationSchema.cast(),
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
      category: data.category,
      tags: data.tags,
      published: data.published,
      content: data.content,
      date: serverTimestamp(),
    });
    const batch = writeBatch(db);
    for (let i = 0; i < data.tags.length; i++) {
      batch.set(doc(db, "Tag", data.tags[i].id), {});
    }
    await batch.commit();
  };

  return (
    <>
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Title"}
        defaultValue={valueArticle.title}
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
        {...register("alt")}
        error={errors.alt ? true : false}
        helperText={errors.alt?.message}
      />
      <Box sx={{ minWidth: 120 }}>
        <FormControl>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Category
          </InputLabel>
          <NativeSelect
            defaultValue={valueArticle.category}
            inputProps={{
              name: "category",
              id: "uncontrolled-native",
            }}
            {...register("category")}
          >
            {Category.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </Box>
      <Controller
        control={control}
        name="tags"
        defaultValue={valueArticle.tags}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Tags tags={value} setTags={onChange} />
        )}
      />
      <Controller
        control={control}
        name="published"
        defaultValue={valueArticle.published}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Typography>
            Published
            <Checkbox value={value} onChange={onChange} />
          </Typography>
        )}
      />

      <Divider />
      <ImageUploader markdown={true} />
      <Controller
        control={control}
        name="content"
        defaultValue={valueArticle.content}
        render={({ field: { onChange, onBlur, value, ref } }) => (
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
        )}
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
  );
}
