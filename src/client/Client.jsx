import { Outlet } from "react-router-dom";
import Navbar from "./utility components/navbar/Navbar";
import Footer from "./utility components/footer/Footer";
import Box from "@mui/material/Box";

export default function Client() {
  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: "80vh" }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
