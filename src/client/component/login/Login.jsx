import Box from "@mui/material/Box";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { loginSchema } from "../../../yupSchema/loginSchema";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { baseApi } from "../../../environment";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from "react-toastify";

export default function Login() {
  const [role, setRole] = React.useState("student");
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      let URL;
      if (role === "student") {
        URL = `${baseApi}/student/login`;
      } else if (role === "teacher") {
        URL = `${baseApi}/manageteacher/login`;
      } else if (role === "school") {
        URL = `${baseApi}/school/login`;
      }

      axios
        .post(URL, { ...values })
        .then((resp) => {
          const token = resp.headers.get("Authorization");
          if (token) {
            localStorage.setItem("token", token);
          }
          const user = resp.data.user;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            login(user);
          }
          if (resp.status === 200) {
            toast.success("Successfully login");
            if (role === "student") {
              navigate("/student");
            } else if (role === "teacher") {
              navigate("/teacher");
            } else if (role === "school") {
              navigate("/school");
            }
          }
        })
        .catch((e) => {
          const status = e.response?.status;
          const errorMsg = e.response?.data?.error || "Something went wrong. Try again.";
          if (status === 401) {
            toast.error("Unauthorized");
          } else {
            console.log(errorMsg);
            toast.error("Server Error");
          }
        });

      Formik.resetForm();
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
        flexDirection: "column",
        p: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.5)",
          px: 3,
          py: 1,
          borderRadius: 2,
        }}
      >
        Login
      </Typography>

      <Box
        component="form"
        onSubmit={Formik.handleSubmit}
        sx={{
          width: {
            xs: "100%", // full width on mobile
            sm: "80%",
            md: "50%",
            lg: "35%",
          },
          p: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select labelId="role-select-label" id="role-select" label="Role" value={role} onChange={(e) => setRole(e.target.value)}>
            <MenuItem value={"student"}>Student</MenuItem>
            <MenuItem value={"teacher"}>Teacher</MenuItem>
            <MenuItem value={"school"}>School</MenuItem>
          </Select>
        </FormControl>

        <TextField name="email" label="Email" value={Formik.values.email} onChange={Formik.handleChange} onBlur={Formik.handleBlur} autoComplete="email" fullWidth />
        {Formik.touched.email && Formik.errors.email && (
          <Typography color="error" variant="caption">
            {Formik.errors.email}
          </Typography>
        )}

        <TextField type="password" name="password" label="Password" value={Formik.values.password} onChange={Formik.handleChange} onBlur={Formik.handleBlur} autoComplete="new-password" fullWidth />
        {Formik.touched.password && Formik.errors.password && (
          <Typography color="error" variant="caption">
            {Formik.errors.password}
          </Typography>
        )}

        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
