import * as yup from "yup";

export const noticeSchema = yup.object({
  date: yup.date().typeError("Invalid date format").required("Date is required"),

  title: yup.string().min(2, "At least 2 characters are required").required("Title is a required field"),

  message: yup.string().required("Message is a required field"),

  audience: yup.string().oneOf(["Teacher", "Student", "Website"], "Invalid audience type").required("Audience is required"),
});
