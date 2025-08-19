import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check role if roles are passed
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />; 
  }

  return children;
}
