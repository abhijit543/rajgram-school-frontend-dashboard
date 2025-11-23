import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const School = lazy(() => import("./school/School"));
const DigitalLeads = lazy(() =>
  import("./school/components/digitalleads/DigitalLeads")
);
const Class = lazy(() => import("./school/components/class/Class"));
const Dashboard = lazy(() =>
  import("./school/components/dashboard/Dashboard")
);
const DonationLeads = lazy(() =>
  import("./school/components/donationleads/DonationLeads")
);
const Notice = lazy(() => import("./school/components/notice/Notice"));
const Schedule = lazy(() =>
  import("./school/components/schedule/Schedule")
);
const Students = lazy(() =>
  import("./school/components/students/Students")
);
const Teachers = lazy(() =>
  import("./school/components/teachers/Teachers")
);
const Subjects = lazy(() =>
  import("./school/components/subjects/Subjects")
);

const Client = lazy(() => import("./client/Client"));
const Home = lazy(() => import("./client/component/home/Home"));
const Login = lazy(() => import("./client/component/login/Login"));
const Register = lazy(() =>
  import("./client/component/register/Register")
);
const LogOut = lazy(() => import("./client/component/logout/LogOut"));

const Student = lazy(() => import("./student/Student"));
const StudentDetails = lazy(() =>
  import("./student/components/student details/StudentDetails")
);
const ScheduleStudent = lazy(() =>
  import("./student/components/schedule/ScheduleStudent")
);
const NoticeStudent = lazy(() =>
  import("./student/components/notice/NoticeStudent")
);

const Teacher = lazy(() => import("./teacher/Teacher"));
const TeacherDetails = lazy(() =>
  import("./teacher/components/teacher details/TeacherDetails")
);
const ScheduleTeacher = lazy(() =>
  import("./teacher/components/schedule/ScheduleTeacher")
);
const SubjectsTeacher = lazy(() =>
  import("./teacher/components/subjects/Subjects")
);
const ClassTeacher = lazy(() =>
  import("./teacher/components/class/Class")
);
const NoticeTeacher = lazy(() =>
  import("./teacher/components/notice/NoticeTeacher")
);

import ProtectedRoute from "./guard/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="loader-center">Loading...</div>}>

            <Routes>
              {/* SCHOOL ROUTES */}
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

              {/* STUDENT ROUTES */}
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

              {/* TEACHER ROUTES */}
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

              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Client />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="logout" element={<LogOut />} />
              </Route>
            </Routes>

          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
