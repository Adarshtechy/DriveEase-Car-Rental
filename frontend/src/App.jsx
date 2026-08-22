import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/Home/Home";
import Cars from "./Pages/Cars/Cars";
import CarDetails from "./Pages/CarDetails/CarDetails";
import Services from "./Pages/Services/Services";
import About from "./Pages/About/About";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";

import Dashboard from "./pages/Customer/Dashboard/Dashboard";
import Profile from "./pages/Customer/Profile/Profile";
import MyBookings from "./Pages/Customer/MyBookings/MyBookings";
import PaymentHistory from "./Pages/Customer/PaymentHistory/PaymentHistory";
import ChangePassword from "./Pages/Customer/ChangePassword/ChangePassword";
import Booking from "./Pages/Booking/Booking";
import BookingDetails from "./pages/BookingDetails/BookingDetails";

import AdminDashboardLayout from "./components/AdminDashboardLayout/AdminDashboardLayout";

import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminCars from "./pages/Admin/AdminCars/AdminCars";
import AdminBookings from "./pages/Admin/AdminBookings/AdminBookings";
import AdminCustomers from "./pages/Admin/AdminCustomers/AdminCustomers";
import AdminPayments from "./pages/Admin/AdminPayments/AdminPayments";

const App = () => {
  const location = useLocation();

  const hideNavbar =
    [
      "/login",
      "/register",
      "/profile",
      "/dashboard",
      "/my-bookings",
      "/payment-history",
      "/change-password",
    ].includes(location.pathname) || location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Customer */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>

          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/booking-details/:id" element={<BookingDetails />} />
        </Route>

        {/* Admin */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/cars" element={<AdminCars />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
          </Route>
        </Route>
      </Routes>

      {!hideNavbar && <Footer />}
    </>
  );
};

export default App;
