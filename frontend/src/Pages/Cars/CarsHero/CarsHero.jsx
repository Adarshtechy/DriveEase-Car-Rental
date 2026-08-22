import { Link } from "react-router-dom";
import "./CarsHero.css";

const CarsHero = () => {
    return (
        <section className="cars-hero">
            <div className="cars-hero__overlay"></div>

            <div className="cars-hero__container">
                <div className="cars-hero__content">

                    {/* New Heading */}
                    <h1 className="cars-hero__title">
                        Discover Your <span>Dream Drive</span>
                    </h1>

                    {/* New Description */}
                    <p className="cars-hero__subtitle">
                        Handpicked collection of luxury, performance, and economy cars.
                        Enjoy flexible rental plans, 24/7 support, and zero hidden fees.
                    </p>

                    {/* Updated Buttons */}
                    <div className="cars-hero__buttons">
                        <button className="cars-hero__btn-primary">
                            Explore Our Fleet
                        </button>
                        <button className="cars-hero__btn-secondary">
                            Special Offers
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CarsHero;