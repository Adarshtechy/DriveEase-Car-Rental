import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import "./GetInTouch.css";

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setTimeout(() => setSuccess(false), 4500);
    }, 900);
  };

  return (
    <section className="get-in-touch">
      <div className="get-in-touch__container">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>Have questions? Our team is ready to help you.</p>
        </div>

        <div className="get-in-touch__content">
          {/* Contact Form */}
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
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
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                <FiSend />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>

            {success && (
              <div className="success-message">
                Thank you! We'll get back to you shortly.
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="contact-info">
            <h3>Contact Information</h3>

            <div className="info-list">
              <div className="info-row">
                <FiMapPin className="info-icon" />
                <div>
                  <strong>DriveEase Office</strong>
                  <p>
                    6th Floor, Hitec City, Madhapur
                    <br />
                    Hyderabad, Telangana - 500081
                  </p>
                </div>
              </div>

              <div className="info-row">
                <FiPhone className="info-icon" />
                <div>
                  <strong>Phone</strong>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="info-row">
                <FiMail className="info-icon" />
                <div>
                  <strong>Email</strong>
                  <p>support@driveease.com</p>
                </div>
              </div>

              <div className="info-row">
                <FiClock className="info-icon" />
                <div>
                  <strong>Working Hours</strong>
                  <p>Mon - Sun, 24/7</p>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe
                title="DriveEase Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.057978688!2d78.376!3d17.448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93b0e1b0e0b7%3A0x4e5e5e5e5e5e5e5e!2sHitec%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1690000000000"
                width="100%"
                height="210"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Trust Features */}
        <div className="trust-bar">
          <div className="trust-item">
            <FiCheckCircle className="trust-icon" />
            <div>
              <h4>Free Cancellation</h4>
              <p>Up to 24 hours before pickup</p>
            </div>
          </div>
          <div className="trust-item">
            <FiCheckCircle className="trust-icon" />
            <div>
              <h4>No Hidden Charges</h4>
              <p>Transparent pricing always</p>
            </div>
          </div>
          <div className="trust-item">
            <FiCheckCircle className="trust-icon" />
            <div>
              <h4>24/7 Support</h4>
              <p>We're always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
