import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { studentValidationSchema } from "../../../yupSchema/studentSchema";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { baseApi } from "../../../environment";
import { toast } from "react-toastify";
import StudentsGetAll from "./StudentsGetAll";

export default function Student() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [imageError, setImageError] = React.useState("");
  const fileInputRef = React.useRef(null);
  const [classes, setClasses] = React.useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setFile(file);
      setImageError("");
      formik.setFieldValue("student_image", file);
    }
  };
  React.useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseApi}/class/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Assuming the response looks like: { data: [...classArray], success: true }
        setClasses(response.data.data || []);
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };

    fetchClasses();
  }, []);
  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFile(null);
    setImageUrl(null);
    formik.setFieldValue("student_image", null);
  };

  const initialValues = {
    email: "",
    name: "",
    student_class: "",
    age: "",
    gender: "",
    guardian: "",
    guardian_phone: "",
    password: "",
    student_image: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: studentValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!file) {
        setImageError("Student image is required");
        return;
      }

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("student_class", values.student_class);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("guardian", values.guardian);
      formData.append("guardian_phone", values.guardian_phone);
      formData.append("password", values.password);
      formData.append("student_image", values.student_image);

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`${baseApi}/student/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        if (res.status === 201) {
          toast.success("Student Registered Successfully");
          resetForm();
          handleClearFile();
        } else if (res.status === 409) {
          toast.error("Email is already registered");
        } else {
          toast.error("Unexpected error occurred");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to register student");
      }
    },
  });

  return (
    <>
      <h1>Student</h1>
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
          Student Registration
        </Typography>

        <Typography>Add Student Image</Typography>
        <TextField type="file" inputRef={fileInputRef} onChange={handleImageChange} fullWidth inputProps={{ accept: "image/jpeg,image/png,image/jpg" }} margin="dense" />
        {imageError && <Typography color="error">{imageError}</Typography>}
        {imageUrl && <CardMedia component="img" image={imageUrl} sx={{ height: 150, mt: 1, mb: 2, borderRadius: 1 }} />}
        {formik.touched.student_image && formik.errors.student_image && <Typography color="error">{formik.errors.student_image}</Typography>}

        <TextField name="name" label="Student Name" fullWidth value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.name && formik.errors.name && <Typography color="error">{formik.errors.name}</Typography>}

        <TextField name="email" label="Email" fullWidth value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.email && formik.errors.email && <Typography color="error">{formik.errors.email}</Typography>}

        {/* Class */}
        <TextField select name="student_class" label="Class" fullWidth value={formik.values.student_class} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense">
          <MenuItem value="">Select Class</MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls._id} value={cls.class_num}>
              {cls.class_text}
            </MenuItem>
          ))}
        </TextField>
        {formik.touched.student_class && formik.errors.student_class && <Typography color="error">{formik.errors.student_class}</Typography>}

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

        {/* Guardian */}
        <TextField name="guardian" label="Guardian Name" fullWidth value={formik.values.guardian} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.guardian && formik.errors.guardian && <Typography color="error">{formik.errors.guardian}</Typography>}

        {/* Guardian Phone */}
        <TextField name="guardian_phone" label="Guardian Phone" fullWidth value={formik.values.guardian_phone} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.guardian_phone && formik.errors.guardian_phone && <Typography color="error">{formik.errors.guardian_phone}</Typography>}

        {/* Password */}
        <TextField name="password" label="Password" type="password" fullWidth value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} margin="dense" />
        {formik.touched.password && formik.errors.password && <Typography color="error">{formik.errors.password}</Typography>}

        {/* Submit */}
        <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth>
          Register Student
        </Button>
      </Box>
      <Box>
        <StudentsGetAll />
      </Box>
    </>
  );
}
