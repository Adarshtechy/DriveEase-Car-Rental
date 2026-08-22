import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Fetch Dashboard Data
  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setDashboard(response.data);
      } else {
        setError(response.data.message || "Failed to load dashboard data.");
      }
    } catch (error) {
      console.error("Dashboard API Error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to access the admin dashboard.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchDashboard();
  }, []);

  // Formate Currency
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Formate Date
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status Class
  const getStatusClass = (status) => {
    return String(status || "pending").toLowerCase();
  };

  // Loading
  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-loading">
          <div className="admin-loading-spinner">
            <FiRefreshCw />
          </div>

          <h3>Loading dashboard</h3>

          <p>Fetching the latest DriveEase data...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-error">
          <div className="admin-error-icon">
            <FiAlertCircle />
          </div>

          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <button
            type="button"
            className="admin-retry-button"
            onClick={() => fetchDashboard()}
          >
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Data
  const stats = dashboard?.stats || {};
  const recentBookings = dashboard?.recentBookings || [];
  const topCars = dashboard?.topCars || [];

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <header className="admin-page-header">
        <div className="admin-header-content">
          <span className="admin-page-label">ADMIN PANEL</span>

          <h1>Dashboard</h1>

          <p>
            Welcome back, Admin. Here's what's happening with DriveEase today.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className={`admin-refresh-button ${refreshing ? "refreshing" : ""}`}
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            title="Refresh dashboard"
          >
            <FiRefreshCw />
          </button>

          <div className="admin-header-date">
            <span>Today</span>

            <strong>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="admin-stats-grid">
        {/* Total Cars */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon cars">
            <FaCar />
          </div>

          <div className="admin-stat-content">
            <span>Total Cars</span>

            <h2>{stats.totalCars || 0}</h2>

            <small>
              <FiActivity />
              Total fleet
            </small>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon bookings">
            <FiCalendar />
          </div>

          <div className="admin-stat-content">
            <span>Total Bookings</span>

            <h2>{stats.totalBookings || 0}</h2>

            <small>
              <FiActivity />
              All bookings
            </small>
          </div>
        </div>

        {/* Total Customers */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon customers">
            <FiUsers />
          </div>

          <div className="admin-stat-content">
            <span>Total Customers</span>

            <h2>{stats.totalCustomers || 0}</h2>

            <small>
              <FiActivity />
              Registered customers
            </small>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-icon revenue">
            <FiTrendingUp />
          </div>

          <div className="admin-stat-content">
            <span>Total Revenue</span>

            <h2>{formatCurrency(stats.totalRevenue)}</h2>

            <small>
              <FiActivity />
              Paid bookings
            </small>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="admin-dashboard-grid">
        {/* Recent Bookings */}
        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <div>
              <span className="admin-card-label">ACTIVITY</span>

              <h3>Recent Bookings</h3>

              <p>Latest customer bookings</p>
            </div>

            <Link to="/admin/bookings" className="admin-view-all">
              View All
              <FiArrowRight />
            </Link>
          </div>

          <div className="admin-booking-list">
            {recentBookings.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">
                  <FiCalendar />
                </div>

                <h4>No bookings found</h4>

                <p>There are no customer bookings yet.</p>
              </div>
            ) : (
              recentBookings.map((booking) => {
                const customerName =
                  booking.user?.fullName || "Unknown Customer";

                const carName = booking.car
                  ? `${booking.car.brand || ""} ${
                      booking.car.model || ""
                    }`.trim()
                  : "Unknown Car";

                const status = getStatusClass(booking.status);

                return (
                  <div className="admin-booking-item" key={booking._id}>
                    {/* CAR */}

                    <div className="admin-booking-main">
                      <div className="admin-booking-car">
                        {booking.car?.image ? (
                          <img src={booking.car.image} alt={carName} />
                        ) : (
                          <FaCar />
                        )}
                      </div>

                      <div className="admin-booking-info">
                        <strong>{carName}</strong>

                        <span>{customerName}</span>
                      </div>
                    </div>

                    {/* Date / Status */}
                    <div className="admin-booking-middle">
                      <span className="admin-booking-date">
                        {formatDate(booking.createdAt)}
                      </span>

                      <span className={`admin-booking-status ${status}`}>
                        {booking.status || "Pending"}
                      </span>
                    </div>

                    {/* Amount */}
                    <strong className="admin-booking-amount">
                      {formatCurrency(booking.totalAmount)}
                    </strong>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Cars */}
        <div className="admin-dashboard-card">
          <div className="admin-card-header">
            <div>
              <span className="admin-card-label">PERFORMANCE</span>

              <h3>Top Cars</h3>

              <p>Most booked vehicles</p>
            </div>

            <Link to="/admin/cars" className="admin-view-all">
              View All
              <FiArrowRight />
            </Link>
          </div>

          <div className="admin-top-cars">
            {topCars.length === 0 ? (
              <div className="admin-empty-state">
                <div className="admin-empty-icon">
                  <FaCar />
                </div>

                <h4>No car data available</h4>

                <p>Booking data will appear here.</p>
              </div>
            ) : (
              topCars.map((car, index) => (
                <div className="admin-top-car" key={car.id || car._id || index}>
                  <div className="admin-car-rank">{index + 1}</div>

                  <div className="admin-car-details">
                    <strong>{car.name || "Unknown Car"}</strong>

                    <span>
                      {car.bookings || 0}{" "}
                      {car.bookings === 1 ? "booking" : "bookings"}
                    </span>
                  </div>

                  <strong className="admin-car-revenue">
                    {formatCurrency(car.revenue)}
                  </strong>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
