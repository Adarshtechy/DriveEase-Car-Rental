import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiLogOut,
  FiHome,
  FiMenu,
  FiLock,
  FiX,
} from "react-icons/fi";
import "./DashboardLayout.css";

const DashboardLayout = () => {
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

 
  // Prevent Body Scroll
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

  
  // Close Sidebar When Resizing
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
    <div className="dashboard-layout">
      {/* Mobile Header */}
      <header className="mobile-dashboard-header">
        <button
          type="button"
          className="mobile-dashboard-menu"
          onClick={() => setMobileSidebar(true)}
          aria-label="Open dashboard menu"
        >
          <FiMenu />
        </button>

        <img
          src="/logo.png"
          alt="DriveEase"
          className="mobile-dashboard-logo"
          onClick={() => navigate("/")}
        />

        <button
          type="button"
          className="mobile-profile-button"
          onClick={() => navigate("/profile")}
          aria-label="Open profile"
        >
          <FiUser />
        </button>
      </header>

      {/* Overlay */}
      {mobileSidebar && (
        <div className="dashboard-sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${
          mobileSidebar ? "dashboard-sidebar-open" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="dashboard-sidebar-header">
          <img
            src="/logo.png"
            alt="DriveEase"
            className="dashboard-logo"
            onClick={() => {
              closeSidebar();
              navigate("/");
            }}
          />

          <button
            type="button"
            className="dashboard-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close dashboard menu"
          >
            <FiX />
          </button>
        </div>

        {/* Navigation */}
        <nav className="dashboard-sidebar-nav">
          <div className="sidebar-section-title">MENU</div>

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiCalendar />
            <span>My Bookings</span>
          </NavLink>

          <NavLink
            to="/payment-history"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiCreditCard />
            <span>Payment History</span>
          </NavLink>

          <div className="sidebar-section-title account-title">ACCOUNT</div>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiUser />
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/change-password"
            className={({ isActive }) =>
              `dashboard-nav-item ${isActive ? "active" : ""}`
            }
            onClick={closeSidebar}
          >
            <FiLock />
            <span>Change Password</span>
          </NavLink>
        </nav>

        {/* Sidebar Bottom */}
        <div className="dashboard-sidebar-bottom">
          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>

          <div className="sidebar-footer">
            <span>DriveEase</span>
            <small>Drive smarter. Travel better.</small>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
