import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CarsHero from "./CarsHero/CarsHero";
import Filters from "../../Components/Filters/Filters";
import CarCard from "../../Components/Card/CarCard";
import "./Cars.css";

const CATEGORIES = [
  "All Cars",
  "SUV",
  "Sedan",
  "Hatchback",
  "Luxury",
  "Electric",
];

const CarsPage = () => {
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Cars");
  const [sortOption, setSortOption] = useState("popularity");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 9;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_Backend_Url}/api/cars`,
        );

        setAllCars(data.cars);
        setFilteredCars(data.cars);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars. Please try again.");
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Apply category filter + sorting
  const displayedCars = useMemo(() => {
    let result = [...filteredCars];

    // Category Filter
    if (activeCategory !== "All Cars") {
      result = result.filter(
        (car) =>
          (car.category || "").toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    // Sorting
    if (sortOption === "price-low") {
      result.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    } else if (sortOption === "price-high") {
      result.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    } else if (sortOption === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Popularity
      result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    return result;
  }, [filteredCars, activeCategory, sortOption]);

  // Pagination
  const totalPages = Math.ceil(displayedCars.length / carsPerPage);

  const startIndex = (currentPage - 1) * carsPerPage;

  const currentCars = displayedCars.slice(startIndex, startIndex + carsPerPage);

  // Filter Change
  const handleFilterChange = (newFilteredCars) => {
    setFilteredCars(newFilteredCars);

    // Go back to page 1 whenever filters change
    setCurrentPage(1);
  };

  // Category Change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);

    // Go back to page 1 whenever category changes
    setCurrentPage(1);
  };

  // Sort Change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);

    // Go back to page 1 whenever sorting changes
    setCurrentPage(1);
  };

  // Loading / Error
  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <CarsHero />
      <div className="cars-page">
        <div className="cars-page__container">
          {/* Filters Sidebar */}
          <Filters cars={allCars} onFilterChange={handleFilterChange} />

          {/* Main Content */}
          <div className="cars-page__main">
            {/* Category Tabs */}
            <div className="category-tabs">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`tab-btn ${
                    activeCategory === cat ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results Header */}
            <div className="cars-page__header">
              <p className="cars-page__results">
                Showing{" "}
                <strong>
                  {displayedCars.length === 0 ? 0 : startIndex + 1}-
                  {Math.min(startIndex + carsPerPage, displayedCars.length)}
                </strong>{" "}
                of <strong>{displayedCars.length}</strong> results
              </p>

              <div className="cars-page__sort">
                <span>Sort by:</span>
                <select value={sortOption} onChange={handleSortChange}>
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Car Display */}
            <div className="car-content">
              {currentCars.map((car) => (
                <CarCard key={car._id || car.id} car={car} />
              ))}
            </div>

            {/* No Results */}
            {displayedCars.length === 0 && (
              <p className="no-results">No cars match your selected filters.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="cars-page__pagination">
                {/* Previous Button */}
                <button
                  className="cars-page__next"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <button
                      key={pageNumber}
                      className={`cars-page__page-btn ${
                        currentPage === pageNumber ? "active" : ""
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  className="cars-page__next"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CarsPage;
