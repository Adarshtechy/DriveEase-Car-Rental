import "./HomeHero.css";

const HomeHero = () => {
    return (
        <>
            <section className="homehero">

                {/* Dark Overlay */}
                <div className="homehero-overlay"></div>
                <div className="homehero-container">

                    {/* Left Content */}
                    <div className="homehero-left">
                        <span className="homehero-badge">
                            Premium Car Rental
                        </span>

                        <h1>
                            Find The Perfect Car
                            <br />
                            For <span>Your Journey</span>
                        </h1>

                        <p>
                            Explore a wide range of luxury, SUV and economy cars.
                            Book instantly with transparent pricing and enjoy
                            a smooth driving experience.
                        </p>

                        <div className="homehero-buttons">
                            <button className="homehero-btn-primary">
                                Browse Cars
                            </button>
                            <button className="homehero-btn-secondary">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default HomeHero;