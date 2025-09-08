import { useState, useEffect } from "react";
import { Box, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

export default function DonationLeads() {
  const [donations, setDonations] = useState([]);
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

  // Fetch donations if authorized
  useEffect(() => {
    const fetchDonations = async () => {
      if (!isAuthorized) return;

      try {
        const res = await axios.get("https://rajgram-school-react.vercel.app/api/v1/donate/get-donation");

        const formatted = res.data.map((donation, index) => ({
          id: index + 1,
          name: donation.name,
          email: donation.email,
          mobile: donation.mobile,
          amount: donation.amount,
          paymentId: donation.paymentId,
          date: new Date(donation.createdAt).toLocaleString(),
        }));
        setDonations(formatted);
        setFiltered(formatted);
      } catch (error) {
        console.error("Error fetching donations:", error);
        toast.error("Failed to fetch donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [isAuthorized]);

  // Filter on search
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const result = donations.filter((item) => item.name.toLowerCase().includes(lower));
    setFiltered(result);
  }, [searchTerm, donations]);

  const columns = [
    { field: "id", headerName: "Index", width: 70 },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "mobile", headerName: "Mobile", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "paymentId", headerName: "PaymentId", width: 180 },
    { field: "date", headerName: "Date and Time", width: 200 },
  ];

  if (!isAuthorized) {
    return null; // Hide component for unauthorized user
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Donation
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
