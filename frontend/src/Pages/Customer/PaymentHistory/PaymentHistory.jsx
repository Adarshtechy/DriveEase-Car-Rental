import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiRefreshCcw,
  FiXCircle,
  FiMoreVertical,
  FiEye,
  FiDownload,
  FiCalendar,
  FiHash,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";

import "./PaymentHistory.css";

const formatAmount = (amount = 0) => {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getPaymentDate = (payment) => {
  return payment?.paymentDate || payment?.createdAt;
};

const getStatusIcon = (status) => {
  switch (status) {
    case "paid":
      return <FiCheckCircle />;

    case "pending":
      return <FiClock />;

    case "refunded":
      return <FiRefreshCcw />;

    case "failed":
      return <FiXCircle />;

    default:
      return <FiClock />;
  }
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatMethod = (method) => {
  if (!method) return "Unknown";

  if (method.toLowerCase() === "upi") {
    return "UPI";
  }

  if (method.toLowerCase() === "card") {
    return "Card";
  }

  return method;
};

const getBookingId = (booking) => {
  if (!booking) return "N/A";

  return booking.bookingId || booking._id || "N/A";
};

function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Payment History
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your payment history.");
          return;
        }

        const backendUrl = import.meta.env.VITE_Backend_Url;

        const response = await axios.get(`${backendUrl}/api/payments/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Payment history response:", response.data);

        setPayments(response.data?.payments || []);
      } catch (error) {
        console.error("Payment history error:", error);

        setError(
          error.response?.data?.message || "Failed to load payment history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Filter Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const search = searchTerm.toLowerCase().trim();

      const carName = payment.booking?.car
        ? `${payment.booking.car.brand} ${payment.booking.car.model}`
        : "";

      const bookingId = getBookingId(payment.booking);

      const paymentId = payment.razorpayPaymentId || payment._id || "";

      const orderId = payment.razorpayOrderId || "";

      const method = formatMethod(payment.paymentMethod);

      const matchesSearch =
        !search ||
        paymentId.toLowerCase().includes(search) ||
        orderId.toLowerCase().includes(search) ||
        bookingId.toLowerCase().includes(search) ||
        carName.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter.toLowerCase();

      const matchesMethod = methodFilter === "All" || method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, searchTerm, statusFilter, methodFilter]);

  // Summary
  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const successfulPayments = payments.filter(
    (payment) => payment.status === "paid",
  ).length;

  const totalRefunded = payments
    .filter((payment) => payment.status === "refunded")
    .reduce(
      (total, payment) =>
        total + Number(payment.refundAmount || payment.amount || 0),
      0,
    );

  // Download Receipt
  const handleDownloadReceipt = (payment) => {
    const paymentId = payment.razorpayPaymentId || payment._id || "N/A";

    alert(`Receipt for ${paymentId} will be downloaded.`);
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setMethodFilter("All");
  };

  return (
    <div className="payment-history">
      {/* Header */}
      <div className="payment-header">
        <div className="payment-title-row">
          <div className="payment-title-icon">
            <FiCreditCard />
          </div>

          <div>
            <h2>Payment History</h2>

            <p>Track your payments, transactions and refunds in one place.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="payment-summary">
        <div className="summary-card">
          <div className="summary-icon paid-icon">
            <FiCreditCard />
          </div>

          <div className="summary-content">
            <span>Total Paid</span>
            <h3>{formatAmount(totalPaid)}</h3>
            <small>Across all successful payments</small>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon success-icon">
            <FiCheckCircle />
          </div>

          <div className="summary-content">
            <span>Successful Payments</span>
            <h3>{successfulPayments}</h3>
            <small>Completed transactions</small>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon refund-icon">
            <FiRefreshCcw />
          </div>

          <div className="summary-content">
            <span>Total Refunded</span>
            <h3>{formatAmount(totalRefunded)}</h3>
            <small>Amount returned to you</small>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="payment-toolbar">
        <div className="payment-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search payment, booking or car..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="payment-filters">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="payment-table-container">
        <div className="table-header">
          <div>
            <h3>Transactions</h3>

            {!loading && !error && (
              <span>
                {filteredPayments.length} transaction
                {filteredPayments.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="payment-loading">
            <div className="payment-spinner"></div>

            <p>Loading payment history...</p>
          </div>
        ) : error ? (
          /* Error */
          <div className="payment-error">
            <FiAlertCircle />

            <p>{error}</p>
          </div>
        ) : filteredPayments.length > 0 ? (
          /* Table */
          <div className="payment-table-wrapper">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Booking</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => {
                  const bookingId = getBookingId(payment.booking);

                  const paymentId = payment.razorpayPaymentId || payment._id;

                  const carName = payment.booking?.car
                    ? `${payment.booking.car.brand} ${payment.booking.car.model}`
                    : "Car Rental";

                  return (
                    <tr key={payment._id}>
                      {/* Payment */}
                      <td>
                        <div className="payment-id">
                          <div className="transaction-icon">
                            <FiCreditCard />
                          </div>

                          <div>
                            <strong>{paymentId}</strong>

                            <span>{payment.razorpayOrderId || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Booking */}
                      <td>
                        <div className="booking-info">
                          <strong>{carName}</strong>

                          <span>
                            {bookingId}

                            {payment.booking?.car?.category
                              ? ` · ${payment.booking.car.category}`
                              : ""}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="date-info">
                          <FiCalendar />

                          <span>{formatDate(getPaymentDate(payment))}</span>
                        </div>
                      </td>

                      {/* Method */}
                      <td>
                        <span className="payment-method">
                          {formatMethod(payment.paymentMethod)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td>
                        <strong className="payment-amount">
                          {formatAmount(payment.amount)}
                        </strong>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`payment-status ${payment.status || ""}`}
                        >
                          {getStatusIcon(payment.status)}
                          {formatStatus(payment.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="payment-actions">
                          <button
                            className="view-payment-btn"
                            onClick={() => setSelectedPayment(payment)}
                            title="View payment"
                          >
                            <FiEye />
                          </button>

                          <button
                            className="more-btn"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === payment._id ? null : payment._id,
                              )
                            }
                            title="More options"
                          >
                            <FiMoreVertical />
                          </button>

                          {openMenu === payment._id && (
                            <div className="payment-menu">
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setOpenMenu(null);
                                }}
                              >
                                <FiEye />
                                View Details
                              </button>

                              <button
                                onClick={() => {
                                  handleDownloadReceipt(payment);
                                  setOpenMenu(null);
                                }}
                              >
                                <FiDownload />
                                Download Receipt
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty */
          <div className="empty-payments">
            <div className="empty-payment-icon">
              <FiCreditCard />
            </div>

            <h3>No payments found</h3>

            <p>
              We couldn't find any payments matching your search or filters.
            </p>

            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredPayments.length > 0 && (
        <div className="payment-pagination">
          <span>
            Showing <strong>{filteredPayments.length}</strong> transaction
            {filteredPayments.length !== 1 ? "s" : ""}
          </span>

          <div className="pagination-buttons">
            <button disabled>
              <FiChevronLeft />
            </button>

            <button className="active-page">1</button>

            <button disabled>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Payments Details */}
      {selectedPayment && (
        <div
          className="payment-modal-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <span>Transaction Details</span>

                <h3>
                  {selectedPayment.razorpayPaymentId || selectedPayment._id}
                </h3>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedPayment(null)}
              >
                ×
              </button>
            </div>

            {/* Status */}
            <div className="modal-status">
              <div
                className={`modal-status-icon ${selectedPayment.status || ""}`}
              >
                {getStatusIcon(selectedPayment.status)}
              </div>

              <div>
                <strong>Payment {formatStatus(selectedPayment.status)}</strong>

                <span>{formatDate(getPaymentDate(selectedPayment))}</span>
              </div>
            </div>

            {/* Amount */}
            <div className="modal-amount">
              <span>Amount Paid</span>

              <strong>{formatAmount(selectedPayment.amount)}</strong>
            </div>

            {/* Details */}
            <div className="payment-details-list">
              {/* Booking */}

              <div className="detail-row">
                <span>
                  <FiHash />
                  Booking ID
                </span>

                <strong>{getBookingId(selectedPayment.booking)}</strong>
              </div>

              {/* Payment Method */}
              <div className="detail-row">
                <span>
                  <FiCreditCard />
                  Payment Method
                </span>

                <strong>{formatMethod(selectedPayment.paymentMethod)}</strong>
              </div>

              {/* Car */}
              <div className="detail-row">
                <span>Car</span>

                <strong>
                  {selectedPayment.booking?.car
                    ? `${selectedPayment.booking.car.brand} ${selectedPayment.booking.car.model}`
                    : "Car Rental"}
                </strong>
              </div>

              {/* Pickup Date  */}
              <div className="detail-row">
                <span>Pickup Date</span>

                <strong>
                  {formatDate(selectedPayment.booking?.pickupDate)}
                </strong>
              </div>

              {/* Return Date */}
              <div className="detail-row">
                <span>Return Date</span>

                <strong>
                  {formatDate(selectedPayment.booking?.returnDate)}
                </strong>
              </div>

              {/* Transaction ID */}
              <div className="detail-row">
                <span>Transaction ID</span>

                <strong className="transaction-value">
                  {selectedPayment.razorpayPaymentId || "N/A"}
                </strong>
              </div>

              {/* Order ID */}
              <div className="detail-row">
                <span>Razorpay Order ID</span>

                <strong className="transaction-value">
                  {selectedPayment.razorpayOrderId || "N/A"}
                </strong>
              </div>

              {/* Payment Date */}
              <div className="detail-row">
                <span>Payment Date</span>

                <strong>{formatDate(getPaymentDate(selectedPayment))}</strong>
              </div>

              {/* Status */}
              <div className="detail-row">
                <span>Status</span>
                <span
                  className={`payment-status ${selectedPayment.status || ""}`}
                >
                  {getStatusIcon(selectedPayment.status)}
                  {formatStatus(selectedPayment.status)}
                </span>
              </div>

              {/* Refund */}
              {selectedPayment.status === "refunded" && (
                <>
                  <div className="detail-row">
                    <span>Refund Amount</span>

                    <strong>
                      {formatAmount(selectedPayment.refundAmount || 0)}
                    </strong>
                  </div>

                  <div className="detail-row">
                    <span>Refund Date</span>
                    <strong>{formatDate(selectedPayment.refundDate)}</strong>
                  </div>
                </>
              )}
            </div>

            {/* Download */}
            <button
              className="download-receipt-btn"
              onClick={() => handleDownloadReceipt(selectedPayment)}
            >
              <FiDownload />
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory;
