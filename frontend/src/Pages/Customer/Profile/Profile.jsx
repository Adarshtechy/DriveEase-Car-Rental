import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUser,
  FiEdit2,
  FiCalendar,
  FiStar,
  FiMapPin,
  FiMail,
  FiPhone,
  FiSave,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  /* Fetch Profile */
  useEffect(() => {
    fetchProfile();
    fetchBookingCount();
  }, []);

  const fetchProfile = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your profile.");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const userData = data.profile || data;

      setProfile(userData);

      setEditData({
        fullName: userData?.user?.fullName || "",
        email: userData?.user?.email || "",
        phone: userData?.user?.phone || "",
        dateOfBirth: userData?.dateOfBirth
          ? userData.dateOfBirth.substring(0, 10)
          : "",
        street: userData?.address?.street || "",
        city: userData?.address?.city || "",
        state: userData?.address?.state || "",
        postalCode: userData?.address?.postalCode || "",
        country: userData?.address?.country || "",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);

      setError(err?.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // Booking Count
  const fetchBookingCount = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Url}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setTotalBookings(response.data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch booking count:", error);
      setTotalBookings(0);
    }
  };

  /* Handle Input Change */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Save Profile */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_Backend_Url}/api/profile`,
        {
          dateOfBirth: editData.dateOfBirth,
          address: {
            street: editData.street,
            city: editData.city,
            state: editData.state,
            postalCode: editData.postalCode,
            country: editData.country,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      await fetchProfile();
    } catch (err) {
      console.error("Profile update error:", err);

      setError(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  /* Cancel Editing */
  const handleCancel = () => {
    setIsEditing(false);
    setError("");
    setSuccess("");

    if (profile) {
      setEditData({
        fullName: profile?.user?.fullName || "",
        email: profile?.user?.email || "",
        phone: profile?.user?.phone || "",
        dateOfBirth: profile?.dateOfBirth
          ? profile.dateOfBirth.substring(0, 10)
          : "",
        street: profile?.address?.street || "",
        city: profile?.address?.city || "",
        state: profile?.address?.state || "",
        postalCode: profile?.address?.postalCode || "",
        country: profile?.address?.country || "",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const firstConfirm = window.confirm(
      "Are you sure you want to delete your account?",
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "This will permanently delete your DriveEase account, profile, bookings, and payment history. This action cannot be undone. Continue?",
    );

    if (!secondConfirm) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please login again.");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_Backend_Url}/api/profile/account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete account.");
      }

      console.log("Account deletion result:", response.data);

      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to home page
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Delete account error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete your account. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /* Format Date */
  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* Loading Profile */
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  /* Error */
  if (error && !profile) {
    return (
      <div className="profile-error-page">
        <div className="profile-error-card">
          <div className="error-icon">
            <FiUser />
          </div>

          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="profile-page-header">
        <div>
          <span className="page-eyebrow">ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your personal information and account details.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => {
              setError("");
              setSuccess("");
              setIsEditing(true);
            }}
          >
            <FiEdit2 />
            Edit Profile
          </button>
        )}
      </div>

      {/* Success / Error Messages */}
      {success && (
        <div className="profile-alert success-alert">
          <div className="alert-icon">✓</div>
          <span>{success}</span>
        </div>
      )}

      {error && profile && (
        <div className="profile-alert error-alert">
          <div className="alert-icon">!</div>
          <span>{error}</span>
        </div>
      )}

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Overview */}
        <section className="profile-overview-card">
          <div className="profile-avatar">
            <FiUser />
          </div>

          <div className="profile-overview-info">
            <h2>{profile?.user?.fullName || "User"}</h2>

            <div className="profile-email">
              <FiMail />
              <span>{profile?.user?.email || "Email not provided"}</span>
            </div>

            <div className="member-info">
              <FiCalendar />

              <span>
                Member since{" "}
                {profile?.user?.createdAt
                  ? new Date(profile.user.createdAt).getFullYear()
                  : "2026"}
              </span>
            </div>
          </div>

          <div className="profile-status">
            <span className="status-dot"></span>
            Active
          </div>
        </section>

        {/* Personal Information */}
        <section className="profile-card">
          <div className="card-header">
            <div className="card-title-wrapper">
              <div className="card-icon">
                <FiUser />
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>Your basic account information</p>
              </div>
            </div>
          </div>

          <div className="profile-grid">
            {/* Full Name */}
            <div className="profile-field">
              <label>Full Name</label>

              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="field-value">
                  {profile?.user?.fullName || "Not provided"}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="profile-field">
              <label>Email Address</label>

              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              ) : (
                <div className="field-value">
                  {profile?.user?.email || "Not provided"}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="profile-field">
              <label>Phone Number</label>

              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="field-value">
                  {profile?.user?.phone || "Not provided"}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="profile-field">
              <label>Date of Birth</label>

              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editData.dateOfBirth}
                  onChange={handleChange}
                />
              ) : (
                <div className="field-value">
                  {formatDate(profile?.dateOfBirth)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="profile-card">
          <div className="card-header">
            <div className="card-title-wrapper">
              <div className="card-icon">
                <FiMapPin />
              </div>

              <div>
                <h3>Address</h3>
                <p>Your current residential address</p>
              </div>
            </div>
          </div>

          <div className="profile-grid address-grid">
            {[
              {
                field: "street",
                label: "Street Address",
              },
              {
                field: "city",
                label: "City",
              },
              {
                field: "state",
                label: "State",
              },
              {
                field: "postalCode",
                label: "Postal Code",
              },
              {
                field: "country",
                label: "Country",
              },
            ].map(({ field, label }) => (
              <div className="profile-field" key={field}>
                <label>{label}</label>

                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={editData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                ) : (
                  <div className="field-value">
                    {profile?.address?.[field] || "Not provided"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="profile-edit-actions">
              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                <FiX />
                Cancel
              </button>

              <button
                type="button"
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                <FiSave />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </section>

        {/* Stats */}
        <div className="profile-stats">
          <div className="profile-stat-card">
            <div className="stat-icon booking-stat-icon">
              <FiCalendar />
            </div>

            <div>
              <h3>{totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon rating-stat-icon">
              <FiStar />
            </div>

            <div>
              <h3>4.8</h3>
              <p>Average Rating</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="stat-icon member-stat-icon">
              <FiUser />
            </div>

            <div>
              <h3>
                {profile?.user?.createdAt
                  ? new Date(profile.user.createdAt).getFullYear()
                  : "2026"}
              </h3>

              <p>Member Since</p>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <section className="danger-zone">
          <div className="danger-zone-content">
            <div className="danger-icon">
              <FiTrash2 />
            </div>

            <div className="danger-info">
              <h3>Delete Account</h3>

              <p>
                Permanently delete your DriveEase account and associated account
                data. This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="delete-account-btn"
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            <FiTrash2 />

            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Profile;
