import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>; 
  
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
}
