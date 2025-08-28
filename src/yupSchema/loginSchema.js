import * as yup from "yup";
export const loginSchema = yup.object({
  email: yup.string().email("It must be an email").required("It is required field"),
  password: yup.string().min(8, "Password must contain 8 characters.").required("Password is require field"),
});
