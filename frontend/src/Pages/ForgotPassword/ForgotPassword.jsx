import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiSend, FiAlertCircle } from "react-icons/fi";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }, 1000);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Left Section */}
        <div className="forgot-password-visual">
          <div className="forgot-brand">
            <span className="forgot-brand-mark">D</span>
            <span>DriveEase</span>
          </div>

          <div className="forgot-visual-content">
            <span className="forgot-eyebrow">WELCOME BACK</span>

            <h1>
              Get back on the
              <span> road.</span>
            </h1>

            <p>
              Don't worry. It happens to everyone. Enter your registered email
              address and we'll help you reset your password.
            </p>
          </div>

          <div className="forgot-visual-footer">
            <span>Drive smarter.</span>
            <span>Travel further.</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="forgot-password-form-section">
          <div className="forgot-password-card">
            <div className="forgot-icon">
              <FiMail />
            </div>

            <div className="forgot-header">
              <h2>Forgot Password?</h2>

              <p>
                Enter the email address associated with your DriveEase account.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="forgot-alert forgot-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="forgot-form">
              <div className="forgot-field">
                <label htmlFor="email">Email Address</label>

                <div className="forgot-input-wrapper">
                  <FiMail />

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="forgot-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="forgot-spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Send OTP
                    <FiSend />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <Link to="/login" className="back-login-link">
              <FiArrowLeft />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
