import "./ContactHero.css";
import { FiHeadphones, FiClock, FiShield, FiUsers } from "react-icons/fi";

const items = [
    { icon: <FiHeadphones />, title: "24/7 Support", desc: "We're always here to assist you" },
    { icon: <FiClock />, title: "Quick Response", desc: "We reply within minutes" },
    { icon: <FiShield />, title: "Trusted Service", desc: "Your satisfaction is our priority" },
    { icon: <FiUsers />, title: "Expert Team", desc: "Professionals ready to help" },
];

const ContactHero = () => {
    return (
        <section className="ct">
            <div className="ct-bg">
                <img src="/assets/bg-img/contact-bg.jpg" alt="Contact DriveEase" />
            </div>

            <div className="ct-overlay"></div>

            <div className="ct-wrap fade-up">
                <span className="ct-badge">CONTACT US</span>

                <h1>
                    We’re Here to Help <br />
                    You on <span>Every Journey</span>
                </h1>

                <p>
                    Have questions or need assistance? Our support team is ready
                    to guide you anytime.
                </p>

                <div className="ct-grid">
                    {items.map((item, i) => (
                        <div key={i} className="ct-card">
                            <div className="ct-icon">{item.icon}</div>
                            <div>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ContactHero;