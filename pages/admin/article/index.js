import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
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
import { otherToJSON, db } from "../../../lib/firebase";
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
  getDocs,
} from "firebase/firestore";
import {
  Checkbox,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Authorize from "../../../components/Authorize";
import { useContext } from "react";
import { UserContext } from "../../../lib/context";
import Content from "../../../components/Content";
import { useRouter } from "next/router";
import kebabCase from "lodash.kebabcase";
import { useSnackbar } from "notistack";
import Error from "../../../components/Error";

export default function AdminArticle() {
  return (
    <Authorize>
      <Articles />
    </Authorize>
  );
}

function Articles() {
  // Auth
  const { username, user, displayName, photoURL, desc } =
    useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  // Firebase
  const [rows, loading, error] = useCollection(
    query(
      collection(db, "Article"),
      where("uid", "==", user.uid),
      orderBy("date", "desc")
    )
  );
  const handleAdd = async (e) => {
    e.preventDefault();
    const id = slug + "-" + user.uid;
    const ref = doc(db, "Article", id);
    const snapshot = await getDoc(ref).catch((error) => {
      enqueueSnackbar("FAILED_ARTICLE_GET: " + error, { variant: "error" });
      return;
    });
    const categories = (
      await getDocs(collection(db, "Category")).catch((error) => {
        enqueueSnackbar("FAILED_CATEGORY_GET: " + error, { variant: "error" });
        return;
      })
    ).docs.map(otherToJSON);
    if (snapshot.exists()) {
      enqueueSnackbar("You already have an article with that name!", {
        variant: "error",
      });
      return;
    }
    await setDoc(ref, {
      title: title,
      subtitle: "",
      image: "",
      alt: "",
      content: "",
      published: false,
      category: categories[0].id,
      tags: [],
      date: serverTimestamp(),
      slug: slug,
      username: username,
      uid: user.uid,
      displayName: displayName,
      photoURL: photoURL,
      desc: desc,
    })
      .catch((error) => {
        enqueueSnackbar("FAILED_SET: " + error, { variant: "error" });
        return;
      })
      .then(() => {
        enqueueSnackbar("Success!", { variant: "success" });
        // router.push(`/admin/article/${id}`);
      });
  };
  const handleEdit = async (id) => {
    router.push(`/admin/article/${id}`);
  };
  const handleRemove = async (id) => {
    await deleteDoc(doc(db, "Article", id)).then(
      function (value) {
        enqueueSnackbar("Delete Success!", { variant: "success" });
      },
      function (error) {
        enqueueSnackbar("Delete Failed: " + error, { variant: "error" });
      }
    );
  };

  // New article
  const router = useRouter();
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabCase(title));
  const isValid =
    title.length >= 4 &&
    title.length <= 60 &&
    slug.length >= 4 &&
    slug.length <= 100;

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

  // Confirm delete dialog
  const [rowId, setRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDelete = () => {
    setOpen(false);
    handleRemove(rowId);
  };

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
      {rows && (
        <>
          <TableContainer>
            <Table aria-label="custom pagination table">
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
                    <TableCell
                      // sx={{ display: { xs: "none", sm: "flex" } }}
                      // style={{ width: 160 }}
                      align="right"
                    >
                      {row.data().date?.toDate().toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Checkbox disabled checked={row.data().published} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(row.id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setRowId(row.id);
                          handleClickOpen();
                        }}
                      >
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
          <Box
            component="form"
            onSubmit={handleAdd}
            sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}
          >
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              name="Article Title"
              label="Article Title"
              variant="standard"
            />
            {/* <Typography>{slug}</Typography> */}
            <Button
              sx={{ alignSelf: "center" }}
              variant="contained"
              type="submit"
              disabled={!isValid}
            >
              Create New Article
            </Button>
          </Box>
        </>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleClose();
            }}
          >
            No
          </Button>
          <Button
            autoFocus
            onClick={() => {
              handleCloseDelete();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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
