import * as React from "react";
import { Box, TextField, Button, Typography, CardMedia } from "@mui/material";
import { useFormik } from "formik";
import { registerSchema } from "../../../yupSchema/registerSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { baseApi } from "../../../environment";

export default function Register() {
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  const [imageError, setImageError] = React.useState("");

  const fileInputRef = React.useRef(null);

  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
    setImageError("");
  };

  const handleClearFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFile(null);
    setImageUrl(null);
  };

  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {
      if (!file) {
        setImageError("School image is required");
        return;
      }

      const fd = new FormData();
      fd.append("image", file, file.name);
      fd.append("school_name", values.school_name);
      fd.append("email", values.email);
      fd.append("owner_name", values.owner_name);
      fd.append("password", values.password);

      axios
        .post(`${baseApi}/school/register`, fd)
        .then((resp) => {
          if (resp.status === 201) {
            toast.success("School Registered Successfully");
          } else if (resp.status === 409) {
            toast.error("Email is already registered");
            console.error(resp.data.error);
          } else {
            toast.error("Unexpected error occurred.");
            console.error(resp.data.error);
          }
        })
        .catch((e) => {
          toast.error("Something went wrong. Try again.");
          console.error(e.response?.data?.error);
        });

      Formik.resetForm();
      handleClearFile();
    },
  });

  return (
    <Box
      sx={{
        backgroundImage: "url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={Formik.handleSubmit}
        sx={{
          width: {
            xs: "100%", // mobile
            sm: "80%",
            md: "60%",
            lg: "40%",
          },
          p: 4,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.95)",
          boxShadow: 6,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" textAlign="center">
          Register
        </Typography>

        <Typography variant="subtitle1">Add School Picture</Typography>
        <TextField type="file" onChange={addImage} inputRef={fileInputRef} fullWidth />
        {imageError && (
          <Typography color="error" variant="caption">
            {imageError}
          </Typography>
        )}
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            alt="Selected School"
            sx={{
              height: 150,
              objectFit: "cover",
              borderRadius: 2,
              my: 1,
            }}
          />
        )}

        <TextField name="school_name" label="School Name" value={Formik.values.school_name} onChange={Formik.handleChange} onBlur={Formik.handleBlur} fullWidth />
        {Formik.touched.school_name && Formik.errors.school_name && (
          <Typography color="error" variant="caption">
            {Formik.errors.school_name}
          </Typography>
        )}

        <TextField name="email" label="Email" type="email" value={Formik.values.email} onChange={Formik.handleChange} onBlur={Formik.handleBlur} fullWidth />
        {Formik.touched.email && Formik.errors.email && (
          <Typography color="error" variant="caption">
            {Formik.errors.email}
          </Typography>
        )}

        <TextField name="owner_name" label="Owner Name" value={Formik.values.owner_name} onChange={Formik.handleChange} onBlur={Formik.handleBlur} fullWidth />
        {Formik.touched.owner_name && Formik.errors.owner_name && (
          <Typography color="error" variant="caption">
            {Formik.errors.owner_name}
          </Typography>
        )}

        <TextField type="password" name="password" label="Password" value={Formik.values.password} onChange={Formik.handleChange} onBlur={Formik.handleBlur} fullWidth />
        {Formik.touched.password && Formik.errors.password && (
          <Typography color="error" variant="caption">
            {Formik.errors.password}
          </Typography>
        )}

        <TextField type="password" name="confirm_password" label="Confirm Password" value={Formik.values.confirm_password} onChange={Formik.handleChange} onBlur={Formik.handleBlur} fullWidth />
        {Formik.touched.confirm_password && Formik.errors.confirm_password && (
          <Typography color="error" variant="caption">
            {Formik.errors.confirm_password}
          </Typography>
        )}

        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
