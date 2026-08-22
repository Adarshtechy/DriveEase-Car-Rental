import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import "./Navbar.css";

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Cars",
    path: "/cars",
  },
  {
    name: "Services",
    path: "/services",
  },
  {
    name: "About Us",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  // Authentication Check
  useEffect(() => {
    const checkAuthentication = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    // Initial check
    checkAuthentication();

    // Listen for login/logout changes
    window.addEventListener("authChanged", checkAuthentication);

    return () => {
      window.removeEventListener("authChanged", checkAuthentication);
    };
  }, []);

  // Navbar Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Disable Body on the Resize
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  // Close Mobile Menu on Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenu(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close Mobile Menu
  const closeMenu = () => {
    setMobileMenu(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update Navbar immediately
    setIsAuthenticated(false);

    // Notify other components
    window.dispatchEvent(new Event("authChanged"));

    closeMenu();

    navigate("/");
  };


  // Auth Navigation
  const handleAuthNavigation = (path) => {
    closeMenu();
    navigate(path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-container navbar-wrapper">
          {/* Logo */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <img src="/logo.png" alt="DriveEase Logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink end={item.path === "/"} to={item.path}>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section */}
          <div className="navbar-right">
            {/* My Bookings */}
            {isAuthenticated && (
              <Link
                to="/my-bookings"
                className="icon-button"
                title="My Bookings"
                aria-label="My Bookings"
              >
                <FaCar />
              </Link>
            )}

            {/* Profile */}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="icon-button"
                title="Profile"
                aria-label="Profile"
              >
                <FiUser />
              </Link>
            )}

            {/* Desktop Authentication */}
            <div className="desktop-auth">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="navbar-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="navbar-login-btn"
                    onClick={() => handleAuthNavigation("/login")}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="navbar-signup-btn"
                    onClick={() => handleAuthNavigation("/register")}
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="navbar-menu-btn"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
              aria-expanded={mobileMenu}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenu && (
        <>
          {/* Overlay */}
          <div className="mobile-overlay" onClick={closeMenu} />

          {/* Sidebar */}
          <aside className="mobile-sidebar">
            {/* Mobile Header */}
            <div className="mobile-top">
              <Link to="/" onClick={closeMenu}>
                <img src="/logo.png" alt="DriveEase" />
              </Link>

              <button type="button" onClick={closeMenu} aria-label="Close menu">
                <FiX />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="mobile-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Authenticated User Links */}
            {isAuthenticated && (
              <div className="mobile-icons">
                {/* My Bookings */}
                <Link to="/my-bookings" onClick={closeMenu}>
                  <FaCar />
                  <span>My Bookings</span>
                </Link>

                {/* Profile */}
                <Link to="/profile" onClick={closeMenu}>
                  <FiUser />
                  <span>Profile</span>
                </Link>
              </div>
            )}

            {/* Mobile Authentication */}
            <div className="mobile-auth">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="navbar-logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="navbar-login-btn"
                    onClick={() => handleAuthNavigation("/login")}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="navbar-signup-btn"
                    onClick={() => handleAuthNavigation("/register")}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
