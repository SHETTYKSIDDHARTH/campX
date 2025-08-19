import { Routes, Route } from "react-router-dom";
import StudentLogin from "../pages/StudentLogin";
import Landingpage from "../pages/Landingpage";
import StudentDashboard from "../pages/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "../pages/AdminLogin";
import ChairmanLogin from "../pages/ChairmanLogin";
import ChairmanDashboard from "../pages/ChairmanDashboard";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
import Allevents from "../pages/Allevents";
import Myevents from "../pages/Myevents";
import UpdateEvent from "../pages/UpdateEvent";
import LostFound from "../pages/LostFound";
import Rides from "../pages/Rides";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/Club-login" element={<ChairmanLogin />} />
      <Route path="/Admin-login" element={<AdminLogin />} />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute roles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chairman-dashboard"
        element={
          <ProtectedRoute roles={["club_chairman"]}>
            <ChairmanDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-event"
        element={
          <ProtectedRoute roles={["student", "club_chairman"]}>
            <Myevents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/Admin-dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/all-events"
        element={
          <ProtectedRoute roles={["student", "club_chairman", "admin"]}>
            <Allevents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/update-event/:id"
        element={
          <ProtectedRoute roles={["club_chairman", "admin"]}>
            <UpdateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/lost-found"
        element={
          <ProtectedRoute roles={["student","admin"]}>
            <LostFound />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rides"
        element={
          <ProtectedRoute roles={["student","admin"]}>
            <Rides />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
