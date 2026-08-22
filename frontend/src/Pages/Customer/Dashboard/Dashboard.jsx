import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiArrowRight,
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your dashboard.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Dashboard bookings:", response.data);

      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Dashboard booking error:", err);
      console.error("Backend response:", err.response?.data);

      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Get total bookings
  const totalBookings = bookings.length;

  // Get upcoming trips
  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.pickupDate) return false;

    const pickupDate = new Date(booking.pickupDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);

    const status = booking.status?.toLowerCase();

    return (
      pickupDate >= today && status !== "cancelled" && status !== "completed"
    );
  });

  const upcomingTrips = upcomingBookings.length;

  // Calculate total payments
  const totalPayments = bookings.reduce((total, booking) => {
    return total + Number(booking.totalAmount || 0);
  }, 0);

  // Get most recent booking
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.pickupDate || 0);
    const dateB = new Date(b.createdAt || b.pickupDate || 0);

    return dateB - dateA;
  });

  const recentBooking = sortedBookings[0];

  // Status class
  const getStatusClass = (status) => {
    return `dashboard-booking-status ${status
      ?.toLowerCase()
      ?.replace(/\s+/g, "-")}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <section className="dashboard-page-header">
        <div>
          <span className="dashboard-label">DASHBOARD</span>

          <h1>Welcome back!</h1>

          <p>Manage your bookings and account from one place.</p>
        </div>

        <Link to="/cars" className="dashboard-book-btn">
          <FiSearch />
          Find a Car
        </Link>
      </section>

      {/* Error */}
      {error && (
        <div className="dashboard-error">
          <FiAlertCircle />

          <div>
            <strong>Unable to load booking information</strong>
            <p>{error}</p>
          </div>

          <button onClick={fetchBookings}>Retry</button>
        </div>
      )}

      {/* Stats */}
      <section className="dashboard-stats">
        {/* Total Bookings */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon orange">
            <FiCalendar />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Bookings</span>

            <h2>{totalBookings}</h2>

            <small>All your bookings</small>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon blue">
            <FiClock />
          </div>

          <div className="dashboard-stat-content">
            <span>Upcoming Trips</span>

            <h2>{upcomingTrips}</h2>

            <small>Scheduled bookings</small>
          </div>
        </div>

        {/* Total Payments */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon green">
            <FiCreditCard />
          </div>

          <div className="dashboard-stat-content">
            <span>Total Payments</span>

            <h2>{formatCurrency(totalPayments)}</h2>

            <small>Total booking amount</small>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="dashboard-content-grid">
        {/* Recent Booking */}
        <div className="dashboard-card recent-booking-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Recent Booking</h2>

              <p>Your latest car rental activity</p>
            </div>

            <Link to="/my-bookings">
              View All
              <FiArrowRight />
            </Link>
          </div>

          {recentBooking ? (
            <div className="dashboard-recent-booking">
              {/* Car */}
              <div className="recent-booking-top">
                <div className="recent-car-image">
                  {recentBooking.car?.image ? (
                    <img
                      src={recentBooking.car.image}
                      alt={`${recentBooking.car?.brand || ""} ${
                        recentBooking.car?.model || ""
                      }`}
                    />
                  ) : (
                    <div className="recent-no-image">🚗</div>
                  )}
                </div>

                <div className="recent-car-info">
                  <div className="recent-car-title-row">
                    <div>
                      <h3>
                        {recentBooking.car?.brand || "Car"}{" "}
                        {recentBooking.car?.model || ""}
                      </h3>

                      <p>
                        {recentBooking.car?.year || ""}{" "}
                        {recentBooking.car?.category
                          ? `• ${recentBooking.car.category}`
                          : ""}
                      </p>
                    </div>

                    <span className={getStatusClass(recentBooking.status)}>
                      {recentBooking.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="recent-booking-details">
                <div className="recent-detail">
                  <FiCalendar />

                  <div>
                    <span>Pickup</span>
                    <strong>{formatDate(recentBooking.pickupDate)}</strong>
                  </div>
                </div>

                <div className="recent-detail">
                  <FiCalendar />

                  <div>
                    <span>Return</span>
                    <strong>{formatDate(recentBooking.returnDate)}</strong>
                  </div>
                </div>

                <div className="recent-detail">
                  <FiMapPin />

                  <div>
                    <span>Location</span>
                    <strong>{recentBooking.pickupLocation || "N/A"}</strong>
                  </div>
                </div>

                <div className="recent-detail">
                  <FiClock />

                  <div>
                    <span>Duration</span>
                    <strong>
                      {recentBooking.totalDays || 0}{" "}
                      {recentBooking.totalDays === 1 ? "Day" : "Days"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="recent-booking-footer">
                <div>
                  <span>Total Amount</span>

                  <strong>{formatCurrency(recentBooking.totalAmount)}</strong>
                </div>

                <Link
                  to={`/booking-details/${recentBooking._id}`}
                  className="recent-view-btn"
                >
                  View Details
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">
                <FiCalendar />
              </div>

              <h3>No bookings yet</h3>

              <p>Your recent bookings will appear here.</p>

              <Link to="/cars" className="dashboard-outline-btn">
                Browse Cars
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Quick Actions</h2>

              <p>Frequently used options</p>
            </div>
          </div>

          <div className="dashboard-quick-actions">
            <Link to="/cars" className="dashboard-action">
              <div className="action-icon orange">
                <FiSearch />
              </div>

              <div>
                <h3>Browse Cars</h3>
                <p>Find your next ride</p>
              </div>

              <FiArrowRight className="action-arrow" />
            </Link>

            <Link to="/my-bookings" className="dashboard-action">
              <div className="action-icon blue">
                <FiCalendar />
              </div>

              <div>
                <h3>My Bookings</h3>
                <p>
                  {totalBookings > 0
                    ? `${totalBookings} ${
                        totalBookings === 1 ? "booking" : "bookings"
                      }`
                    : "Manage your reservations"}
                </p>
              </div>

              <FiArrowRight className="action-arrow" />
            </Link>

            <Link to="/profile" className="dashboard-action">
              <div className="action-icon purple">
                <FiUser />
              </div>

              <div>
                <h3>My Profile</h3>
                <p>Update account details</p>
              </div>

              <FiArrowRight className="action-arrow" />
            </Link>

            <Link to="/payment-history" className="dashboard-action">
              <div className="action-icon green">
                <FiCreditCard />
              </div>

              <div>
                <h3>Payment History</h3>
                <p>{formatCurrency(totalPayments)} spent</p>
              </div>

              <FiArrowRight className="action-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="dashboard-getting-started">
        <div className="getting-started-icon">
          <FiCheckCircle />
        </div>

        <div className="getting-started-content">
          <span>GETTING STARTED</span>

          <h2>
            {upcomingTrips > 0
              ? "Your next journey is waiting!"
              : "Ready for your next journey?"}
          </h2>

          <p>
            {upcomingTrips > 0
              ? `You have ${upcomingTrips} upcoming ${
                  upcomingTrips === 1 ? "trip" : "trips"
                }.`
              : "Choose a car, select your dates and start your journey with DriveEase."}
          </p>
        </div>

        <Link
          to={upcomingTrips > 0 ? "/my-bookings" : "/cars"}
          className="getting-started-btn"
        >
          {upcomingTrips > 0 ? "View Trips" : "Explore Cars"}

          <FiArrowRight />
        </Link>
      </section>

      {/* Helpful Information */}
      <section className="dashboard-info-grid">
        <div className="dashboard-info-item">
          <div className="info-item-icon">
            <FiMapPin />
          </div>

          <div>
            <h3>Flexible Locations</h3>

            <p>Pick up and drop off at convenient locations.</p>
          </div>
        </div>

        <div className="dashboard-info-item">
          <div className="info-item-icon">
            <FiCheckCircle />
          </div>

          <div>
            <h3>Easy Booking</h3>

            <p>Book your preferred car in just a few steps.</p>
          </div>
        </div>

        <div className="dashboard-info-item">
          <div className="info-item-icon">
            <FiClock />
          </div>

          <div>
            <h3>24/7 Support</h3>

            <p>We're here whenever you need assistance.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
