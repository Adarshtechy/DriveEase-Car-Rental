import "./ServicesHero.css";
import { FiDollarSign, FiTool, FiHeadphones, FiCalendar } from "react-icons/fi";
import { Link } from "react-router-dom";

const items = [
    { icon: <FiDollarSign />, title: "Best Prices", desc: "Affordable rates guaranteed" },
    { icon: <FiTool />, title: "Well Maintained", desc: "Clean & serviced vehicles" },
    { icon: <FiHeadphones />, title: "24/7 Support", desc: "Support anytime you need" },
    { icon: <FiCalendar />, title: "Easy Booking", desc: "Quick & hassle-free process" },
];

const ServicesHero = () => {
    return (
        <section className="srv">
            <div className="srv-bg">
                <img src="./assets/bg-img/services-bg.jpg" alt="Car Rental Services" />
            </div>

            <div className="srv-overlay"></div>

            <div className="srv-wrap fade-up">
                <span className="srv-badge">OUR SERVICES</span>

                <h1>
                    Premium Car Rental <br />
                    For <span>Every Journey</span>
                </h1>

                <p>
                    From daily drives to luxury trips, we provide reliable and
                    comfortable vehicles tailored to your needs.
                </p>

                <div className="srv-grid">
                    {items.map((item, i) => (
                        <div key={i} className="srv-card">
                            <div className="srv-icon">{item.icon}</div>
                            <div>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Link to="/cars" className="srv-btn">
                    Explore All Services
                </Link>
            </div>
        </section>
    );
};

export default ServicesHero;