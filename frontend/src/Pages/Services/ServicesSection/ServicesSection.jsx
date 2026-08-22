import "./ServicesSection.css";
import { Link } from "react-router-dom";
import {
    FiStar, FiTruck, FiUsers, FiZap, FiBriefcase,
    FiUser, FiCalendar, FiHeart, FiShield, FiClock,
    FiCheckCircle, FiSearch, FiMapPin, FiKey,
} from "react-icons/fi";
import { FaCar, FaPlane } from "react-icons/fa";


const services = [
    { icon: <FiStar />, image: "/assets/services-img/image1.png", title: "Luxury Rental", desc: "Premium high-end cars for special drives." },
    { icon: <FiTruck />, image: "/assets/services-img/image2.png", title: "SUV Rental", desc: "Spacious and powerful for any trip." },
    { icon: <FiUsers />, image: "/assets/services-img/image3.png", title: "Sedan Rental", desc: "Comfortable daily & business rides." },
    { icon: <FiZap />, image: "/assets/services-img/image4.png", title: "Hatchback Rental", desc: "Compact and fuel efficient cars." },
    { icon: <FaCar />, image: "/assets/services-img/image5.png", title: "Self Drive", desc: "Drive freely at your own pace." },
    { icon: <FaPlane />, image: "/assets/services-img/image6.png", title: "Airport Transfer", desc: "On-time pickup & drop service." },
];

const benefits = [
    { icon: <FiShield />, title: "No Hidden Charges" },
    { icon: <FiClock />, title: "Flexible Booking" },
    { icon: <FiCheckCircle />, title: "Sanitized Cars" },
    { icon: <FiStar />, title: "Secure Payment" },
];

const steps = [
    { icon: <FiSearch />, title: "Choose Car", desc: "Browse and select your vehicle." },
    { icon: <FiMapPin />, title: "Pick Date", desc: "Select pickup & return dates." },
    { icon: <FiKey />, title: "Book & Drive", desc: "Confirm and enjoy your ride." },
];

const ServicesSections = () => {
    return (
        <>
            {/* Services */}
            <section className="ss sec fade-up">
                <div className="ss-head">
                    <span>WHAT WE OFFER</span>
                    <h2>Our Rental Services</h2>
                </div>

                <div className="ss-grid">
                    {services.map((item, i) => (
                        <div key={i} className="ss-card">
                            <img src={item.image} alt={item.title} />
                            <div className="ss-body">
                                <div className="ss-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <Link to="/cars">Learn More</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits */}
            <section className="ss alt fade-up">
                <div className="ss-head">
                    <span>WHY CHOOSE US</span>
                    <h2>Your Journey, Our Priority</h2>
                </div>

                <div className="bn-grid">
                    {benefits.map((b, i) => (
                        <div key={i} className="bn-card">
                            <div className="bn-icon">{b.icon}</div>
                            <h4>{b.title}</h4>
                        </div>
                    ))}
                </div>
            </section>

            {/* Steps */}
            <section className="ss sec fade-up">
                <div className="ss-head">
                    <span>HOW IT WORKS</span>
                    <h2>Rent in 3 Easy Steps</h2>
                </div>

                <div className="st-grid">
                    {steps.map((s, i) => (
                        <div key={i} className="st-card">
                            <div className="st-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default ServicesSections;