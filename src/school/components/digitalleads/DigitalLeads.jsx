import { useState, useEffect } from "react";
import { Box, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

export default function DigitalLeads() {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (userId === "68beb423eb092af8a962b6be") {
      setIsAuthorized(true);
    } else {
      toast.error("You are not authorized to view this page.");
      setIsAuthorized(false);
    }
  }, []);

  // Fetch contacts if authorized
  useEffect(() => {
    const fetchContacts = async () => {
      if (!isAuthorized) return;

      try {
        const res = await axios.get("https://rajgram-school-react.vercel.app/api/v1/contact");

        const formatted = res.data.data.map((contact, index) => ({
          id: index + 1,
          name: contact.from_name,
          email: contact.from_email,
          mobile: contact.from_mobile,
          purpose: contact.message_type,
          date: new Date(contact.date).toLocaleString(),
        }));
        setContacts(formatted);
        setFiltered(formatted);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [isAuthorized]);

  // Filter on search
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const result = contacts.filter((item) => item.name.toLowerCase().includes(lower));
    setFiltered(result);
  }, [searchTerm, contacts]);

  const columns = [
    { field: "id", headerName: "Index", width: 100 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "mobile", headerName: "Mobile", width: 150 },
    { field: "purpose", headerName: "Purpose", width: 150 },
    { field: "date", headerName: "Date and Time", width: 200 },
  ];

  if (!isAuthorized) {
    return null; // Hide component for unauthorized user
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Digital Leads
      </Typography>

      <TextField label="Search by Name" variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3 }} />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3}>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid rows={filtered} columns={columns} pageSize={7} rowsPerPageOptions={[5, 10, 20]} sortingOrder={["asc", "desc"]} />
          </div>
        </Paper>
      )}
    </Box>
  );
}
