import * as React from "react";
import { Box, Card, CardContent, Typography, CardActionArea, CardMedia, Button, Stack, Modal, TextField } from "@mui/material";
import axios from "axios";
import { baseApi } from "../../../environment";
import { toast } from "react-toastify";

function TeacherGetAll() {
  const [teacher, setTeacher] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTeacher, setSelectedTeacher] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const teacherPerPage = 4;

  const fetchTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseApi}/manageteacher/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data);
      if (res.data.success) {
        setTeacher(res.data.teachers || []);
      } else {
        toast.error("Failed to load teacher");
      }
    } catch (error) {
      console.error("Error fetching teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTeacher();
  }, []);
  const filteredTeacher = teacher.filter((teachers) => teachers.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const indexOfLastTeacher = currentPage * teacherPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teacherPerPage;
  const currentTeacher = filteredTeacher.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeacher.length / teacherPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Teacher?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${baseApi}/manageteacher/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Teachers deleted successfully");
        fetchTeacher();
      } else {
        toast.error("Failed to delete Teacher");
      }
    } catch (error) {
      console.error("Error deleting Teacher:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const handleEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseApi}/manageteacher/fetch/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setSelectedTeacher(res.data.teacher);
        setEditModalOpen(true);
      } else {
        alert("Failed to fetch teacher details");
      }
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    if (!selectedTeacher || !selectedTeacher._id) {
      toast.error("Teacher data not loaded properly");
      return;
    }

    const formData = new FormData();
    Object.entries(selectedTeacher).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${baseApi}/manageteacher/update/${selectedTeacher._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Teacher updated successfully");
        setEditModalOpen(false);
        fetchTeacher();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      console.error("Edit submit error:", err);
      toast.error("Error updating Teacher");
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
          <Typography variant="h6">Loading Teacher...</Typography>
        ) : teacher.length === 0 ? (
          <Typography variant="h6">No teacher found</Typography>
        ) : (
          currentTeacher.map((teacher) => (
            <Card key={teacher._id}>
              <CardActionArea>
                <CardMedia component="img" height="180" image={teacher.teacher_image} alt={teacher.name} />
                <CardContent>
                  <Typography variant="h6">{teacher.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {teacher.email} <br />
                    Name:{teacher.name}
                    <br />
                    Age: {teacher.age} <br />
                    Quallification: {teacher.qualification} <br />
                    Gender: {teacher.gender} <br />
                    Phone: {teacher.guardian_phone}
                  </Typography>
                </CardContent>
              </CardActionArea>

              <Box sx={{ p: 1 }}>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button variant="contained" size="small" onClick={() => handleEdit(teacher._id)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(teacher._id)}>
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
              top: "50%",
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
            }}
          >
            <Typography variant="h6">Edit Teacher</Typography>
            <TextField name="name" label="Name" value={selectedTeacher?.name || ""} onChange={handleEditChange} />
            <TextField name="email" label="Email" value={selectedTeacher?.email || ""} onChange={handleEditChange} />

            <TextField name="age" label="Age" value={selectedTeacher?.age || ""} onChange={handleEditChange} />
            <TextField name="gender" label="Gender" value={selectedTeacher?.gender || ""} onChange={handleEditChange} />
            <TextField name="qualification" label="Qualification" value={selectedTeacher?.qualification || ""} onChange={handleEditChange} />

            <TextField name="password" label="Password" type="password" value={selectedTeacher?.password || ""} onChange={handleEditChange} />

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

export default TeacherGetAll;
