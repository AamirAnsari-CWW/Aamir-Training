import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

// Guards private routes while AuthProvider checks for an existing session.
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullPage />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
