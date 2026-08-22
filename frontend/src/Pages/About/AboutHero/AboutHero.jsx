import "./AboutHero.css";
import { FiUsers, FiAward, FiHeadphones } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import { Link } from "react-router-dom";

const items = [
    { icon: <FiUsers />, text: "Trusted by 10K+ Customers" },
    { icon: <FaCar />, text: "Wide Range of Vehicles" },
    { icon: <FiAward />, text: "Best Prices Guaranteed" },
    { icon: <FiHeadphones />, text: "24/7 Customer Support" },
];

const AboutHero = () => {
    return (
        <section className="ab">
            <div className="ab-bg">
                <img src="./assets/bg-img/about-bg.jpg" alt="About DriveEase" />
            </div>

            <div className="ab-overlay"></div>

            <div className="ab-wrap fade-up">
                <span className="ab-badge">ABOUT US</span>

                <h1>
                    Driven by Passion,<br />
                    Committed to <span>Your Journey</span>
                </h1>

                <p>
                    We make car rental simple, reliable, and enjoyable.
                    Every journey with us is built on trust, quality, and comfort.
                </p>

                <div className="ab-grid">
                    {items.map((item, i) => (
                        <div key={i} className="ab-card">
                            <div className="ab-icon">{item.icon}</div>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>

                <Link to="/cars" className="ab-btn">
                    Explore Our Fleet
                </Link>
            </div>
        </section>
    );
};

export default AboutHero;