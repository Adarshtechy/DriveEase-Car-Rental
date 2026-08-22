import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiSettings,
  FiDroplet,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import "./CarDetails.css";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [pickupDate, setPickupDate] = useState("2025-05-20");
  const [returnDate, setReturnDate] = useState("2025-05-22");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const backendUrl = import.meta.env.VITE_Backend_Url;
        const { data } = await axios.get(`${backendUrl}/api/cars/${id}`);
        const carData = data?.car || data;

        setCar(carData);
        setMainImage(carData?.image || ""); 
      } catch (err) {
        console.error("Error fetching car:", err);
        setError("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const difference = (returnD - pickup) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.ceil(difference));
  };

  const totalPrice = car ? (Number(car.pricePerDay) || 0) * calculateDays() : 0;

  if (loading) return <div className="loading">Loading car details...</div>;
  if (error || !car)
    return <div className="error">{error || "Car not found."}</div>;

  // Safe gallery handling
  const galleryImages = Array.isArray(car.gallery) ? car.gallery : [];
  const allImages = [car.image, ...galleryImages].filter(
    (img) => typeof img === "string" && img.trim() !== "",
  );

  return (
    <div className="car-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to="/cars">Cars</Link>
        <span> / </span>
        <span className="current">
          {car.brand} {car.model}
        </span>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back to Cars
      </button>

      <div className="car-details-container">
        {/* Image Section */}
        <div className="image-section">
          <div className="main-image-container">
            <img
              src={
                mainImage ||
                "https://via.placeholder.com/800x500?text=Car+Image"
              }
              alt={`${car.brand} ${car.model}`}
            />
            {car.pricePerDay < 6000 && (
              <div className="discount-tag">30% OFF</div>
            )}
          </div>

          <div className="thumbnail-list">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`View ${index + 1}`}
                className={`thumbnail ${mainImage === img ? "active" : ""}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info & Booking Section */}
        <div className="info-section">
          <h1 className="car-title">
            {car.brand} {car.model}
          </h1>

          <div className="rating">
            ★ {car.rating || 4.5} <span>({car.reviews || 0} Reviews)</span>
          </div>

          <div className="price-section">
            <span className="price">
              ₹{(Number(car.pricePerDay) || 0).toLocaleString()}
            </span>
            <span className="price-label">/ day</span>
            <span className="original-price">
              ₹
              {Math.round(
                (Number(car.pricePerDay) || 0) * 1.3,
              ).toLocaleString()}
            </span>
            <span className="stock-badge">In Stock</span>
          </div>

          <div className="specs-grid">
            <div className="spec">
              <FiSettings /> {car.transmission || "N/A"}
            </div>
            <div className="spec">
              <FiDroplet /> {car.fuelType || "N/A"}
            </div>
            <div className="spec">
              <FiUsers /> {car.seats || 5} Seater
            </div>
            <div className="spec">
              <FiCalendar /> {car.year || "N/A"}
            </div>
          </div>

          <div className="booking-card">
            <h3>Book This Car</h3>

            <div className="date-inputs">
              <div>
                <label htmlFor="pickup-date">Pickup Date</label>
                <input
                  id="pickup-date"
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="return-date">Return Date</label>
                <input
                  id="return-date"
                  type="date"
                  min={pickupDate || new Date().toISOString().split("T")[0]}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>

            <div className="total-price">
              <span>
                Total Price ({calculateDays()}{" "}
                {calculateDays() === 1 ? "day" : "days"})
              </span>

              <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
            </div>

            <button
              className="book-now-btn"
              disabled={!pickupDate || !returnDate || calculateDays() <= 0}
              onClick={() =>
                navigate(`/booking/${car._id}`, {
                  state: {
                    pickupDate,
                    returnDate,
                  },
                })
              }
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* About & Features */}
      <div className="about-section">
        <h2>About Car</h2>
        <p>{car.description || "No description available."}</p>

        <h2>Features</h2>
        <div className="features-list">
          {Array.isArray(car.features) && car.features.length > 0 ? (
            car.features.map((feature, i) => (
              <span key={i} className="feature-item">
                {feature}
              </span>
            ))
          ) : (
            <p>No features listed for this car.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
