import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Paper, Table, TableBody, TableCell, TableRow, CircularProgress } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";

export default function TeacherDetails() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMsg("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${baseApi}/manageteacher/fetch-single`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setTeacher(res.data.teacher);
      } else {
        setErrorMsg(res.data.message || "Failed to fetch teacher.");
      }
    } catch (error) {
      console.error("Error fetching teacher:", error);
      setErrorMsg(error.response?.data?.message || "Server error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!teacher) {
    return (
      <Typography color="error" align="center" mt={5}>
        {errorMsg || "Failed to load teacher details."}
      </Typography>
    );
  }

  const imageUrl = teacher.teacher_image ? teacher.teacher_image : "https://via.placeholder.com/160";

  return (
    <Box p={3}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Teacher Details
      </Typography>

      <Box display="flex" justifyContent="center" my={3}>
        <Avatar alt={teacher.name} src={imageUrl} sx={{ width: 160, height: 160, border: "4px solid white", boxShadow: 3 }} />
      </Box>

      <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>{teacher.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>{teacher.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Age</strong>
              </TableCell>
              <TableCell>{teacher.age}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Gender</strong>
              </TableCell>
              <TableCell>{teacher.gender}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Qualification</strong>
              </TableCell>
              <TableCell>{teacher.qualification}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
