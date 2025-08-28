import * as yup from "yup";

export const studentValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  name: yup.string().required("Student name is required"),
  student_class: yup.string().required("Class is required"),
  age: yup.string().matches(/^\d+$/, "Age must be a number").required("Age is required"),
  gender: yup.string().oneOf(["Male", "Female", "Other"], "Invalid gender").required("Gender is required"),
  guardian: yup.string().required("Guardian name is required"),
  guardian_phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Guardian phone is required"),
  student_image: yup
    .mixed()
    .required("Student image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return false;
      const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];
      return supportedFormats.includes(value.type);
    }),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
