import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiEye,
  FiAlertCircle,
  FiRefreshCw,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get Bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authenticated. Please login again.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        setError(response.data.message || "Unable to load bookings.");
      }
    } catch (error) {
      console.error("Admin Bookings API Error:", error);

      if (error.response) {
        setError(error.response.data?.message || "Unable to load bookings.");
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      } else {
        setError("Something went wrong while loading bookings.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch on Page Load
  useEffect(() => {
    fetchBookings();
  }, []);

  // Search along with Filter
  const filteredBookings = bookings.filter((booking) => {
    const customerName = booking.customer?.fullName?.toLowerCase() || "";

    const customerEmail = booking.customer?.email?.toLowerCase() || "";

    const carName = booking.car?.name?.toLowerCase() || "";

    const bookingId = booking.bookingId?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    const matchesSearch =
      customerName.includes(searchValue) ||
      customerEmail.includes(searchValue) ||
      carName.includes(searchValue) ||
      bookingId.includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Date Format
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status Format
  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Loading
  if (loading) {
    return (
      <div className="admin-bookings-page">
        <div className="admin-bookings-header">
          <div>
            <h1>Bookings</h1>
            <p>Manage customer vehicle bookings</p>
          </div>
        </div>

        <div className="admin-bookings-loading">
          <div className="admin-loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="admin-bookings-page">
        <div className="admin-bookings-header">
          <div>
            <h1>Bookings</h1>
            <p>Manage customer vehicle bookings</p>
          </div>
        </div>

        <div className="admin-bookings-error">
          <div className="admin-error-icon">
            <FiAlertCircle />
          </div>

          <h2>Unable to load bookings</h2>

          <p>{error}</p>

          <button className="admin-retry-btn" onClick={fetchBookings}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-bookings-page">
      {/* Header */}
      <div className="admin-bookings-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage customer vehicle bookings</p>
        </div>

        <div className="admin-bookings-count">
          <FiCalendar />
          <span>
            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="admin-bookings-card">
        {/* Tool Bar */}
        <div className="admin-bookings-toolbar">
          <div className="admin-booking-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search booking, customer or car..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            className="admin-refresh-btn"
            onClick={fetchBookings}
            title="Refresh bookings"
          >
            <FiRefreshCw />
          </button>
        </div>

        {/* Results */}
        <div className="admin-bookings-results">
          Showing <strong>{filteredBookings.length}</strong> of{" "}
          <strong>{bookings.length}</strong> bookings
        </div>

        {/* Table */}
        <div className="admin-bookings-table-wrapper">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Pickup Date</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    {/* Booking ID */}
                    <td>
                      <strong className="admin-booking-id">
                        {booking.bookingId}
                      </strong>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="admin-booking-customer">
                        <div className="admin-customer-icon">
                          <FiUser />
                        </div>

                        <div>
                          <strong>
                            {booking.customer?.fullName || "Unknown Customer"}
                          </strong>

                          <span>{booking.customer?.email || "No email"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Car */}
                    <td>
                      <div className="admin-booking-car-info">
                        <div className="admin-booking-car-image">
                          {booking.car?.image ? (
                            <img
                              src={booking.car.image}
                              alt={booking.car.name}
                            />
                          ) : (
                            <FaCar />
                          )}
                        </div>

                        <strong>{booking.car?.name || "Unknown Car"}</strong>
                      </div>
                    </td>

                    {/* Pickup Date */}
                    <td>
                      <div className="admin-date-info">
                        <strong>{formatDate(booking.pickupDate)}</strong>

                        <span>{booking.pickupTime || "N/A"}</span>
                      </div>
                    </td>

                    {/* Days */}
                    <td>
                      <span className="admin-days">
                        {booking.totalDays}{" "}
                        {booking.totalDays === 1 ? "day" : "days"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td>
                      <strong className="admin-booking-amount">
                        ₹
                        {Number(booking.totalAmount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </strong>
                    </td>

                    {/* Payment */}
                    <td>
                      <span
                        className={`admin-payment-badge ${
                          booking.payment?.status || "pending"
                        }`}
                      >
                        {formatStatus(booking.payment?.status || "pending")}
                      </span>
                    </td>

                    {/* Booking Status */}
                    <td>
                      <span
                        className={`admin-booking-badge ${
                          booking.status || "pending"
                        }`}
                      >
                        {formatStatus(booking.status || "pending")}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      <button
                        className="admin-view-booking"
                        title="View booking"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="admin-no-bookings">
                    <FiSearch />

                    <strong>No bookings found</strong>

                    <span>Try changing your search or status filter.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
