import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCreditCard,
  FiShield,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiPhone,
  FiMail,
  FiFileText,
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import "./BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // ======================================================
  // FETCH BOOKING
  // ======================================================

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view this booking.");
        return;
      }

      if (!id) {
        setError("Booking ID is missing.");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBooking(response.data.booking);
    } catch (err) {
      console.error("Fetch booking error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load booking details. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  // ======================================================
  // CANCEL BOOKING
  // ======================================================

  const handleCancelBooking = async () => {
    if (!booking) return;

    const isPaid = booking.payment?.status === "paid";

    const amount = Number(booking.totalAmount || 0).toLocaleString("en-IN");

    const message = isPaid
      ? `Are you sure you want to cancel this booking?\n\n₹${amount} will be refunded to your original payment method.`
      : "Are you sure you want to cancel this booking?";

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    try {
      setCancelling(true);

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
        alert(response.data.message || "Booking cancelled successfully.");

        await fetchBooking();
      }
    } catch (err) {
      console.error("Cancel booking error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  };

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ======================================================
  // FORMAT TIME
  // ======================================================

  const formatTime = (time) => {
    if (!time) return "N/A";

    // Your schema stores pickupTime/returnTime
    // as strings such as "10:00".
    return time;
  };

  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (status) => {
    return `status-badge ${status?.toLowerCase() || "pending"}`;
  };

  // ======================================================
  // STATUS ICON
  // ======================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
      case "ongoing":
      case "completed":
        return <FiCheckCircle />;

      case "cancelled":
        return <FiXCircle />;

      default:
        return <FiClock />;
    }
  };

  // ======================================================
  // PAYMENT STATUS CLASS
  // ======================================================

  const getPaymentStatusClass = (status) => {
    return `payment-status ${status?.toLowerCase() || "pending"}`;
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="booking-details-status">
        <div className="booking-details-loader"></div>

        <h3>Loading booking details...</h3>

        <p>Please wait while we retrieve your booking.</p>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error || !booking) {
    return (
      <div className="booking-details-status">
        <div className="status-error-icon">
          <FiXCircle />
        </div>

        <h2>Unable to load booking</h2>

        <p>{error || "Booking not found."}</p>

        <button
          className="back-to-bookings-btn"
          onClick={() => navigate("/my-bookings")}
        >
          <FiArrowLeft />
          Back to My Bookings
        </button>
      </div>
    );
  }

  const car = booking.car || {};
  const user = booking.user || {};

  const paymentMethod = booking.payment?.method;

  const paymentStatus = booking.payment?.status;

  const isRefunded = paymentStatus === "refunded";

  const canCancel =
    booking.status !== "cancelled" &&
    booking.status !== "completed" &&
    booking.status !== "ongoing";

  return (
    <div className="booking-details-page">
      <main className="booking-details-container">
        {/* Page Title */}
        <div className="booking-details-title">
          <div>
            <p className="page-label">BOOKING DETAILS</p>

            <h1>
              {car.brand || "Car"} {car.model || ""}
            </h1>

            <p className="booking-id">
              Booking ID: <strong>{booking._id}</strong>
            </p>
          </div>

          <div className={getStatusClass(booking.status)}>
            {getStatusIcon(booking.status)}

            <span>
              {booking.status
                ? booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)
                : "Pending"}
            </span>
          </div>
        </div>

        {/* Car Card */}
        <section className="details-card car-details-card">
          <div className="car-details-image">
            {car.image ? (
              <img
                src={car.image}
                alt={`${car.brand || ""} ${car.model || ""}`}
              />
            ) : (
              <div className="car-image-placeholder">
                <FaCarSide />
              </div>
            )}
          </div>

          <div className="car-details-info">
            <div className="car-details-heading">
              <div>
                <h2>
                  {car.brand || "Car"} {car.model || ""}
                </h2>

                <p>
                  {car.year || "N/A"} • {car.category || "Rental Car"}
                </p>
              </div>

              <div className="car-price">
                {formatPrice(car.pricePerDay)}

                <span>/day</span>
              </div>
            </div>

            <div className="car-specifications">
              <div className="car-specification">
                <span>Transmission</span>
                <strong>{car.transmission || "N/A"}</strong>
              </div>

              <div className="car-specification">
                <span>Fuel Type</span>
                <strong>{car.fuelType || "N/A"}</strong>
              </div>

              <div className="car-specification">
                <span>Seats</span>
                <strong>{car.seats || "N/A"}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Schedule */}
        <section className="details-card">
          <div className="section-heading">
            <div className="section-icon">
              <FiCalendar />
            </div>

            <div>
              <h2>Rental Schedule</h2>

              <p>Your pickup and return information</p>
            </div>
          </div>

          <div className="schedule-container">
            {/* Pickup */}
            <div className="schedule-item">
              <div className="schedule-icon pickup">
                <FiMapPin />
              </div>

              <div className="schedule-content">
                <span className="schedule-label">PICKUP</span>

                <h3>{booking.pickupLocation || "N/A"}</h3>

                <div className="schedule-date">
                  <FiCalendar />

                  <span>{formatDate(booking.pickupDate)}</span>
                </div>

                <div className="schedule-time">
                  <FiClock />

                  <span>{formatTime(booking.pickupTime)}</span>
                </div>
              </div>
            </div>

            <div className="schedule-line"></div>

            {/* Return */}
            <div className="schedule-item">
              <div className="schedule-icon return">
                <FiMapPin />
              </div>

              <div className="schedule-content">
                <span className="schedule-label">RETURN</span>

                <h3>{booking.returnLocation || "N/A"}</h3>

                <div className="schedule-date">
                  <FiCalendar />

                  <span>{formatDate(booking.returnDate)}</span>
                </div>

                <div className="schedule-time">
                  <FiClock />

                  <span>{formatTime(booking.returnTime)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rental-duration">
            <FiClock />

            <span>Rental Duration</span>

            <strong>
              {booking.totalDays || 0}{" "}
              {booking.totalDays === 1 ? "Day" : "Days"}
            </strong>
          </div>
        </section>

        {/* Two Column Section */}
        <div className="details-grid">
          {/* Customer */}
          <section className="details-card">
            <div className="section-heading">
              <div className="section-icon">
                <FiUser />
              </div>

              <div>
                <h2>Customer Information</h2>

                <p>Booking customer details</p>
              </div>
            </div>

            <div className="customer-details">
              <div className="customer-row">
                <div className="customer-icon">
                  <FiUser />
                </div>

                <div>
                  <span>Full Name</span>

                  <strong>{user.fullName || "N/A"}</strong>
                </div>
              </div>

              <div className="customer-row">
                <div className="customer-icon">
                  <FiMail />
                </div>

                <div>
                  <span>Email Address</span>

                  <strong>{user.email || "N/A"}</strong>
                </div>
              </div>

              <div className="customer-row">
                <div className="customer-icon">
                  <FiPhone />
                </div>

                <div>
                  <span>Phone Number</span>

                  <strong>{user.phone || "N/A"}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="details-card">
            <div className="section-heading">
              <div className="section-icon">
                <FiCreditCard />
              </div>

              <div>
                <h2>Payment Information</h2>

                <p>Payment and billing details</p>
              </div>
            </div>

            <div className="payment-information">
              <div className="payment-info-row">
                <span>Payment Method</span>

                <strong>
                  {paymentMethod === "card"
                    ? "Credit / Debit Card"
                    : paymentMethod === "upi"
                      ? "UPI"
                      : "N/A"}
                </strong>
              </div>

              <div className="payment-info-row">
                <span>Payment Status</span>

                <span className={getPaymentStatusClass(paymentStatus)}>
                  {paymentStatus || "Pending"}
                </span>
              </div>

              <div className="payment-info-row">
                <span>Booking Status</span>

                <strong className="booking-status-text">
                  {booking.status || "Pending"}
                </strong>
              </div>

              {/* Refund */}
              {isRefunded && (
                <>
                  <div className="payment-info-row">
                    <span>Refund Amount</span>

                    <strong>
                      {formatPrice(booking.payment?.refundAmount)}
                    </strong>
                  </div>

                  <div className="payment-info-row">
                    <span>Refund Status</span>

                    <span className="payment-status refunded">Refunded</span>
                  </div>

                  {booking.payment?.refundId && (
                    <div className="payment-info-row">
                      <span>Refund ID</span>

                      <strong>{booking.payment.refundId}</strong>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>

        {/* Price Breakdown */}
        <section className="details-card price-details-card">
          <div className="section-heading">
            <div className="section-icon">
              <FiFileText />
            </div>

            <div>
              <h2>Price Breakdown</h2>

              <p>Complete rental cost</p>
            </div>
          </div>

          <div className="price-breakdown-details">
            <div className="price-detail-row">
              <span>
                {formatPrice(booking.pricePerDay)} × {booking.totalDays || 0}{" "}
                days
              </span>

              <strong>{formatPrice(booking.subtotal)}</strong>
            </div>

            <div className="price-detail-row">
              <span>GST / Taxes</span>

              <strong>{formatPrice(booking.taxes)}</strong>
            </div>

            <div className="price-total-row">
              <div>
                <span>Total Amount</span>

                <small>Inclusive of applicable taxes</small>
              </div>

              <strong>{formatPrice(booking.totalAmount)}</strong>
            </div>

            {/* Refund Amount */}
            {isRefunded && (
              <div className="price-detail-row refund-row">
                <span>Refunded Amount</span>

                <strong>{formatPrice(booking.payment?.refundAmount)}</strong>
              </div>
            )}
          </div>
        </section>

        {/* Notes */}
        {booking.notes && (
          <section className="details-card notes-card">
            <div className="section-heading">
              <div className="section-icon">
                <FiFileText />
              </div>

              <div>
                <h2>Booking Notes</h2>
              </div>
            </div>

            <p className="booking-notes">{booking.notes}</p>
          </section>
        )}

        {/* Refund Notice */}
        {isRefunded && (
          <div className="refund-notice">
            <FiCheckCircle />

            <div>
              <strong>Payment refunded</strong>

              <p>
                {formatPrice(booking.payment?.refundAmount)} has been refunded
                to your original payment method.
              </p>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="booking-security">
          <FiShield />

          <div>
            <strong>Your booking is secure</strong>

            <p>
              Your booking information is protected and securely stored by
              DriveEase.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="booking-actions">
          <button
            className="secondary-action"
            onClick={() => navigate("/my-bookings")}
          >
            <FiArrowLeft />
            Back to My Bookings
          </button>

          {/* Cancel */}
          {canCancel && (
            <button
              className="cancel-booking-btn"
              onClick={handleCancelBooking}
              disabled={cancelling}
            >
              <FiXCircle />

              {cancelling ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}

          <button className="primary-action" onClick={() => navigate("/cars")}>
            Browse More Cars
          </button>
        </div>
      </main>
    </div>
  );
};

export default BookingDetails;
