import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  console.log("ADMIN TOKEN:", token);
  console.log("ADMIN USER:", userData);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);

  console.log("ADMIN ROLE:", user.role);

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
