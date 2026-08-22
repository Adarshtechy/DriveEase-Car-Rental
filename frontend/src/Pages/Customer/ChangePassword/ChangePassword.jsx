import { useMemo, useState } from "react";
import axios from "axios";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";

import "./ChangePassword.css";

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordRequirements = useMemo(() => {
    const password = formData.newPassword;

    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [formData.newPassword]);

  const requirementCount =
    Object.values(passwordRequirements).filter(Boolean).length;

  const passwordStrength = useMemo(() => {
    if (!formData.newPassword) {
      return {
        label: "",
        level: 0,
      };
    }

    if (requirementCount <= 2) {
      return {
        label: "Weak",
        level: 1,
      };
    }

    if (requirementCount === 3 || requirementCount === 4) {
      return {
        label: "Medium",
        level: 2,
      };
    }

    return {
      label: "Strong",
      level: 3,
    };
  }, [formData.newPassword, requirementCount]);

  const isFormValid =
    formData.currentPassword &&
    formData.newPassword &&
    formData.confirmPassword &&
    requirementCount === 5 &&
    formData.newPassword === formData.confirmPassword &&
    formData.currentPassword !== formData.newPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!formData.currentPassword) {
      setMessage({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }

    if (requirementCount < 5) {
      setMessage({
        type: "error",
        text: "Please make sure your new password meets all requirements.",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New password and confirmation password do not match.",
      });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({
        type: "error",
        text: "Your new password must be different from your current password.",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_Backend_Url}/api/auth/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage({
        type: "success",
        text: "Your password has been changed successfully.",
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Unable to change your password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({ name, label, placeholder, value, field }) => (
    <div className="password-field">
      <label htmlFor={name}>{label}</label>

      <div className="password-input-wrapper">
        <FiLock className="password-input-icon" />

        <input
          id={name}
          type={showPassword[field] ? "text" : "password"}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={
            field === "current" ? "current-password" : "new-password"
          }
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => togglePassword(field)}
          aria-label={showPassword[field] ? `Hide ${label}` : `Show ${label}`}
        >
          {showPassword[field] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="change-password-page">
      {/* Header */}
      <div className="change-password-header">
        <div className="change-password-heading">
          <div className="change-password-title-icon">
            <FiShield />
          </div>

          <div>
            <h2>Change Password</h2>
            <p>Update your password to keep your DriveEase account secure.</p>
          </div>
        </div>
      </div>

      <div className="change-password-layout">
        {/* Main Card */}
        <div className="change-password-card">
          <div className="card-top">
            <div className="card-lock-icon">
              <FiLock />
            </div>

            <div>
              <h3>Update your password</h3>
              <p>Choose a strong password that you don't use anywhere else.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <PasswordInput
              name="currentPassword"
              label="Current Password"
              placeholder="Enter your current password"
              value={formData.currentPassword}
              field="current"
            />

            <PasswordInput
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              value={formData.newPassword}
              field="new"
            />

            {/* Password Strength */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-header">
                  <span>Password strength</span>

                  <strong
                    className={`strength-text strength-${passwordStrength.level}`}
                  >
                    {passwordStrength.label}
                  </strong>
                </div>

                <div className="strength-bars">
                  {[1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className={
                        bar <= passwordStrength.level
                          ? `strength-bar active strength-${passwordStrength.level}`
                          : "strength-bar"
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <PasswordInput
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              field="confirm"
            />

            {/* Match Status */}
            {formData.confirmPassword && (
              <div
                className={`password-match ${
                  formData.newPassword === formData.confirmPassword
                    ? "match-success"
                    : "match-error"
                }`}
              >
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <FiCheck />
                    Passwords match
                  </>
                ) : (
                  <>
                    <FiAlertCircle />
                    Passwords do not match
                  </>
                )}
              </div>
            )}

            {/* Message */}
            {message.text && (
              <div className={`change-password-message ${message.type}`}>
                {message.type === "success" ? <FiCheck /> : <FiAlertCircle />}

                <span>{message.text}</span>
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-password-btn"
                onClick={() => {
                  setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });

                  setMessage({
                    type: "",
                    text: "",
                  });
                }}
              >
                Clear
              </button>

              <button
                type="submit"
                className="update-password-btn"
                disabled={loading || !isFormValid}
              >
                <FiLock />

                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Security Information */}
        <div className="password-security-card">
          <div className="security-card-header">
            <div className="security-icon">
              <FiShield />
            </div>

            <div>
              <h3>Password requirements</h3>
              <p>Your password should meet all of these requirements.</p>
            </div>
          </div>

          <div className="password-requirements">
            <Requirement
              passed={passwordRequirements.length}
              text="At least 8 characters"
            />

            <Requirement
              passed={passwordRequirements.uppercase}
              text="At least one uppercase letter"
            />

            <Requirement
              passed={passwordRequirements.lowercase}
              text="At least one lowercase letter"
            />

            <Requirement
              passed={passwordRequirements.number}
              text="At least one number"
            />

            <Requirement
              passed={passwordRequirements.special}
              text="At least one special character"
            />
          </div>

          <div className="security-tip">
            <FiShield />

            <div>
              <strong>Security tip</strong>
              <p>
                Avoid using your name, phone number, birthday, or easily guessed
                information in your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Requirement({ passed, text }) {
  return (
    <div
      className={`password-requirement ${passed ? "requirement-passed" : ""}`}
    >
      <span className="requirement-icon">
        {passed ? <FiCheck /> : <span />}
      </span>

      <span>{text}</span>
    </div>
  );
}

export default ChangePassword;
