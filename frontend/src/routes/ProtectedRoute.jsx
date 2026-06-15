import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PageLoadingSpinner from "../components/feedback/PageLoadingSpinner";


const ProtectedRoute = ({ children }) => {
  const { user, loading, fetchUser } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      await fetchUser();
      setCheckingAuth(false);
    };

    verifyUser();
  }, [fetchUser]);

  if (loading || checkingAuth) {
    return <PageLoadingSpinner label="Checking permissions..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


export default ProtectedRoute;
