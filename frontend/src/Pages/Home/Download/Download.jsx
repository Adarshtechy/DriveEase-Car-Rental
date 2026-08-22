import "./Download.css";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { FaCarRear, FaLocationDot } from "react-icons/fa6";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const faqs = [
    {
        q: "What documents are required?",
        a: "Valid driving license, Aadhaar/Passport and PAN card are required.",
    },
    {
        q: "Do you provide airport pickup?",
        a: "Yes, airport pickup & drop services are available.",
    },
    {
        q: "What is your cancellation policy?",
        a: "Free cancellation up to 24 hours before pickup.",
    },
    {
        q: "What payment methods are accepted?",
        a: "UPI, Cards, Net Banking and Wallets are accepted.",
    },
];

const Download = () => {
    const [open, setOpen] = useState(null);

    return (
      <>
        <section className="download fade-up dl download-section">
          <div className="download-container">
            <h2 className="download-title">
              Download the <span>DriveEase App</span>
            </h2>

            <div className="download-row">
              {/* Phone */}
              <div className="download-phone">
                <img
                  src="/assets/overviews-img/appMockup.png"
                  alt="App Preview"
                />
              </div>

              {/* Text */}
              <div className="download-text">
                <p>
                  Book your ride in seconds, manage trips easily, and unlock
                  exclusive app-only discounts.
                </p>

                <div className="store-buttons">
                  <a href="#">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                    />
                  </a>
                  <a href="#">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="App Store"
                    />
                  </a>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="download-features">
                <div className="dl-feature-card">
                  <FaCarRear />
                  <span>100+ Cars</span>
                </div>
                <div className="dl-feature-card">
                  <AiFillThunderbolt />
                  <span>Instant Booking</span>
                </div>
                <div className="dl-feature-card">
                  <FaLocationDot />
                  <span>25+ Locations</span>
                </div>
                <div className="dl-feature-card">
                  <FaLock /> <span>Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Faq Section */}
        <section className="faq fade-up dl download-section">
          <div className="faq-top">
            <h2>Frequently Asked Questions</h2>
            <Link to="/faq" className="faq-btn">
              View All →
            </Link>
          </div>

          <div className="faq-list">
            {faqs.map((item, i) => (
              <div key={i} className={`faq-card ${open === i ? "active" : ""}`}>
                <button onClick={() => setOpen(open === i ? null : i)}>
                  <span>{item.q}</span>
                  {open === i ? <FiMinus /> : <FiPlus />}
                </button>

                <div className="faq-content">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
};

export default Download;