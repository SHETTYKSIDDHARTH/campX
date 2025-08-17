import { Routes, Route } from "react-router-dom";
import StudentLogin from '../pages/StudentLogin';
import Landingpage from '../pages/Landingpage';
import StudentDashboard from "../pages/StudentDashboard";
import ProtectedRoute from './ProtectedRoute'
import AdminLogin from '../pages/AdminLogin'
import ChairmanLogin from '../pages/ChairmanLogin'
import ChairmanDashboard from '../pages/ChairmanDashboard';
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/AdminDashboard";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/Club-login" element={<ChairmanLogin />} />
      <Route path="/Admin-login" element={<AdminLogin />} />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
      path="/chairman-dashboard"
      element={
        <ProtectedRoute>
          <ChairmanDashboard/>
        </ProtectedRoute>
      }
      />

      <Route
      path="/Admin-dashboard"
      element={
        <ProtectedRoute>
          <AdminDashboard/>
        </ProtectedRoute>
      }
      />
    </Routes>
  );
}
