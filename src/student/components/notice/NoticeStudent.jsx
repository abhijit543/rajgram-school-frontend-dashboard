import { Box, Typography, Card, CardContent, Grid, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";

export default function NoticeStudent() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${baseApi}/notice/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotices(res.data.data);
    } catch (err) {
      console.log(err);

      setError("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        📝 Notices for You
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && notices.length === 0 && <Typography variant="body1">No notices available.</Typography>}

      <Grid container spacing={2}>
        {notices.map((notice) => (
          <Grid item xs={12} sm={6} md={4} key={notice._id}>
            <Card sx={{ height: "100%", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {new Date(notice.date).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {notice.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {notice.message}
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                  <a href={notice.url} target="_blank" rel="noopener noreferrer">
                    {notice.url}
                  </a>
                </Typography>
                <Typography variant="caption" sx={{ color: "white", backgroundColor: "#1976d2", px: 1, py: 0.5, borderRadius: 1 }}>
                  Audience: {notice.audience}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
