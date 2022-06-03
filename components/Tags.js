import { Typography } from "@mui/material";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../lib/firebase";
import { WithContext as ReactTags } from "react-tag-input";
import React, { useEffect } from "react";
import kebabCase from "lodash.kebabcase";

export default function Tags({
  // initial,
  tags,
  setTags,
}) {
  const [snapshot, loading, error] = useCollection(collection(db, "Tag"));
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
    tag["text"] = encodeURI(kebabCase(tag.text));
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

  return (
    <>
      {error && <Typography>Error: {JSON.stringify(error)}</Typography>}
      {loading && <Typography>Collection: Loading...</Typography>}
      {snapshot && (
        <div className="app">
          <ReactTags
            tags={tags}
            suggestions={snapshot.docs.map((row) => {
              return {
                id: row.id,
                text: row.id,
              };
            })}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            inputFieldPosition="bottom"
            autocomplete
          />
        </div>
      )}
    </>
  );
}
