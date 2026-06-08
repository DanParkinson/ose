import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PageLoadingSpinner from "../components/feedback/PageLoadingSpinner";

const AdminRoute = ({ children }) => {
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

  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
