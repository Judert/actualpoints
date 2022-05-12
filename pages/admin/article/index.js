import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../../lib/firebase";
import {
  collection,
  query,
  where,
  Timestamp,
  setDoc,
  getDoc,
  deleteDoc,
  doc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { Checkbox, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Authorize from "../../../components/Authorize";
import { useContext } from "react";
import { UserContext } from "../../../lib/context";
import Content from "../../../components/Content";
import { useRouter } from "next/router";
import kebabCase from "lodash.kebabcase";
import Category from "../../../data/category.json";

export default function AdminArticle() {
  return (
    <Authorize>
      <Articles />
    </Authorize>
  );
}

function Articles() {
  // Auth
  const { username, user } = useContext(UserContext);

  // Firebase
  const [rows, loading, error] = useCollection(
    query(
      collection(db, "Article"),
      where("username", "==", username),
      orderBy("date", "desc")
    )
  );
  const handleAdd = async (e) => {
    e.preventDefault();
    const id = slug + "-" + user.uid;
    const exists = (await getDoc(doc(db, "Article", id))).exists();
    if (exists) {
      // TODO: show error toast
      alert("Article already exists");
      return;
    }
    const snapshotUser = await getDoc(doc(db, "User", user.uid)).catch(
      (error) => {
        // TODO: show error toast
        console.log(error);
      }
    );
    await setDoc(doc(db, "Article", id), {
      title: title,
      subtitle: "",
      image: "",
      alt: "",
      content: "",
      date: serverTimestamp(),
      username: username,
      published: false,
      category: Category[0].id,
      tags: [],
      slug: slug,
      uid: user.uid,
      displayName: snapshotUser.data().displayName,
      photoURL: snapshotUser.data().photoURL,
    }).catch((error) => {
      // TODO: error toast
      console.log(error);
    });
    // .then(() => {
    //   // TODO: success toast
    //   router.push(`/admin/article/${slug}`);
    // });
  };
  const handleEdit = async (id) => {
    router.push(`/admin/article/${id}`);
  };
  const handleRemove = async (id) => {
    await deleteDoc(doc(db, "Article", id));
  };

  // New article
  const router = useRouter();
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  // Page handling
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.size) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Content>
      {error && <Typography>Error: {JSON.stringify(error)}</Typography>}
      {loading && <Typography>Collection: Loading...</Typography>}
      {rows && (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Published</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.docs.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.data().title}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.data().date?.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox disabled checked={row.data().published} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleRemove(row.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={4}
                    count={rows.size}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <form onSubmit={handleAdd}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article Title"
            />
            <p>
              <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid}>
              Create New Article
            </button>
          </form>
        </>
      )}
    </Content>
  );
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
