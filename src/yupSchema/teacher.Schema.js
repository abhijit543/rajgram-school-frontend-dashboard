import * as yup from "yup";

export const teacherValidationSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  name: yup.string().required("Teacher name is required"),
  qualification: yup.string().required("Quallification is required"),
  age: yup.string().matches(/^\d+$/, "Age must be a number").required("Age is required"),
  gender: yup.string().oneOf(["Male", "Female", "Other"], "Invalid gender").required("Gender is required"),

  teacher_image: yup
    .mixed()
    .required("Teacher image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (!value) return false;
      const supportedFormats = ["image/jpeg", "image/png", "image/jpg"];
      return supportedFormats.includes(value.type);
    }),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
