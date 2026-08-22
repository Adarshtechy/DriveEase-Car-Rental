import "./WhyChoose.css";
import { FiShield, FiClock, FiTool, FiLock, FiSearch, FiCalendar, FiKey } from "react-icons/fi";
import { Link } from "react-router-dom";

const features = [
    {
        icon: <FiShield />,
        title: "No Hidden Charges",
        desc: "Transparent pricing with zero surprises.",
    },
    {
        icon: <FiClock />,
        title: "Flexible Cancellation",
        desc: "Modify or cancel bookings easily.",
    },
    {
        icon: <FiTool />,
        title: "Well Maintained Cars",
        desc: "Regularly serviced & inspected vehicles.",
    },
    {
        icon: <FiLock />,
        title: "Secure Payments",
        desc: "Safe and trusted payment methods.",
    },
];

const steps = [
    {
        no: "01",
        icon: <FiSearch />,
        title: "Search Car",
        desc: "Browse from our wide collection.",
    },
    {
        no: "02",
        icon: <FiCalendar />,
        title: "Select Dates",
        desc: "Choose pickup & return dates.",
    },
    {
        no: "03",
        icon: <FiKey />,
        title: "Book & Drive",
        desc: "Confirm and enjoy your ride.",
    },
];

const WhyChoose = () => {
    return (
        <>
            {/* Why Choose */}
            <section className="wc sec fade-up">
                <div className="wc-head">
                    <h2>Why Choose DriveEase?</h2>
                    <p>Comfort, reliability and transparency in every ride.</p>
                </div>

                <div className="wc-grid">
                    {features.map((item, i) => (
                        <div key={i} className="wc-card">
                            <div className="wc-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="wc-btn-wrap">
                    <Link to="/about" className="wc-btn">
                        Learn More
                    </Link>
                </div>
            </section>

            {/* How it Works */}
            <section className="wc alt fade-up">
                <div className="wc-head">
                    <h2>How It Works</h2>
                    <p>Rent a car in three simple steps</p>
                </div>

                <div className="wk-grid">
                    {steps.map((s, i) => (
                        <div key={i} className="wk-card">
                            <div className="wk-no">{s.no}</div>
                            <div className="wk-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default WhyChoose;