import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    terms: false,
  });

  const nameRegex = /^[A-Za-z\s]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!nameRegex.test(form.fullName.trim())) {
      newErrors.fullName =
        "Name should contain only letters and be 3-50 characters.";
    }

    if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.";
    }

    if (!form.terms) {
      newErrors.terms = "Please accept the Terms of Service.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const regDomain = import.meta.env.VITE_Backend_Url;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Url}/api/auth/register`,
        {
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          password: form.password,
          role: "customer",
        },
      );

      console.log("Registration response:", response.data);

      if (response.data.success) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      setErrors({
        submit:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    }
  };

  return (
    <section className="register">
      {/* Left Side */}
      <div className="register__left">
        <Link to="/" className="register__logo">
          <img src="/logo-bg.png" alt="logo" />
        </Link>
        <h1>Create Your Account</h1>
        <p>Sign up and start booking your dream car today.</p>
      </div>

      {/* Right Side */}
      <div className="register__right">
        <div className="register__card">
          <h2>Welcome</h2>
          <p className="register__subtitle">Create an account to continue</p>

          <form className="register__form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className={errors.fullName ? "error" : ""}
              />
            </div>
            {errors.fullName && <p className="error-text">{errors.fullName}</p>}

            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
            </div>
            {errors.email && <p className="error-text">{errors.email}</p>}

            <div className="input-group">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? "error" : ""}
              />
            </div>
            {errors.phone && <p className="error-text">{errors.phone}</p>}

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}

            <label className="terms-label">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
              />
              <span>
                I agree to the <Link to="/terms">Terms of Service</Link>
              </span>
            </label>
            {errors.terms && <p className="error-text">{errors.terms}</p>}

            {errors.submit && <p className="error-text">{errors.submit}</p>}

            <button type="submit" className="btn-primary">
              Create Account <FiArrowRight />
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button type="button" className="btn-google">
            <FcGoogle /> Continue with Google
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
