import * as React from "react";
import { Box, Card, CardContent, Typography, CardActionArea, CardMedia, Button, Stack, Modal, TextField } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";
import { toast } from "react-toastify";

function StudentsGetAll() {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const studentsPerPage = 4;

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseApi}/student/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStudents(res.data.students || []);
        console.log("Students API response:", res.data);
      } else {
        toast.error("Failed to load students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);
  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${baseApi}/student/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Student deleted successfully");
        fetchStudents();
      } else {
        toast.error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseApi}/student/fetch/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSelectedStudent(res.data.student);
        setEditModalOpen(true);
      } else {
        alert("Failed to fetch student details");
      }
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!selectedStudent || !selectedStudent._id) {
      toast.error("Student data not loaded properly");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${baseApi}/student/update/${selectedStudent._id}`,
        {
          name: selectedStudent.name,
          email: selectedStudent.email,
          student_class: selectedStudent.student_class,
          age: selectedStudent.age,
          gender: selectedStudent.gender,
          guardian: selectedStudent.guardian,
          guardian_phone: selectedStudent.guardian_phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Student updated successfully");
        setEditModalOpen(false);
        fetchStudents();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Edit submit error:", err);
      toast.error("Error updating student");
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, px: 2, mt: 2 }}>
        <TextField
          fullWidth
          label="Search by name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on new search
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
          p: 2,
        }}
      >
        {loading ? (
          <Typography variant="h6">Loading students...</Typography>
        ) : students.length === 0 ? (
          <Typography variant="h6">No students found</Typography>
        ) : (
          currentStudents.map((student) => (
            <Card key={student._id}>
              <CardActionArea>
                <CardMedia component="img" height="180" image={student.student_image} alt={student.name} />

                <CardContent>
                  <Typography variant="h6">{student.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {student.email} <br />
                    Class: {student.student_class} <br />
                    Age: {student.age} <br />
                    Gender: {student.gender} <br />
                    Guardian: {student.guardian} <br />
                    Phone: {student.guardian_phone}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <Box sx={{ p: 1 }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button variant="contained" size="small" onClick={() => handleEdit(student._id)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(student._id)}>
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Card>
          ))
        )}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                Prev
              </Button>
              <Typography sx={{ pt: 1 }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                Next
              </Button>
            </Stack>
          </Box>
        )}

        {/* Modal for Edit */}
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "54%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 2,
              boxShadow: 24,
              minWidth: 300,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <Typography variant="h6">Edit Student</Typography>
            <TextField name="name" label="Name" value={selectedStudent?.name || ""} onChange={handleEditChange} />
            <TextField name="email" label="Email" value={selectedStudent?.email || ""} onChange={handleEditChange} />
            <TextField name="student_class" label="Class" value={selectedStudent?.student_class || ""} onChange={handleEditChange} />
            <TextField name="age" label="Age" value={selectedStudent?.age || ""} onChange={handleEditChange} />
            <TextField name="gender" label="Gender" value={selectedStudent?.gender || ""} onChange={handleEditChange} />
            <TextField name="guardian" label="Guardian" value={selectedStudent?.guardian || ""} onChange={handleEditChange} />
            <TextField name="guardian_phone" label="Phone" value={selectedStudent?.guardian_phone || ""} onChange={handleEditChange} />
            <TextField name="password" label="Password" type="password" value={selectedStudent?.password || ""} onChange={handleEditChange} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="contained" onClick={handleEditSubmit}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </>
  );
}

export default StudentsGetAll;
