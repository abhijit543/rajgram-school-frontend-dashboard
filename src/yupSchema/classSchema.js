import * as yup from "yup";
export const classSchema = yup.object({
  class_text: yup.string().min(2, "atleast 2 charaters are required").required("It is required field"),
  class_num: yup.string().required("Clas Number is require field"),
});
