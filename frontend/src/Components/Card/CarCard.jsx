import { FiHeart, FiSettings, FiDroplet, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./CarCard.css";

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  if (!car) return null;

  const name = `${car.brand || ""} ${car.model || ""}`.trim() || "Unknown Car";

  const price = car.pricePerDay || 0;
  const rating = car.rating || 0;
  const reviews = car.reviews || 0;
  const transmission = car.transmission || "Automatic";
  const fuelType = car.fuelType || "Petrol";
  const seats = car.seats || 5;

  const imageUrl =
    car.image || "https://via.placeholder.com/400x250?text=No+Image";

  const handleCardClick = () => {
    if (!car._id) {
      console.error("Car ID is missing:", car);
      return;
    }

    navigate(`/cars/${car._id}`);
  };

  return (
    <div className="car-card">
      {/* Car Image */}
      <div className="car-card__image">
        <img src={imageUrl} alt={name} />
      </div>

      {/* Car Information */}
      <div className="car-card__info">
        <h3 className="car-card__name">{name}</h3>

        <div className="car-card__price">
          ₹{price.toLocaleString()}
          <span>/ day</span>
        </div>

        <div className="car-card__rating">
          ★ {rating}
          <span>({reviews})</span>
        </div>

        <div className="car-card__specs">
          <div className="spec">
            <FiSettings className="spec-icon" />
            <span>{transmission}</span>
          </div>

          <div className="spec">
            <FiDroplet className="spec-icon" />
            <span>{fuelType}</span>
          </div>

          <div className="spec">
            <FiUsers className="spec-icon" />
            <span>{seats} Seater</span>
          </div>
        </div>

        <button
          type="button"
          className="car-card__btn"
          onClick={handleCardClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CarCard;
