/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { baseApi } from "../../../environment";
import { Box, Button, Typography, TextField } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { toast } from "react-toastify";
export default function Dashboard() {
  const [school, setSchool] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const fileInputRef = useRef(null);

  const fetchSchool = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseApi}/school/fetch-single`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        setSchool(resp.data.school);
        setImageUrl(resp.data.school.school_image);
      })
      .catch((e) => {
        console.error("Error fetching school:", e.response?.data || e.message);
      });
  };

  useEffect(() => {
    fetchSchool();
  }, []);

  const addImage = (event) => {
    const selectedFile = event.target.files[0];
    setImageUrl(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFile(null);
    fetchSchool(); // Reset values
  };

  const handleUpdateSchool = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("school_name", school.school_name);
      if (file) {
        formData.append("image", file);
      }

      await axios.patch(`${baseApi}/school/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("School updated successfully!");

      setEditMode(false);
      setFile(null);
      fetchSchool();
    } catch (error) {
      console.error("Error updating school:", error.response?.data || error.message);
      toast.error("Failed to update school.");
    }
  };

  return (
    <>
      <h1>Dashboard</h1>

      {school && (
        <>
          <Box
            sx={{
              position: "relative",
              height: "500px",
              width: "100%",
              background: `url(${imageUrl})`,
              backgroundSize: "cover",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {editMode ? (
              <>
                <TextField variant="outlined" label="School Name" value={school.school_name} onChange={(e) => setSchool({ ...school, school_name: e.target.value })} />
                <input type="file" accept="image/*" ref={fileInputRef} onChange={addImage} />
              </>
            ) : (
              <Typography
                variant="h3"
                sx={{
                  fontSize: "3rem",
                  fontWeight: 700,
                  color: "transparent",
                  background: "linear-gradient(45deg, #00c6ff, #0072ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.4)",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  animation: "fadeIn 2s ease-in-out",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  backdropFilter: "blur(5px)",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                {school.school_name}
              </Typography>
            )}

            {!editMode && (
              <Box
                component={"div"}
                sx={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  height: "60px",
                  width: "60px",
                }}
              >
                <Button
                  onClick={handleEditClick}
                  variant="outlined"
                  sx={{
                    backgroundColor: "#fff",
                    minWidth: 0,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    padding: 0,
                    boxShadow: 1,
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <ModeEditOutlineIcon />
                </Button>
              </Box>
            )}
          </Box>

          {editMode && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Button variant="contained" color="primary" onClick={handleUpdateSchool} sx={{ mr: 2 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
}
