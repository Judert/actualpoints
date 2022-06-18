import { Box, CircularProgress, Typography } from "@mui/material";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../lib/firebase";
import { WithContext as ReactTags } from "react-tag-input";
import React, { useEffect } from "react";
import kebabCase from "lodash.kebabcase";
import Error from "./Error";

export default function Tags({ tags, setTags }) {
  const [snapshot, loading, error] = useCollection(collection(db, "Tag"));

  return (
    <>
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
      {snapshot && (
        <Edit
          snapshot={snapshot}
          loading={loading}
          error={error}
          tags={tags}
          setTags={setTags}
        />
      )}
    </>
  );
}

function Edit({ snapshot, tags, setTags }) {
  const KeyCodes = {
    tab: 9,
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];
  // useEffect(() => {
  //   setTags(initial);
  // }, []);
  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  const handleAddition = (tag) => {
    tag["id"] = encodeURI(kebabCase(tag.id));
    tag["text"] = encodeURI(kebabCase(tag.id));
    setTags([...tags, tag]);
  };
  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    // re-render
    setTags(newTags);
  };
  const handleTagClick = (index) => {
    // console.log("The tag at index " + index + " was clicked");
  };
  const onClearAll = () => {
    setTags([]);
  };

  const suggestions = snapshot.docs.map((row) => {
    return {
      id: row.id,
      text: row.id + " (" + row.data().count + ")",
    };
  });

  return (
    <div className="app">
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        inputFieldPosition="bottom"
        autocomplete
        clearAll
        onClearAll={onClearAll}
      />
    </div>
  );
}
