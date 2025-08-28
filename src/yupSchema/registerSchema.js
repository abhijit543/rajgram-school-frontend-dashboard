import * as yup from "yup";
export const registerSchema = yup.object({
  school_name: yup.string().min(8, "School name contatin  8 characters").required("School Name is Required."),
  email: yup.string().email("It must be an email").required("It is required field"),
  owner_name: yup.string().min(8, "It must contain 8 charcters").required("Owner Name is Mandatory Field"),
  password: yup.string().min(8, "Password must contain 8 characters.").required("Password is require field"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "confirm password must match with password")
    .required("Confirm Password is required field"),
});
