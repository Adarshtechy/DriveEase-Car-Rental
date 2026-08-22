import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // User is not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // User is authenticated
  return <Outlet />;
};

export default ProtectedRoute;
