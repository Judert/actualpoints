import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import {
  Divider,
  Typography,
  Checkbox,
  CircularProgress,
  Stack,
  Modal,
  Box,
  InputLabel,
  FormControl,
  NativeSelect,
  Button,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { db } from "../../../lib/firebase";
import {
  doc,
  writeBatch,
  serverTimestamp,
  getDocs,
  collection,
} from "firebase/firestore";
import { useDocumentData, useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import Content from "../../../components/Content";
import Authorize from "../../../components/Authorize";
import Tags from "../../../components/Tags";
import dynamic from "next/dynamic";
import "react-markdown-editor-lite/lib/index.css";
import Editor, { Plugins } from "react-markdown-editor-lite";
import Markdown from "../../../components/Markdown";
import ImageUploader from "../../../components/ImageUploader";
import { useSnackbar } from "notistack";
import Error from "../../../components/Error";
import HelpIcon from "@mui/icons-material/Help";

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
  const [article, loading, error] = useDocumentData(doc(db, "Article", slug));

  if (!loading && !error && article === undefined) {
    router.push("/404");
  }

  return (
    <Content>
      {(error || loading) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {error && <Error error={error} />}
          {loading && <CircularProgress />}
        </Box>
      )}
      {article && <Edit router={router} slug={slug} article={article} />}
    </Content>
  );
}

function Edit({ router, slug, article }) {
  const { enqueueSnackbar } = useSnackbar();
  // React hook form
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title required")
      .min(4, "Too short")
      .max(60, "Too long"),
    subtitle: Yup.string()
      .required("Subtitle required")
      .min(4, "Too short")
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
      .min(4, "Too short")
      .max(100, "Too long"),
    category: Yup.string(),
    tags: Yup.array()
      .min(3, "Too few tags")
      .max(10, "Too many tags")
      .of(
        Yup.object().shape({
          id: Yup.string()
            .max(25, "Too long")
            .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Not valid"),
          text: Yup.string(),
        })
      ),
    published: Yup.boolean(),
    content: Yup.object().shape({
      text: Yup.string(),
      // count: Yup.number()
      //   .integer()
      //   .min(2000, "Too short, need at least 2000 words"),
      // html: Yup.string().test(
      //   "contains-table",
      //   "Need at least one table",
      //   (value) => {
      //     return value.includes("MuiTableContainer");
      //   }
      // ),
    }),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    // defaultValues: validationSchema.cast(),
    resolver: yupResolver(validationSchema),
  });

  // Firebase Updates
  const handleDone = (data) => {
    update(data).then(
      function (value) {
        enqueueSnackbar("Update Success!", { variant: "success" });
        router.push("/admin/article");
      },
      function (error) {
        enqueueSnackbar("Update Failed: " + error, { variant: "error" });
      }
    );
  };
  const handleCancel = () => {
    router.push("/admin/article");
  };
  const handleSave = (data) => {
    update(data).then(
      function (value) {
        enqueueSnackbar("Update Success!", { variant: "success" });
      },
      function (error) {
        enqueueSnackbar("Update Failed: " + error, { variant: "error" });
      }
    );
  };
  const update = async (data) => {
    const tags = (await getDocs(collection(db, "Tag"))).docs.map((doc) => {
      return doc.id;
    });
    const batch = writeBatch(db);
    batch.update(doc(db, "Article", slug), {
      title: data.title,
      subtitle: data.subtitle,
      image: data.image,
      alt: data.alt,
      category: data.category,
      tags: data.tags,
      published: data.published,
      content: data.content.text,
      date: serverTimestamp(),
    });
    const tagIds = data.tags.map((tag) => tag.id);
    const newTags = tagIds.filter((x) => !tags.includes(x));
    // console.log(tags, tagIds, newTags);
    for (let i = 0; i < newTags.length; i++) {
      batch.set(doc(db, "Tag", newTags[i]), {});
    }
    await batch.commit();
  };

  // // Word count shit, we need this to have realtime word count
  // const watchCount = watch(
  //   "content.count",
  //   ReactDOMServer.renderToString(<Markdown>{article.content}</Markdown>)
  //     .replace(/<[^>]+>/g, "")
  //     .split(" ").length
  // );
  // const handleChange = (count) => setValue("content.count", count);

  const [categories, loading, error] = useCollection(
    collection(db, "Category")
  );

  return (
    <>
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Title"}
        defaultValue={article.title}
        {...register("title")}
        error={errors.title ? true : false}
        helperText={errors.title?.message}
      />
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Subtitle"}
        defaultValue={article.subtitle}
        {...register("subtitle")}
        error={errors.subtitle ? true : false}
        helperText={errors.subtitle?.message}
      />
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Image URL"}
        defaultValue={article.image}
        {...register("image")}
        error={errors.image ? true : false}
        helperText={errors.image?.message}
      />
      <TextField
        fullWidth
        multiline
        variant="standard"
        label={"Image Alt Text"}
        defaultValue={article.alt}
        {...register("alt")}
        error={errors.alt ? true : false}
        helperText={errors.alt?.message}
      />
      {(error || loading) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {error && <Error error={error} />}
          {loading && <CircularProgress />}
        </Box>
      )}
      {categories && (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Category
            </InputLabel>
            <NativeSelect
              defaultValue={article.category}
              inputProps={{
                name: "category",
                id: "uncontrolled-native",
              }}
              {...register("category")}
            >
              {categories.docs.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.data().name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Box>
      )}
      <Controller
        control={control}
        name="tags"
        defaultValue={article.tags}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Tags tags={value} setTags={onChange} />
        )}
      />
      {errors.tags?.message && (
        <Typography color="error.main">{errors.tags.message}</Typography>
      )}
      {Array.isArray(errors.tags) &&
        errors.tags.map((error, i) => (
          <Typography key={i} color="error.main">
            {"Tag " + (i + 1) + ": " + error.id.message}{" "}
          </Typography>
        ))}

      <Stack direction="row" spacing={1}>
        <Help />
        <Controller
          control={control}
          name="published"
          defaultValue={article.published}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Typography>
              Published
              <Checkbox value={value} onChange={onChange} />
            </Typography>
          )}
        />
      </Stack>
      <ImageUploader markdown={true} />
      <Divider />
      <Controller
        control={control}
        name="content"
        defaultValue={{
          text: article.content,
          // count: watchCount,
          // html: ReactDOMServer.renderToString(
          //   <Markdown>{article.content}</Markdown>
          // ),
        }}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <MdEditor
            htmlClass={null}
            style={{ height: "500px" }}
            value={value.text}
            // eslint-disable-next-line react/no-children-prop
            renderHTML={(value) => <Markdown>{value}</Markdown>}
            onChange={({ html, text }, event) => {
              // const count = html.replace(/<[^>]+>/g, "").split(" ").length;
              onChange({
                text: text,
                // count: count,
                // html: html,
              });
              // handleChange(count);
            }}
          />
        )}
      />
      {/* <Typography>Word Count: {watchCount}</Typography> */}
      {/* {errors.content?.html && (
        <Typography color="error.main">
          {errors.content.html.message}
        </Typography>
      )}
      {errors.content?.count && (
        <Typography color="error.main">
          {errors.content.count.message}
        </Typography>
      )} */}
      <Divider />
      <Stack direction="row" spacing={1}>
        <Button variant="contained" onClick={handleSubmit(handleDone)}>
          Save and complete
        </Button>
        <Button variant="outlined" onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={handleSubmit(handleSave)}
        >
          Save
        </Button>
      </Stack>
    </>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Help() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="outlined" startIcon={<HelpIcon />} onClick={handleOpen}>
        Help
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4" gutterBottom>
            Help
          </Typography>
          <Typography variant="h6">General</Typography>
          <ul>
            <li>Try have around 2000 words for your article to perform best</li>
            <li>Have as many lists and tables as possible</li>
          </ul>
          <Typography variant="h6">Inserting Images</Typography>
          <ul>
            <li>Please upload high resolution images (3840x2160 or more)</li>
            <li>16:9 Images only</li>
            <li>
              !&#91;AltText &#123;caption: Photo by Someone&#125;&#93;&#40;image
              url&#41;
            </li>
            <li>You need AltText for accessibility for all readers</li>
            <li>Have a caption if credit is required</li>
          </ul>
        </Box>
      </Modal>
    </div>
  );
}
