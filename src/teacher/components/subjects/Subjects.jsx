import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
import { Box, Typography, CircularProgress, Grid, Card, CardContent } from "@mui/material";

export default function SubjectsTeacher() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${baseApi}/subject/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        📘 Subjects
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : subjects.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No subjects found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {subjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={subject._id}>
              <Card
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {subject.subject_name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
