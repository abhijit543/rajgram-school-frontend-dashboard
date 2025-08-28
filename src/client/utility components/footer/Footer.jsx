import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} component={"div"}>
        <Typography variant="h5">School Management System</Typography>
        <Typography variant="p">Copyright@2025</Typography>
      </Box>
    </>
  );
}
