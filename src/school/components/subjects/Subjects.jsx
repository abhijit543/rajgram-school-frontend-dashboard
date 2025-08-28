import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { subjectSchema } from "../../../yupSchema/subjectSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export default function Subjects() {
  const [subject, setSubject] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchSubject = () => {
    axios
      .get(`${baseApi}/subject/all`)
      .then((resp) => {
        console.log(resp.data.data);
        setSubject(resp.data.data);
      })
      .catch((err) => {
        console.error("Error fetching Subject:", err);
        toast.error("something went wrong");
      });
  };
  useEffect(() => {
    fetchSubject();
  }, []);
  const Formik = useFormik({
    initialValues: { subject_name: "", subject_codename: "" },
    validationSchema: subjectSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const token = localStorage.getItem("token");

      if (edit && editId) {
        // Update
        axios
          .patch(`${baseApi}/subject/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            fetchSubject();
            Formik.resetForm();
            setEdit(false);
            setEditId(null);
          })
          .catch((err) => {
            console.log("Error updating subject:", err);
            toast.error("something went wrong");
          });
      } else {
        // Create
        axios
          .post(`${baseApi}/subject/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            toast.success("subject added successfully");
            fetchSubject();
            Formik.resetForm();
          })
          .catch((err) => {
            console.log("Error creating subject:", err);
            toast.error("something went wrong");
          });
      }
    },
  });

  const handleEdit = (id) => {
    const selectedSubject = subject.find((sub) => sub._id === id);
    if (selectedSubject) {
      Formik.setValues({
        subject_name: selectedSubject.subject_name,
        subject_codename: selectedSubject.subject_codename,
      });
      setEdit(true);
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${baseApi}/subject/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("subject deleted successfully");
        fetchSubject();
      })
      .catch((err) => {
        console.error("Error deleting subject:", err);
        toast.error("something went wrong");
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
  };

  return (
    <>
      <h1>Subject</h1>

      <Box
        component="form"
        sx={{
          "&>:not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          minWidth: "230px",
          margin: "auto",
          background: "#fff",
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          {edit ? "Edit Subject" : "Add New Subject"}
        </Typography>

        <TextField name="subject_name" label="Subject Name" value={Formik.values.subject_name} onChange={Formik.handleChange} onBlur={Formik.handleBlur} />
        {Formik.touched.subject_name && Formik.errors.subject_name && <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.subject_name}</p>}

        <TextField name="subject_codename" label="Subject Code Name" value={Formik.values.subject_codename} onChange={Formik.handleChange} onBlur={Formik.handleBlur} />
        {Formik.touched.subject_codename && Formik.errors.subject_codename && <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.subject_codename}</p>}

        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          {edit ? "Update" : "Submit"}
        </Button>

        {edit && (
          <Button onClick={cancelEdit} type="button" variant="outlined" color="secondary">
            Cancel
          </Button>
        )}
      </Box>

      {/* Table for displaying subjects */}
      <Box sx={{ mt: 5, px: 3 }}>
        <Typography variant="h5" gutterBottom>
          Subject List
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Subject Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Code Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subject && subject.length > 0 ? (
                subject.map((x) => (
                  <TableRow key={x._id}>
                    <TableCell>{x.subject_name}</TableCell>
                    <TableCell>{x.subject_codename}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(x._id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(x._id)} sx={{ color: "red" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No subjects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
