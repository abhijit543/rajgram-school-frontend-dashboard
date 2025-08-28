import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
import { Box, Typography, CircularProgress, TextField } from "@mui/material";

export default function ScheduleStudent() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${baseApi}/schedule/fetch`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setSchedules(res.data.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Filtered list based on teacher name
  const filteredSchedules = schedules.filter((s) => s.teacher?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>

      <TextField label="Search by Teacher Name" fullWidth sx={{ mb: 3 }} value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <CircularProgress />
      ) : filteredSchedules.length === 0 ? (
        <Typography>No schedules found.</Typography>
      ) : (
        filteredSchedules.map((s) => (
          <Box key={s._id} border={1} borderRadius={2} p={2} mb={2}>
            <Typography>
              <strong>Class:</strong> {s.class?.class_text || s.class?._id || "N/A"}
            </Typography>
            <Typography>
              <strong>Subject:</strong> {s.subject?.subject_name || s.subject?._id || "N/A"}
            </Typography>
            <Typography>
              <strong>Teacher:</strong> {s.teacher?.name || s.teacher?._id || "N/A"}
            </Typography>
            <Typography>
              <strong>Start:</strong> {new Date(s.start_time).toLocaleString()}
            </Typography>
            <Typography>
              <strong>End:</strong> {new Date(s.end_time).toLocaleString()}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
