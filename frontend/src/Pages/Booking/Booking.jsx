import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiShield,
  FiUser,
  FiPhoneCall,
} from "react-icons/fi";

import { MdOutlineSecurity, MdVerified } from "react-icons/md";
import { GiReturnArrow } from "react-icons/gi";

import "./Booking.css";

const Booking = () => {
  const { id: carId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDates = location.state || {};
  const [car, setCar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    pickupLocation: "",
    pickupDate: selectedDates.pickupDate || "",
    pickupTime: "10:00",
    returnLocation: "",
    returnDate: selectedDates.returnDate || "",
    returnTime: "10:00",
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    address: "",
    paymentMethod: "card",
  });

  // Load Car + Profile
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to continue with your booking.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [carResponse, profileResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_Backend_Url}/api/cars/${carId}`),

          axios.get(`${import.meta.env.VITE_Backend_Url}/api/profile`, config),
        ]);

        // Car
        const carData = carResponse.data.car || carResponse.data;

        setCar(carData);

        // Profile
        const profileData = profileResponse.data.profile;

        setProfile(profileData);

        const user = profileData?.user || {};
        const address = profileData?.address || {};
        const license = profileData?.drivingLicense || {};

        const fullAddress = [
          address.street,
          address.city,
          address.state,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(", ");

        // Prefill user information
        setFormData((prev) => ({
          ...prev,

          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",

          licenseNumber: license.licenseNumber || "",

          address: fullAddress,
        }));
      } catch (err) {
        console.error("Booking data error:", err);

        setError(
          err.response?.data?.message || "Failed to load booking information.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [carId]);

  // Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear previous error when user changes payment method
    if (name === "paymentMethod") {
      setError("");
    }
  };

  // Calculate Booking Price
  const bookingSummary = useMemo(() => {
    if (!car || !formData.pickupDate || !formData.returnDate) {
      return {
        days: 0,
        subtotal: 0,
        taxes: 0,
        total: 0,
      };
    }

    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);

    const difference = returnDate - pickup;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return {
        days: 0,
        subtotal: 0,
        taxes: 0,
        total: 0,
      };
    }

    const subtotal = days * Number(car.pricePerDay || 0);
    const taxes = Math.round(subtotal * 0.18);
    const total = subtotal + taxes;

    return {
      days,
      subtotal,
      taxes,
      total,
    };
  }, [car, formData.pickupDate, formData.returnDate]);

  //  Verify Razor Payment
  const verifyPayment = async ({
    bookingId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login again.");
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Url}/api/payments/verify-payment`,
        {
          bookingId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Payment verification response:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Payment verification failed.",
        );
      }

      return response.data;
    } catch (err) {
      console.error("Payment verification error:", err);

      throw new Error(
        err.response?.data?.message || "Payment verification failed.",
      );
    }
  };

  // Open Razorpay Checkout
  const openRazorpayCheckout = async (bookingId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Please login before making payment.");
    }

    try {
      // Create Razorpay Order
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_Backend_Url}/api/payments/create-order`,
        {
          bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Razorpay order response:", orderResponse.data);

      if (!orderResponse.data.success) {
        throw new Error(
          orderResponse.data.message || "Unable to create Razorpay order.",
        );
      }

      const order = orderResponse.data.order;

      // Check Razorpay Script
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is not loaded. Please refresh the page.",
        );
      }

      // Get Selected Payment Method
      const selectedMethod = formData.paymentMethod;

      console.log("Selected payment method:", selectedMethod);

      // Base Razorpay Options
      const options = {
        key: import.meta.env.VITE_RazorPay_Key_Id,

        amount: order.amount,
        currency: order.currency,

        name: "DriveEase",

        description: `${car.brand} ${car.model} Car Rental`,

        order_id: order.id,

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,

          // This tells Razorpay which payment method
          // should be pre-selected.
          method: selectedMethod,
        },

        notes: {
          bookingId,
          car: `${car.brand} ${car.model}`,
          selectedPaymentMethod: selectedMethod,
        },

        theme: {
          color: "#f97316",
        },

        handler: async function (paymentResponse) {
          console.log("Razorpay payment response:", paymentResponse);

          try {
            setSubmitting(true);
            setError("");

            await verifyPayment({
              bookingId,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });

            alert("Payment successful! Your booking is confirmed.");

            navigate(`/booking-details/${bookingId}`);
          } catch (verificationError) {
            console.error("Verification failed:", verificationError);

            setError(
              verificationError.message || "Payment verification failed.",
            );
          } finally {
            setSubmitting(false);
          }
        },

        modal: {
          ondismiss: function () {
            setSubmitting(false);

            setError("Payment was cancelled. Your booking is still pending.");
          },
        },
      };

      // Payment Method Configuration
      if (selectedMethod === "upi") {
        options.config = {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",

                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },

            sequence: ["block.upi"],

            preferences: {
              show_default_blocks: false,
            },
          },
        };
      }

      if (selectedMethod === "card") {
        options.config = {
          display: {
            blocks: {
              card: {
                name: "Pay via Card",

                instruments: [
                  {
                    method: "card",
                  },
                ],
              },
            },

            sequence: ["block.card"],

            preferences: {
              show_default_blocks: false,
            },
          },
        };
      }

      console.log("Final Razorpay options:", options);

      // Create RazorPay Instance
      const razorpay = new window.Razorpay(options);

      // Payment Failed
      razorpay.on("payment.failed", (response) => {
        console.error("Razorpay payment failed:", response.error);

        setSubmitting(false);

        setError(
          response.error?.description || "Payment failed. Please try again.",
        );
      });

      // Open Checkout
      razorpay.open();
    } catch (err) {
      console.error("Razorpay checkout error:", err);

      throw err;
    }
  };

  // 6. Create Booking + Payments
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before booking a car.");
      return;
    }

    // Validate Dates
    if (!formData.pickupDate || !formData.returnDate) {
      setError("Please select pickup and return dates.");
      return;
    }

    const pickup = new Date(formData.pickupDate);

    const returnDate = new Date(formData.returnDate);

    if (returnDate <= pickup) {
      setError("Return date must be after pickup date.");
      return;
    }

    // Validate Locations
    if (!formData.pickupLocation) {
      setError("Please enter the pickup location.");
      return;
    }

    if (!formData.returnLocation) {
      setError("Please enter the return location.");
      return;
    }

    // Validate Customer
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please complete your customer information.");
      return;
    }

    const licenseRegex = /^[A-Z]{2}[ -]?[0-9]{2}[ -]?[0-9]{4}[ -]?[0-9]{7}$/;

    const licenseNumber = formData.licenseNumber.trim().toUpperCase();

    if (!licenseNumber) {
      setError("Driving license number is required.");
      return;
    }

    if (!licenseRegex.test(licenseNumber)) {
      setError("Please enter a valid driving license number.");
      return;
    }

    // Validate Price
    if (bookingSummary.total <= 0) {
      setError("Invalid booking amount.");
      return;
    }

    // Validate Payment Method
    if (!["card", "upi"].includes(formData.paymentMethod)) {
      setError("Please select a valid payment method.");
      return;
    }

    // Cash Disabled
    if (formData.paymentMethod === "cash") {
      setError(
        "Pay at Pickup is currently unavailable. Please select an online payment method.",
      );
      return;
    }

    try {
      setSubmitting(true);

      // Create Booking
      const bookingPayload = {
        car: car._id,
        pickupLocation: formData.pickupLocation,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        returnLocation: formData.returnLocation,
        returnDate: formData.returnDate,
        returnTime: formData.returnTime,
        paymentMethod: formData.paymentMethod,
        notes: "",
      };

      console.log("Creating booking:", bookingPayload);

      const bookingResponse = await axios.post(
        `${import.meta.env.VITE_Backend_Url}/api/bookings`,
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Booking response:", bookingResponse.data);

      if (!bookingResponse.data.success) {
        throw new Error(
          bookingResponse.data.message || "Failed to create booking.",
        );
      }

      // Get Booking Id
      const createdBooking = bookingResponse.data.booking;

      const bookingId = createdBooking?._id || bookingResponse.data.bookingId;

      if (!bookingId) {
        throw new Error("Booking was created but booking ID was not returned.");
      }

      console.log("Created booking ID:", bookingId);

      // Open RazorPay
      await openRazorpayCheckout(bookingId);
    } catch (err) {
      console.error("Booking/payment error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process booking. Please try again.",
      );

      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="booking-status">
        <div className="booking-loader"></div>

        <p>Loading booking details...</p>
      </div>
    );
  }

  // Car Not Found
  if (!car) {
    return (
      <div className="booking-status">
        <h2>Car not found</h2>

        <p>{error || "Unable to load this car."}</p>

        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header */}
      <header className="booking-header">
        <button className="back-link" onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Back
        </button>
      </header>

      {/* Error */}
      {error && <div className="booking-error">{error}</div>}

      <form className="booking-container" onSubmit={handleSubmit}>
        {/* Booking Details */}
        <div className="booking-card">
          <h2>Booking Details</h2>

          <div className="car-preview">
            <img src={car.image} alt={`${car.brand} ${car.model}`} />

            <div>
              <h3>
                {car.brand} {car.model}
              </h3>

              <p className="car-category">{car.category}</p>

              <div className="price">
                ₹{Number(car.pricePerDay).toLocaleString("en-IN")}
                <span>/day</span>
              </div>
            </div>
          </div>

          {/* Pickup */}
          <div className="form-group">
            <label>
              <FiMapPin />
              Pickup Location
            </label>

            <input
              type="text"
              name="pickupLocation"
              placeholder="Enter pickup location"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="date-time-row">
            <div className="form-group">
              <label>
                <FiCalendar />
                Pickup Date
              </label>

              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiClock />
                Pickup Time
              </label>

              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Return */}
          <div className="form-group">
            <label>
              <FiMapPin />
              Return Location
            </label>

            <input
              type="text"
              name="returnLocation"
              placeholder="Enter return location"
              value={formData.returnLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="date-time-row">
            <div className="form-group">
              <label>
                <FiCalendar />
                Return Date
              </label>

              <input
                type="date"
                name="returnDate"
                min={
                  formData.pickupDate || new Date().toISOString().split("T")[0]
                }
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FiClock />
                Return Time
              </label>

              <input
                type="time"
                name="returnTime"
                value={formData.returnTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Price */}
          <div className="price-breakdown">
            <div className="price-row">
              <span>
                ₹{Number(car.pricePerDay).toLocaleString("en-IN")}×{" "}
                {bookingSummary.days || 0} days
              </span>

              <span>₹{bookingSummary.subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="price-row">
              <span>GST (18%)</span>

              <span>₹{bookingSummary.taxes.toLocaleString("en-IN")}</span>
            </div>

            <div className="price-row total">
              <span>Total</span>

              <strong>₹{bookingSummary.total.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="booking-card">
          <h2>Customer Information</h2>

          <div className="profile-notice">
            <FiUser />

            <span>Information is loaded from your DriveEase profile.</span>
          </div>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Driving License Number</label>

            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  licenseNumber: e.target.value.toUpperCase(),
                }))
              }
              placeholder="e.g. AP0120231234567"
              maxLength={19}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your address"
              rows="4"
            />
          </div>

          {profile?.drivingLicense?.verified ? (
            <div className="verification verified">
              <FiShield />
              Driving license verified
            </div>
          ) : (
            <div className="verification pending">
              <FiShield />
              Driving license verification pending
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="booking-card payment-card">
          <h2>Payment Method</h2>

          <div className="payment-options">
            {/* Card */}
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
              />

              <FiCreditCard />

              <span>Credit / Debit Card</span>
            </label>

            {/* Upi */}
            <label className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === "upi"}
                onChange={handleChange}
              />

              <span className="payment-icon">₹</span>

              <span>UPI</span>
            </label>

            {/* Cash Bisabled */}
            <label
              className="payment-option disabled"
              title="Pay at Pickup is unavailable"
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={false}
                onChange={() =>
                  setError(
                    "Pay at Pickup is currently unavailable. Please select an online payment method.",
                  )
                }
              />

              <span className="payment-icon">💵</span>
              <span>Pay at Pickup</span>
            </label>
          </div>

          {/* Payment Total */}
          <div className="payment-total">
            <span>Amount to Pay</span>

            <strong>₹{bookingSummary.total.toLocaleString("en-IN")}</strong>
          </div>

          {/* Payment Button */}
          <button
            type="submit"
            className="proceed-btn"
            disabled={submitting || bookingSummary.total <= 0}
          >
            {submitting ? "Processing Payment..." : "Proceed to Payment"}
          </button>

          <p className="secure-payment">
            <FiShield />
            Secure payment powered by Razorpay
          </p>
        </div>
      </form>

      {/* Features */}
      <div className="features-bar">
        <div className="feature">
          <MdOutlineSecurity />
          <span>Secure Booking</span>
        </div>

        <div className="feature">
          <MdVerified />
          <span>Verified Cars</span>
        </div>

        <div className="feature">
          <GiReturnArrow />
          <span>Flexible Cancellation</span>
        </div>

        <div className="feature">
          <FiPhoneCall />
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  );
};

export default Booking;
