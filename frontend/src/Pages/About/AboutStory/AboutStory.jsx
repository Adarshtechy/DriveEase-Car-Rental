import "./AboutStory.css";
import {
    FiUsers, FiMapPin, FiAward, FiShield,
    FiStar, FiUser, FiHeart,
} from "react-icons/fi";
import { FaCar, FaRocket } from "react-icons/fa";


const stats = [
    { icon: <FiUsers />, num: "10K+", label: "Happy Customers" },
    { icon: <FaCar />, num: "500+", label: "Cars Available" },
    { icon: <FiMapPin />, num: "25+", label: "Locations" },
    { icon: <FiAward />, num: "5+", label: "Years Experience" },
];

const values = [
    { icon: <FiShield />, title: "Trust", desc: "Clear pricing and honest service." },
    { icon: <FiStar />, title: "Quality", desc: "Well-maintained and safe vehicles." },
    { icon: <FiUser />, title: "Customer First", desc: "Your comfort is our priority." },
    { icon: <FaRocket />, title: "Innovation", desc: "Improving experience every day." },
    { icon: <FiHeart />, title: "Passion", desc: "We love making travel better." },
];

const AboutStory = () => {
    return (
        <>
            {/* Story */}
            <section className="as sec fade-up">
                <div className="as-wrap">
                    <div className="as-img">
                        <img src="/assets/overviews-img/about-story-car.jpg" alt="Our Journey" />
                        <div className="as-badge">
                            <strong>5+</strong>
                            <span>Years Excellence</span>
                        </div>
                    </div>

                    <div className="as-text">
                        <span className="tag">OUR STORY</span>
                        <h2>The Journey of DriveEase</h2>
                        <p>
                            DriveEase was built to make car rentals simple, transparent and
                            reliable. No hidden fees, no confusion — just smooth travel.
                        </p>
                        <p>
                            Today, we proudly serve thousands of customers across multiple
                            cities with a growing fleet of premium vehicles.
                        </p>

                        <div className="as-stats">
                            {stats.map((s, i) => (
                                <div key={i} className="stat">
                                    <div className="stat-ic">{s.icon}</div>
                                    <h4>{s.num}</h4>
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="as alt fade-up">
                <div className="as-head">
                    <span className="tag">OUR VALUES</span>
                    <h2>What Drives Us</h2>
                </div>

                <div className="val-grid">
                    {values.map((v, i) => (
                        <div key={i} className="val-card">
                            <div className="val-ic">{v.icon}</div>
                            <h3>{v.title}</h3>
                            <p>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default AboutStory;