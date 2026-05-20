import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import LoadingSpinner from "../components/feedback/LoadingSpinner";


const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking permissions..." />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
