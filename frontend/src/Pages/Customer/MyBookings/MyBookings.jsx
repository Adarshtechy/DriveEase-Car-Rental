import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiCreditCard,
  FiChevronRight,
  FiXCircle,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Fetch My Bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your bookings.");
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

      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);

      setError(err.response?.data?.message || "Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel Booking along with the Refund
  const handleCancelBooking = async (booking) => {
    const isPaid = booking.payment?.status === "paid";

    const amount = Number(booking.totalAmount || 0).toLocaleString("en-IN");

    const message = isPaid
      ? `Are you sure you want to cancel this booking?\n\n₹${amount} will be refunded to your original payment method.`
      : "Are you sure you want to cancel this booking?";

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    try {
      setCancellingId(booking._id);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to continue.");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_Backend_Url}/api/bookings/${booking._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        if (response.data.refund) {
          alert(
            `Booking cancelled successfully.\n\nRefund initiated: ₹${Number(
              response.data.refund.amount || 0,
            ).toLocaleString("en-IN")}`,
          );
        } else {
          alert(response.data.message || "Booking cancelled successfully.");
        }

        await fetchBookings();
      }
    } catch (err) {
      console.error("Cancel booking error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchBookings();
  }, []);

  // Formate Date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format Currency
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  // Booking Status
  const getStatusClass = (status) => {
    return `status ${status?.toLowerCase() || "pending"}`;
  };

  // Payment Status
  const getPaymentStatusClass = (status) => {
    return `payment-status ${status?.toLowerCase() || "pending"}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="bookings-loading">
          <div className="booking-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="my-bookings-page">
        <div className="bookings-error">
          <div className="error-icon">!</div>

          <h2>Unable to load bookings</h2>

          <p>{error}</p>

          <button onClick={fetchBookings}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-container">
        {/* Header */}
        <div className="bookings-header">
          <div>
            <span className="page-label">DriveEase</span>

            <h1>My Bookings</h1>

            <p>Manage and view all your car rental bookings.</p>
          </div>

          <button className="browse-cars-btn" onClick={() => navigate("/cars")}>
            Browse Cars
          </button>
        </div>

        {/* Booking Count */}
        {bookings.length > 0 && (
          <div className="booking-count">
            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
          </div>
        )}

        {/* No Bookings */}
        {bookings.length === 0 ? (
          <div className="empty-bookings">
            <div className="empty-icon">
              <FaCarSide />
            </div>

            <h2>No bookings yet</h2>

            <p>
              You haven't made any car bookings yet. Find your perfect car and
              start your journey.
            </p>

            <button
              onClick={() => navigate("/cars")}
              className="browse-cars-btn"
            >
              Find a Car
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const isCancelling = cancellingId === booking._id;

              const canCancel =
                booking.status !== "cancelled" &&
                booking.status !== "completed" &&
                booking.status !== "ongoing";

              const isRefunded = booking.payment?.status === "refunded";

              return (
                <div className="booking-item" key={booking._id}>
                  {/* Car Image */}
                  <div className="booking-car-image">
                    {booking.car?.image ? (
                      <img
                        src={booking.car.image}
                        alt={`${booking.car?.brand || ""} ${
                          booking.car?.model || ""
                        }`}
                      />
                    ) : (
                      <div className="no-car-image">
                        <FaCarSide />
                      </div>
                    )}
                  </div>

                  {/* Booking Information */}
                  <div className="booking-info">
                    {/* Title */}
                    <div className="booking-title-row">
                      <div>
                        <h2>
                          {booking.car?.brand || "Car"}{" "}
                          {booking.car?.model || ""}
                        </h2>

                        <p className="car-category">
                          {booking.car?.year || "N/A"} •{" "}
                          {booking.car?.category || "Car"}
                        </p>

                        <span className="booking-id">
                          Booking ID: {booking._id?.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      <span className={getStatusClass(booking.status)}>
                        {booking.status || "pending"}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details">
                      <div className="booking-detail">
                        <FiCalendar />

                        <div>
                          <span>Pickup</span>

                          <strong>{formatDate(booking.pickupDate)}</strong>

                          <small>{booking.pickupLocation || "N/A"}</small>
                        </div>
                      </div>

                      <div className="booking-detail">
                        <FiCalendar />

                        <div>
                          <span>Return</span>

                          <strong>{formatDate(booking.returnDate)}</strong>

                          <small>{booking.returnLocation || "N/A"}</small>
                        </div>
                      </div>

                      <div className="booking-detail">
                        <FiMapPin />

                        <div>
                          <span>Pickup Location</span>

                          <strong>{booking.pickupLocation || "N/A"}</strong>
                        </div>
                      </div>

                      <div className="booking-detail">
                        <FiClock />

                        <div>
                          <span>Duration</span>

                          <strong>
                            {booking.totalDays || 0}{" "}
                            {booking.totalDays === 1 ? "Day" : "Days"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="booking-price-section">
                      <div className="price-heading">
                        <span>Price Breakdown</span>
                      </div>

                      <div className="price-breakdown">
                        <div className="price-row">
                          <span>
                            {formatPrice(booking.pricePerDay)} ×{" "}
                            {booking.totalDays || 0} days
                          </span>

                          <strong>{formatPrice(booking.subtotal)}</strong>
                        </div>

                        <div className="price-row">
                          <span>GST / Taxes</span>

                          <strong>{formatPrice(booking.taxes)}</strong>
                        </div>

                        <div className="price-row total">
                          <span>Total Amount</span>

                          <strong>{formatPrice(booking.totalAmount)}</strong>
                        </div>

                        {/* Refund */}
                        {isRefunded && (
                          <div className="price-row refund-row">
                            <span>Refund Amount</span>

                            <strong>
                              {formatPrice(booking.payment?.refundAmount)}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="booking-footer">
                      <div className="payment-info">
                        <div className="payment-method">
                          <FiCreditCard />

                          <span>
                            {booking.payment?.method === "card"
                              ? "Credit / Debit Card"
                              : booking.payment?.method === "upi"
                                ? "UPI"
                                : "Pay at Pickup"}
                          </span>
                        </div>

                        <span
                          className={getPaymentStatusClass(
                            booking.payment?.status,
                          )}
                        >
                          {booking.payment?.status || "pending"}
                        </span>
                      </div>

                      <div className="booking-actions">
                        {/* Cancel */}
                        {canCancel && (
                          <button
                            className="cancel-booking-btn"
                            onClick={() => handleCancelBooking(booking)}
                            disabled={isCancelling}
                          >
                            <FiXCircle />

                            {isCancelling ? "Cancelling..." : "Cancel"}
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          className="view-booking-btn"
                          onClick={() =>
                            navigate(`/booking-details/${booking._id}`)
                          }
                        >
                          View Details
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>

                    {/* Refund Message */}
                    {isRefunded && (
                      <div className="refund-notice">
                        <strong>Refund initiated</strong>

                        <span>
                          {formatPrice(booking.payment?.refundAmount)} will be
                          refunded to your original payment method.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
