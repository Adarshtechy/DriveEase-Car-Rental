import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiEye,
  FiUser,
  FiAlertCircle,
  FiRefreshCw,
  FiTrash2,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

import "./AdminCustomers.css";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete states
  const [deleteCustomer, setDeleteCustomer] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Get Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/admin/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Customers API Response:", response.data);

      if (response.data.success) {
        setCustomers(response.data.data || []);
      } else {
        setError(response.data.message || "Unable to load customers.");
      }
    } catch (error) {
      console.error("Customers API Error:", error);

      if (error.response) {
        setError(error.response.data?.message || "Unable to load customers.");
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

  // Fetch on Load
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Delete Customer
  const handleDeleteCustomer = async () => {
    if (!deleteCustomer?._id) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_Backend_Url}/api/admin/customers/${deleteCustomer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Delete Customer Response:", response.data);

      if (response.data.success) {
        // Immediately remove customer from UI
        setCustomers((prevCustomers) =>
          prevCustomers.filter(
            (customer) => customer._id !== deleteCustomer._id,
          ),
        );

        // Close confirmation modal
        setDeleteCustomer(null);

        // Refresh data from backend
        await fetchCustomers();
      } else {
        alert(response.data.message || "Failed to delete customer.");
      }
    } catch (error) {
      console.error("Delete Customer Error:", error);

      if (error.response) {
        alert(error.response.data?.message || "Failed to delete customer.");
      } else if (error.request) {
        alert(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      } else {
        alert(error.message || "Something went wrong.");
      }
    } finally {
      setDeleting(false);
    }
  };

  // Search
  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase().trim();

    return (
      customer.fullName?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.phone?.toLowerCase().includes(searchText)
    );
  });

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

  // Loading
  if (loading) {
    return (
      <div className="admin-customers-page">
        <div className="admin-customers-header">
          <div>
            <h1>Customers</h1>
            <p>Manage registered DriveEase customers</p>
          </div>
        </div>

        <div className="admin-customers-loading">
          <div className="admin-loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="admin-customers-page">
        <div className="admin-customers-header">
          <div>
            <h1>Customers</h1>
            <p>Manage registered DriveEase customers</p>
          </div>
        </div>

        <div className="admin-customers-error">
          <div className="admin-error-icon">
            <FiAlertCircle />
          </div>

          <h2>Unable to load customers</h2>

          <p>{error}</p>

          <button onClick={fetchCustomers}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-customers-page">
      {/* Header */}
      <div className="admin-customers-header">
        <div>
          <h1>Customers</h1>
          <p>Manage registered DriveEase customers</p>
        </div>
      </div>

      {/* Card */}
      <div className="admin-customers-card">
        {/* Tool Bar */}
        <div className="admin-customers-toolbar">
          <div className="admin-customer-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <span>
            {filteredCustomers.length}{" "}
            {filteredCustomers.length === 1 ? "customer" : "customers"}
          </span>
        </div>

        {/* Table */}
        <div className="admin-customers-table-wrapper">
          <table className="admin-customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Bookings</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    {/* Customer */}
                    <td>
                      <div className="admin-customer-info">
                        <div className="admin-customer-avatar">
                          <FiUser />
                        </div>

                        <div>
                          <strong>{customer.fullName}</strong>
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td>{customer.phone || "-"}</td>

                    {/* Bookings */}
                    <td>
                      <strong>{customer.bookings || 0}</strong>
                    </td>

                    {/* Spent */}
                    <td>
                      <strong>{formatCurrency(customer.spent)}</strong>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`admin-customer-status ${
                          customer.status?.toLowerCase() || "inactive"
                        }`}
                      >
                        {customer.status || "Inactive"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td>{formatDate(customer.createdAt)}</td>

                    {/* Action */}
                    <td>
                      <div className="admin-customer-actions">
                        <button
                          className="admin-customer-view"
                          title="View customer"
                          type="button"
                        >
                          <FiEye />
                        </button>

                        <button
                          className="admin-customer-delete"
                          title="Delete customer"
                          type="button"
                          onClick={() => setDeleteCustomer(customer)}
                          disabled={deleting}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-no-customers">
                    <FiUser />

                    <strong>No customers found</strong>

                    <span>Try changing your search.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCustomer && (
        <div
          className="admin-delete-overlay"
          onClick={() => !deleting && setDeleteCustomer(null)}
        >
          <div
            className="admin-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="admin-delete-close"
              type="button"
              onClick={() => setDeleteCustomer(null)}
              disabled={deleting}
              aria-label="Close"
            >
              <FiX />
            </button>

            {/* Icon */}
            <div className="admin-delete-icon">
              <FiAlertTriangle />
            </div>

            {/* Content */}
            <h2>Delete Customer?</h2>

            <p>Are you sure you want to permanently delete this customer?</p>

            <div className="admin-delete-customer-info">
              <div className="admin-delete-avatar">
                <FiUser />
              </div>

              <div>
                <strong>{deleteCustomer.fullName}</strong>

                <span>{deleteCustomer.email}</span>
              </div>
            </div>

            <div className="admin-delete-warning">
              <strong>This action will delete:</strong>

              <ul>
                <li>Customer account</li>
                <li>Customer bookings</li>
                <li>Customer payment records</li>
              </ul>

              <span>This action cannot be undone.</span>
            </div>

            {/* Actions */}
            <div className="admin-delete-actions">
              <button
                type="button"
                className="admin-delete-cancel"
                onClick={() => setDeleteCustomer(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-delete-confirm"
                onClick={handleDeleteCustomer}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="admin-delete-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Customer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
