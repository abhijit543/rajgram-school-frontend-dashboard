import { Box, Button, Paper, TextField, Typography, Stack, IconButton, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useFormik } from "formik";
import { noticeSchema } from "../../../yupSchema/noticeSchema";
import axios from "axios";
import { baseApi } from "../../../environment";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast } from "react-toastify";

export default function Notice() {
  const [notices, setNotices] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${baseApi}/notice/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data?.data) {
        setNotices(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      title: "",
      message: "",
      audience: "Website",
      url: "",
    },
    validationSchema: noticeSchema,

    onSubmit: (values, { resetForm }) => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const apiCall = editId ? axios.patch(`${baseApi}/notice/update/${editId}`, values, { headers }) : axios.post(`${baseApi}/notice/create`, values, { headers });

      apiCall
        .then(() => {
          toast.success(editId ? "Notice updated successfully" : "Notice added successfully");
          fetchNotices();
          resetForm();
          setEditId(null);
        })
        .catch((err) => {
          console.error("Notice operation failed:", err);
          toast.error("Something went wrong");
        });
    },
  });

  const handleEdit = (id) => {
    const selected = notices.find((notice) => notice._id === id);
    if (selected) {
      formik.setValues({
        date: selected.date ? new Date(selected.date) : new Date(),
        title: selected.title,
        message: selected.message,
        audience: selected.audience || "Website",
        url: selected.url || "",
      });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    axios
      .delete(`${baseApi}/notice/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Notice deleted successfully");
        fetchNotices();
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        toast.error("Something went wrong while deleting");
      });
  };

  const cancelEdit = () => {
    setEditId(null);
    formik.resetForm();
  };

  return (
    <>
      <Typography variant="h4" align="center" mt={2} mb={1}>
        {editId ? "Edit Notice" : "Add New Notice"}
      </Typography>

      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          m: "auto",
          mb: 4,
          width: { xs: "90%", sm: "60%", md: "45%" },
          p: 3,
          bgcolor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={formik.values.date}
            onChange={(val) => formik.setFieldValue("date", val)}
            renderInput={(params) => (
              <TextField
                fullWidth
                margin="normal"
                {...params}
                name="date"
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            )}
          />
        </LocalizationProvider>

        <TextField
          label="Title"
          fullWidth
          margin="normal"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <TextField
          label="Message"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          name="message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
        />
        <TextField
          label="URL (Optional)"
          fullWidth
          margin="normal"
          name="url"
          value={formik.values.url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.url && Boolean(formik.errors.url)}
          helperText={formik.touched.url && formik.errors.url}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Audience</InputLabel>
          <Select
            name="audience"
            value={formik.values.audience}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.audience && Boolean(formik.errors.audience)}
            label="Audience"
          >
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Teacher">Teacher</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {editId ? "Update" : "Submit"}
          </Button>
          {editId && (
            <Button variant="outlined" color="secondary" onClick={cancelEdit} fullWidth>
              Cancel
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ px: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {notices.map((notice) => (
          <Paper key={notice._id} sx={{ p: 2, width: "300px" }}>
            <Typography variant="subtitle2" color="text.secondary">
              {notice.date ? new Date(notice.date).toLocaleDateString() : "No Date"} • {notice.audience}
            </Typography>

            <Typography variant="h6">{notice.title}</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {notice.message}
            </Typography>
            <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
              <a href={notice.url} target="_blank" rel="noopener noreferrer">
                {notice.url}
              </a>
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => handleEdit(notice._id)} color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(notice._id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Box>
    </>
  );
}
