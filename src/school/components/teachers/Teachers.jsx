import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { teacherValidationSchema } from "../../../yupSchema/teacher.Schema";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { baseApi } from "../../../environment";
import { toast } from "react-toastify";
import TeacherGetAll from "./TeacherGetAll";

export default function Teachers() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [imageError, setImageError] = React.useState("");
  const fileInputRef = React.useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setFile(file);
      setImageError("");
      formik.setFieldValue("teacher_image", file);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
    formik.setFieldValue("teacher_image", null);
  };

  const initialValues = {
    email: "",
    name: "",
    qualification: "",
    age: "",
    gender: "",
    password: "",
    teacher_image: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: teacherValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!file) {
        setImageError("Teacher image is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("qualification", values.qualification);
      formData.append("password", values.password);
      formData.append("teacher_image", file); // ✅ must match schema

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${baseApi}/manageteacher/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (res.status === 201) {
          toast.success("Teacher Registered Successfully");
          resetForm();
          handleClearFile();
        } else if (res.status === 409) {
          toast.error("Email is already registered");
        } else {
          toast.error("Unexpected error occurred");
        }
      } catch (err) {
        console.error("Register error:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to register teacher");
      }
    },
  });

  return (
    <>
      <h1>Teacher</h1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          maxWidth: "450px",
          margin: "auto",
          mt: 5,
          px: 3,
          py: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="h4" gutterBottom>
          Teacher Registration
        </Typography>

        <Typography>Add Teacher Image</Typography>
        <TextField type="file" inputRef={fileInputRef} onChange={handleImageChange} fullWidth inputProps={{ accept: "image/jpeg,image/png,image/jpg" }} margin="dense" />
        {imageError && <Typography color="error">{imageError}</Typography>}
        {imageUrl && <CardMedia component="img" image={imageUrl} sx={{ height: 150, mt: 1, mb: 2, borderRadius: 1 }} />}
        {formik.touched.teacher_image && formik.errors.teacher_image && <Typography color="error">{formik.errors.teacher_image}</Typography>}

        <TextField name="name" label="Teacher Name" fullWidth value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.name && formik.errors.name && <Typography color="error">{formik.errors.name}</Typography>}

        <TextField name="email" label="Email" fullWidth value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.email && formik.errors.email && <Typography color="error">{formik.errors.email}</Typography>}

        <TextField name="qualification" label="Quallification" fullWidth value={formik.values.qualification} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.name && formik.errors.name && <Typography color="error">{formik.errors.name}</Typography>}

        {/* Age */}
        <TextField name="age" label="Age" fullWidth value={formik.values.age} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.age && formik.errors.age && <Typography color="error">{formik.errors.age}</Typography>}

        {/* Gender */}
        <TextField select name="gender" label="Gender" fullWidth value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense">
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        {formik.touched.gender && formik.errors.gender && <Typography color="error">{formik.errors.gender}</Typography>}

        {/* Password */}
        <TextField name="password" label="Password" type="password" fullWidth value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.password && formik.errors.password && <Typography color="error">{formik.errors.password}</Typography>}

        {/* Submit */}
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Register Teacher
        </Button>
      </Box>
      <Box>
        <TeacherGetAll />
      </Box>
    </>
  );
}
