import * as yup from "yup";
export const subjectSchema = yup.object({
  subject_name: yup.string().min(2, "atleast 2 charaters are required").required("It is required field"),
  subject_codename: yup.string().required("Subject Code is require field"),
});
