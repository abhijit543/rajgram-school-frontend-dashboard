import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
import { Box, Typography, CircularProgress, Grid, Card, CardContent } from "@mui/material";

export default function ClassTeacher() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseApi}/class/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClasses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        🏫 Classes
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : classes.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No classes found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {classes.map((cls) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={cls._id}>
              <Card
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 4 },
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {cls.class_text}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {cls.class_num}
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
