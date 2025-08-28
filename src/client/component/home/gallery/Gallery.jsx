import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import Swal from "sweetalert2";

export default function Gallery() {
  const [open, setOpen] = React.useState(false);
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [schools, setSchools] = React.useState([]);
  const handleOpen = (school) => {
    setSelectedSchool(school);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedSchool(null);
  };
  React.useEffect(() => {
    axios
      .get(`http://localhost:5000/api/school/all`)

      .then((resp) => {
        setSchools(resp.data.schools);
      })
      .catch((e) => {
        console.log("Error", e);
        Swal.fire({
          icon: "error",
          title: "Failed to Load Data",
          text: e.response?.data?.error || "Server Error",
        });
      });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          color: "primary.main",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Registered Schools
      </Typography>

      <ImageList variant="masonry" cols={3} gap={20}>
        {schools.map((school) => (
          <ImageListItem
            key={school._id}
            sx={{
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: 6,
              },
            }}
            onClick={() => handleOpen(school)}
          >
            <img src={school.school_image} alt={school.school_name} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
            <ImageListItemBar
              title={school.school_name}
              sx={{
                background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
              }}
              actionIcon={
                <IconButton sx={{ color: "white" }}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 3,
            p: 4,
            outline: "none",
          }}
        >
          {selectedSchool && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
                {selectedSchool.school_name}
              </Typography>
              <img
                src={selectedSchool.school_image}
                alt={selectedSchool.school_name}
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
