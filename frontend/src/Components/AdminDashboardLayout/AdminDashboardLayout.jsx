import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiCreditCard,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

import "./AdminDashboardLayout.css";

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileSidebar(false);

    navigate("/");
  };

  // Close Sidebar
  const closeSidebar = () => {
    setMobileSidebar(false);
  };

  // prevent Body Scroll
  useEffect(() => {
    if (mobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebar]);

  // Clsode Sidebar on Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="admin-dashboard-layout">
      {/*Mobile Header */}
      <header className="admin-mobile-header">
        <button
          className="admin-mobile-menu"
          onClick={() => setMobileSidebar(true)}
        >
          <FiMenu />
        </button>

        <img
          src="/logo.png"
          alt="DriveEase"
          className="admin-mobile-logo"
          onClick={() => navigate("/")}
        />

        <button
          className="admin-mobile-profile"
          onClick={() => navigate("/admin/dashboard")}
        >
          <FiUser />
        </button>
      </header>

      {/* Overlay */}
      {mobileSidebar && (
        <div className="admin-sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileSidebar ? "admin-sidebar-open" : ""}`}
      >
        {/* Sidebar Header */}
        <div className="admin-sidebar-header">
          <img
            src="/logo.png"
            alt="DriveEase"
            className="admin-sidebar-logo"
            onClick={() => {
              closeSidebar();
              navigate("/");
            }}
          />

          <button className="admin-sidebar-close" onClick={closeSidebar}>
            <FiX />
          </button>
        </div>

        {/* Admin Info */}
        <div className="admin-user-box">
          <div className="admin-user-avatar">A</div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar-nav">
          <div className="admin-section-title">MAIN MENU</div>

          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/cars"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FaCar />
            <span>Cars</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiCalendar />
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiUsers />
            <span>Customers</span>
          </NavLink>

          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiCreditCard />
            <span>Payments</span>
          </NavLink>
        </nav>

        {/* Sidebar Bottom */}
        <div className="admin-sidebar-bottom">
          <button className="admin-logout" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>

          <div className="admin-sidebar-footer">
            <strong>DriveEase</strong>
            <span>Admin Management System</span>
          </div>
        </div>
      </aside>

      {/* Right Side Content */}
      <main className="admin-dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
