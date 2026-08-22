import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import logo from "/logo-bg.png";

const Footer = () => {
  return (
    <footer className="foot fade-up">
      <div className="foot-wrap">
        {/* Top Grid */}
        <div className="foot-grid">
          {/* Brand */}
          <div className="foot-col brand">
            <img src={logo} alt="DriveEase" className="foot-logo" />
            <p>
              DriveEase provides premium car rentals with comfort, reliability
              and best prices for every journey.
            </p>

            <div className="foot-social">
              <Link to="https://www.facebook.com/">
                <FaFacebookF />
              </Link>
              <Link to="https://www.instagram.com">
                <FaInstagram />
              </Link>
              <Link to="https://www.x.com">
                <FaTwitter />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="foot-col">
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/cars">Cars</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Services</h4>
            <ul>
              <li>
                <Link to="/cars?type=luxury">Luxury Cars</Link>
              </li>
              <li>
                <Link to="/cars?type=suv">SUV Rentals</Link>
              </li>
              <li>
                <Link to="/services">Self Drive</Link>
              </li>
              <li>
                <Link to="/services">Airport Pickup</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Support</h4>
            <ul>
              <li>
                <Link to="/">Help Center</Link>
              </li>
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="foot-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <p>Hyderabad, Telangana</p>
              </li>
              <li>
                <p>
                  <a href="tel:+919876543210">+91 98765 43210</a>
                </p>
              </li>
              <li>
                <p>
                  <a href="mailto:support@driveease.com">
                    support@driveease.com
                  </a>
                </p>
              </li>
              <li>
                <p>24/7 Support</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="foot-bottom">
          <p>© 2026 DriveEase. All rights reserved.</p>
          <div className="foot-mini">
            <Link to="/">Privacy</Link>
            <Link to="/">Terms</Link>
            <Link to="/">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
