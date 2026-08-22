import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiCreditCard,
  FiEye,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import "./AdminPayments.css";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/admin/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Payments API Response:", response.data);

      if (response.data.success) {
        setPayments(response.data.data || []);

        setSummary(
          response.data.summary || {
            totalRevenue: 0,
            successfulPayments: 0,
            pendingPayments: 0,
            failedPayments: 0,
            refundedPayments: 0,
          },
        );
      } else {
        setError(response.data.message || "Unable to load payments.");
      }
    } catch (error) {
      console.error("Payments API Error:", error);

      if (error.response) {
        setError(error.response.data?.message || "Unable to load payments.");
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      } else {
        setError(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load on Page Open
  useEffect(() => {
    fetchPayments();
  }, []);

  // Format Currency
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Format Date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format Method
  const formatMethod = (method) => {
    if (!method) return "-";

    if (method.toLowerCase() === "upi") {
      return "UPI";
    }

    if (method.toLowerCase() === "card") {
      return "Card";
    }

    return method;
  };

  // Search
  const filteredPayments = payments.filter((payment) => {
    const searchText = search.toLowerCase();

    return (
      payment.paymentId?.toLowerCase().includes(searchText) ||
      payment.bookingId?.toString().toLowerCase().includes(searchText) ||
      payment.customer?.name?.toLowerCase().includes(searchText) ||
      payment.customer?.email?.toLowerCase().includes(searchText) ||
      payment.car?.toLowerCase().includes(searchText) ||
      payment.method?.toLowerCase().includes(searchText)
    );
  });

  // Loading
  if (loading) {
    return (
      <div className="admin-payments-page">
        <div className="admin-payments-header">
          <div>
            <h1>Payments</h1>
            <p>Track all customer transactions</p>
          </div>
        </div>

        <div className="admin-payments-loading">
          <div className="admin-payment-spinner"></div>

          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="admin-payments-page">
        <div className="admin-payments-header">
          <div>
            <h1>Payments</h1>
            <p>Track all customer transactions</p>
          </div>
        </div>

        <div className="admin-payments-error">
          <div className="admin-payment-error-icon">
            <FiAlertCircle />
          </div>

          <h2>Unable to load payments</h2>

          <p>{error}</p>

          <button onClick={fetchPayments}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Page
  return (
    <div className="admin-payments-page">
      {/* Header */}
      <div className="admin-payments-header">
        <div>
          <h1>Payments</h1>

          <p>Track all customer transactions</p>
        </div>
      </div>

      {/* Summary */}
      <div className="admin-payment-summary">
        {/* Total Revenue */}
        <div>
          <div className="admin-payment-icon">
            <FiCreditCard />
          </div>

          <div>
            <span>Total Revenue</span>

            <strong>{formatCurrency(summary.totalRevenue)}</strong>
          </div>
        </div>

        {/* Successful */}
        <div>
          <div className="admin-payment-icon">
            <FiCreditCard />
          </div>

          <div>
            <span>Successful Payments</span>

            <strong>{formatCurrency(summary.successfulPayments)}</strong>
          </div>
        </div>

        {/* pending */}
        <div>
          <div className="admin-payment-icon">
            <FiCreditCard />
          </div>

          <div>
            <span>Pending Payments</span>

            <strong>{formatCurrency(summary.pendingPayments)}</strong>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-payments-card">
        {/* ToolBar */}
        <div className="admin-payments-toolbar">
          <div className="admin-payment-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search payment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span className="admin-payment-count">
            {filteredPayments.length}{" "}
            {filteredPayments.length === 1 ? "payment" : "payments"}
          </span>
        </div>

        {/* Table */}
        <div className="admin-payments-table-wrapper">
          <table className="admin-payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Booking</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    {/* Payment ID */}
                    <td>
                      <strong>{payment.paymentId}</strong>
                    </td>

                    {/* Booking */}
                    <td>
                      BK-
                      {payment.bookingId?.toString().slice(-6).toUpperCase()}
                    </td>

                    {/* customer */}
                    <td>
                      <div className="admin-payment-customer">
                        <strong>{payment.customer?.name}</strong>

                        <span>{payment.customer?.email}</span>
                      </div>
                    </td>

                    {/* Method */}
                    <td>{formatMethod(payment.method)}</td>

                    {/* Date */}
                    <td>{formatDate(payment.paymentDate)}</td>

                    {/* Amount */}
                    <td>
                      <strong>{formatCurrency(payment.amount)}</strong>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`admin-payment-status ${payment.status.toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td>
                      <button
                        className="admin-payment-view"
                        title="View payment"
                      >
                        <FiEye />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="admin-no-payments">
                    <FiCreditCard />

                    <strong>No payments found</strong>

                    <span>Try changing your search.</span>
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

export default AdminPayments;
