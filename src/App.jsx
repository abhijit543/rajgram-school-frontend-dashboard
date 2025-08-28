import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import School from "./school/School";
import DigitalLeads from "./school/components/digitalleads/DigitalLeads";
import Class from "./school/components/class/Class";
import Dashboard from "./school/components/dashboard/Dashboard";
import DonationLeads from "./school/components/donationleads/DonationLeads";
import Notice from "./school/components/notice/Notice";
import Schedule from "./school/components/schedule/Schedule";
import Students from "./school/components/students/Students";
import Teachers from "./school/components/teachers/Teachers";
import Subjects from "./school/components/subjects/Subjects";
import Client from "./client/Client";
import Home from "./client/component/home/Home";
import Login from "./client/component/login/Login";
import Register from "./client/component/register/Register";
// import Student from "./student/Student";
import Teacher from "./teacher/Teacher";
import TeacherDetails from "./teacher/components/teacher details/TeacherDetails";
import ScheduleTeacher from "./teacher/components/schedule/ScheduleTeacher";
import SubjectsTeacher from "./teacher/components/subjects/Subjects";
import ClassTeacher from "./teacher/components/class/Class";
import NoticeTeacher from "./teacher/components/notice/NoticeTeacher";

import Student from "./student/Student";
import StudentDetails from "./student/components/student details/StudentDetails";
import ScheduleStudent from "./student/components/schedule/ScheduleStudent";
import NoticeStudent from "./student/components/notice/NoticeStudent";

import ProtectedRoute from "./guard/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogOut from "./client/component/logout/LogOut";
// import Client from "./client/Client";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="school"
              element={
                <ProtectedRoute allowedRoles={["SCHOOL"]}>
                  <School />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="class" element={<Class />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="digitalleads" element={<DigitalLeads />} />
              <Route path="donation" element={<DonationLeads />} />
              <Route path="notice" element={<Notice />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="students" element={<Students />} />
              <Route path="teachers" element={<Teachers />} />
            </Route>
            <Route
              path="student"
              element={
                <ProtectedRoute allowedRoles={["STUDENT"]}>
                  <Student />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentDetails />} />
              <Route path="schedule" element={<ScheduleStudent />} />

              <Route path="notice" element={<NoticeStudent />} />
            </Route>
            <Route
              path="teacher"
              element={
                <ProtectedRoute allowedRoles={["TEACHER"]}>
                  <Teacher />
                </ProtectedRoute>
              }
            >
              <Route index element={<TeacherDetails />} />
              <Route path="schedule" element={<ScheduleTeacher />} />
              <Route path="subjects" element={<SubjectsTeacher />} />
              <Route path="class" element={<ClassTeacher />} />
              <Route path="notice" element={<NoticeTeacher />} />
            </Route>
            <Route path="/" element={<Client />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<LogOut />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
