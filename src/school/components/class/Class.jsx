import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

export default function Class() {
  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchClass = () => {
    axios
      .get(`${baseApi}/class/all`)
      .then((resp) => {
        console.log(resp.data.data);
        setClasses(resp.data.data);
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
        toast.error("something went wrong");
      });
  };
  useEffect(() => {
    fetchClass();
  }, []);
  const Formik = useFormik({
    initialValues: { class_text: "", class_num: "" },
    validationSchema: classSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const token = localStorage.getItem("token");

      if (edit && editId) {
        // Update
        axios
          .patch(`${baseApi}/class/update/${editId}`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            fetchClass();
            Formik.resetForm();
            setEdit(false);
            setEditId(null);
          })
          .catch((err) => {
            console.log("Error updating class:", err);
            toast.error("something went wrong");
          });
      } else {
        // Create
        axios
          .post(`${baseApi}/class/create`, values, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            toast.success("Class added successfully");
            fetchClass();
            Formik.resetForm();
          })
          .catch((err) => {
            console.log("Error creating class:", err);
            toast.error("something went wrong");
          });
      }
    },
  });

  const handleEdit = (id) => {
    const selectedClass = classes.find((cls) => cls._id === id);
    if (selectedClass) {
      Formik.setValues({
        class_text: selectedClass.class_text,
        class_num: selectedClass.class_num,
      });
      setEdit(true);
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${baseApi}/class/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("class deleted successfully");
        fetchClass();
      })
      .catch((err) => {
        console.error("Error deleting class:", err);
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
      <h1>Class</h1>
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
        }}
        noValidate
        autoComplete="off"
        onSubmit={Formik.handleSubmit}
      >
        <Typography variant="h2" sx={{ textAlign: "center" }}>
          {edit ? "Edit Class" : "Add New Class"}
        </Typography>

        <TextField name="class_text" label="Class Text" value={Formik.values.class_text} onChange={Formik.handleChange} onBlur={Formik.handleBlur} />
        {Formik.touched.class_text && Formik.errors.class_text && <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.class_text}</p>}

        <TextField name="class_num" label="Class Number" value={Formik.values.class_num} onChange={Formik.handleChange} onBlur={Formik.handleBlur} />
        {Formik.touched.class_num && Formik.errors.class_num && <p style={{ color: "red", textTransform: "capitalize" }}>{Formik.errors.class_num}</p>}

        <Button type="submit" variant="contained">
          {edit ? "Update" : "Submit"}
        </Button>
        {edit && (
          <Button onClick={cancelEdit} type="button" variant="outlined" color="secondary">
            Cancel
          </Button>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {classes &&
          classes.map((x) => (
            <Paper key={x._id} sx={{ m: 2, p: 2 }}>
              <Typography variant="h4">
                Class: {x.class_text} [{x.class_num}]
              </Typography>
              <Box>
                <Button onClick={() => handleEdit(x._id)}>
                  <EditIcon />
                </Button>
                <Button onClick={() => handleDelete(x._id)} sx={{ color: "red" }}>
                  <DeleteIcon />
                </Button>
              </Box>
            </Paper>
          ))}
      </Box>
    </>
  );
}
