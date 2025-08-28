import { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
import { Box, Button, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { toast } from "react-toastify";

export default function ScheduleTeacher() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState(""); // 🔍 search input

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${baseApi}/schedule/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSchedules(res.data.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle update schedule
  const handleUpdate = async () => {
    if (!selected) return;

    const formattedStart = new Date(selected.start_time).toISOString();
    const formattedEnd = new Date(selected.end_time).toISOString();

    try {
      const { _id } = selected;
      await axios.patch(
        `${baseApi}/schedule/update/${_id}`,
        {
          start_time: formattedStart,
          end_time: formattedEnd,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOpen(false);
      fetchSchedules(); // refresh data
      toast.success("Schedule updated successfully");
    } catch (err) {
      console.error("Update failed:", err);

      if (err.response && err.response.status === 403) {
        toast.error("You are not authorized to update this schedule.");
      } else {
        toast.error("Failed to update schedule.");
      }
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
            <Button
              variant="outlined"
              onClick={() => {
                setSelected({
                  _id: s._id,
                  start_time: s.start_time.slice(0, 16),
                  end_time: s.end_time.slice(0, 16),
                });
                setOpen(true);
              }}
              sx={{ mt: 1 }}
            >
              Edit
            </Button>
          </Box>
        ))
      )}

      {/* Edit Dialog */}
      {selected && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogContent>
            <TextField label="Start Time" type="datetime-local" fullWidth value={selected.start_time} onChange={(e) => setSelected({ ...selected, start_time: e.target.value })} sx={{ mt: 2 }} />
            <TextField label="End Time" type="datetime-local" fullWidth value={selected.end_time} onChange={(e) => setSelected({ ...selected, end_time: e.target.value })} sx={{ mt: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
