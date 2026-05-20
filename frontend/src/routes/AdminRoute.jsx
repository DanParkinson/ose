import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import LoadingSpinner from "../components/feedback/LoadingSpinner";


const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking permissions..." />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
