import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Paper, Table, TableBody, TableCell, TableRow, CircularProgress } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";

export default function StudentDetails() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchStudent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${baseApi}/student/fetch-single`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setStudent(res.data.student);
      } else {
        setErrorMsg(res.data.message || "Failed to fetch student.");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      setErrorMsg(error.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!student) {
    return (
      <Typography color="error" align="center" mt={5}>
        {errorMsg || "Failed to load student details."}
      </Typography>
    );
  }

  const imageUrl = student.student_image ? student.student_image : "https://via.placeholder.com/160";

  return (
    <Box p={3}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Student Details
      </Typography>

      <Box display="flex" justifyContent="center" my={3}>
        <Avatar alt={student.name} src={imageUrl} sx={{ width: 160, height: 160, border: "4px solid white", boxShadow: 3 }} />
      </Box>

      <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>{student.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Class</strong>
              </TableCell>
              <TableCell>{student.student_class}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Age</strong>
              </TableCell>
              <TableCell>{student.age}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Gender</strong>
              </TableCell>
              <TableCell>{student.gender}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Guardian</strong>
              </TableCell>
              <TableCell>{student.guardian}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Guardian Phone</strong>
              </TableCell>
              <TableCell>{student.guardian_phone}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
