import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loginError, setLoginError] = useState("");

  const slides = [
    {
      title: "Welcome Back!",
      subtitle: "Login to continue your journey with us.",
    },
    {
      title: "Drive Your Dream",
      subtitle: "Choose from our premium collection of luxury vehicles.",
    },
    {
      title: "Easy Booking",
      subtitle: "Book your perfect car in just a few clicks.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "customer",
    remember: true,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lgDomain = import.meta.env.VITE_Backend_Url;

    try {
      const lgresponse = await axios.post(
        `${lgDomain}/api/auth/login`,
        formData,
      );

      setLoginError("");

      const loggedInUser = lgresponse.data.user;

      // Store authentication data
      localStorage.setItem("token", lgresponse.data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));

      // Redirect based on role
      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      console.log(lgresponse.data);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="lg-container">
      {/* Left Side */}
      <div className="lg-brand">
        <div className="lg-overlay"></div>

        <div className="lg-content">
          <Link to="/" className="lg-logo">
            <img src="/logo-bg.png" alt="DriveEase" />
          </Link>

          <div className="lg-slides">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`lg-slide ${currentSlide === index ? "active" : ""}`}
              >
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="lg-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`lg-dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="lg-form-section">
        <div className="lg-card">
          <h2>Login</h2>

          <p className="lg-subtitle">Login to continue your journey with us.</p>

          <form onSubmit={handleSubmit}>
            <div className="lg-group">
              <label>Email Address</label>

              <div className="lg-input">
                <FiMail className="lg-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="lg-roles">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="lg-group">
              <label>Password</label>

              <div className="lg-input">
                <FiLock className="lg-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="lg-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="lg-options">
              <label className="lg-remember">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />

                <span>Remember Me</span>
              </label>

              <Link to="/forgot-password" className="lg-forgot">
                Forgot Password?
              </Link>
            </div>

            {loginError && <p className="login-error">{loginError}</p>}

            <button type="submit" className="lg-btn">
              Login <FiArrowRight />
            </button>
          </form>

          <div className="lg-divider">
            <span>or continue with</span>
          </div>

          <div className="lg-social">
            <button type="button" className="lg-social-btn lg-google">
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="lg-register">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
