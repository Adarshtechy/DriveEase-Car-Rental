import "./Fleet.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";


const cars = [
    { id: 1, name: "BMW X5", image: "./assets/fleet-img/BMW X5.jpg", price: "₹5,499", fuel: "Diesel", trans: "Auto", rating: "4.8" },
    { id: 2, name: "Audi A6", image: "./assets/fleet-img/Audi A6.jpg", price: "₹4,999", fuel: "Petrol", trans: "Auto", rating: "4.6" },
    { id: 3, name: "Toyota Fortuner", image: "./assets/fleet-img/Toyota Fortuner.jpg", price: "₹6,999", fuel: "Diesel", trans: "Manual", rating: "4.5" },
    { id: 4, name: "Hyundai Creta", image: "./assets/fleet-img/Hyundai Creta.jpg", price: "₹5,499", fuel: "Petrol", trans: "Manual", rating: "4.5" },
    { id: 5, name: "Mercedes C-Class", image: "./assets/fleet-img/Mercedes C-Class.jpg", price: "₹7,999", fuel: "Diesel", trans: "Auto", rating: "4.7" },
    { id: 6, name: "Tesla Model 3", image: "./assets/fleet-img/Tesla Model 3.jpg", price: "₹8,499", fuel: "Electric", trans: "Auto", rating: "4.9" },
];

const Fleet = () => {
    const [index, setIndex] = useState(0);
    const visible = 3;

    const next = () => {
        setIndex((prev) => (prev + 1) % cars.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + cars.length) % cars.length);
    };

    const visibleCars = cars.slice(index, index + visible).length === visible
        ? cars.slice(index, index + visible)
        : [...cars.slice(index), ...cars.slice(0, visible - (cars.length - index))];

    return (
        <section className="fleet">
            <div className="fleet-wrap">

                <div className="fleet-head">
                    <h2>Our Premium Fleet</h2>
                    <p>Choose from our best luxury collection</p>
                </div>

                <div className="fleet-slider">
                    <button className="fleet-btn left" onClick={prev}>
                        <FiChevronLeft />
                    </button>

                    <div className="fleet-track">
                        {visibleCars.map((car) => (
                            <div key={car.id} className="fleet-card fade">
                                <div className="fleet-img">
                                    <img src={car.image} alt={car.name} />
                                    <span className="fleet-rate">
                                        <FiStar /> {car.rating}
                                    </span>
                                </div>

                                <div className="fleet-info">
                                    <h3>{car.name}</h3>
                                    <p>{car.trans} • {car.fuel}</p>
                                    <div className="fleet-price">
                                        {car.price} <span>/day</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="fleet-btn right" onClick={next}>
                        <FiChevronRight />
                    </button>
                </div>

                <div className="fleet-link">
                    <Link to="/cars">View All Cars</Link>
                </div>

            </div>
        </section>
    );
};

export default Fleet;