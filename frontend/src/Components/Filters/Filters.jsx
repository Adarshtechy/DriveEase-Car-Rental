import { useState, useEffect, useMemo, useCallback } from "react";
import { FiSearch, FiDollarSign, FiRotateCcw, FiTag, FiDroplet, FiSettings, FiUsers } from "react-icons/fi";
import "./Filters.css";

const Filters = ({ cars = [], onFilterChange = () => { } }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([1000, 20000]);
    const [selectedBrands, setSelectedBrands] = useState(["All Brands"]);
    const [selectedFuel, setSelectedFuel] = useState([]);
    const [selectedTransmission, setSelectedTransmission] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showAllBrands, setShowAllBrands] = useState(false);

    const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
    const transmissions = ["Automatic", "Manual"];
    const seatOptions = [4, 5, 7];

    // Safe brands calculation (fixes the forEach error)
    const brandsData = useMemo(() => {
        if (!Array.isArray(cars)) return [];
        const counts = {};
        cars.forEach((car) => {
            if (car?.brand) {
                counts[car.brand] = (counts[car.brand] || 0) + 1;
            }
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [cars]);

    const visibleBrands = showAllBrands ? brandsData : brandsData.slice(0, 5);

    const filteredCars = useMemo(() => {
        if (!Array.isArray(cars)) return [];

        return cars.filter((car) => {
            if (!car) return false;

            // Search
            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                if (
                    !car.brand?.toLowerCase().includes(term) &&
                    !car.model?.toLowerCase().includes(term) &&
                    !car.category?.toLowerCase().includes(term)
                ) {
                    return false;
                }
            }

            // Price
            const price = car.pricePerDay || 0;
            if (price < priceRange[0] || price > priceRange[1]) return false;

            // Brand
            if (!selectedBrands.includes("All Brands") && !selectedBrands.includes(car.brand)) {
                return false;
            }

            // Other filters
            if (selectedFuel.length > 0 && !selectedFuel.includes(car.fuelType)) return false;
            if (selectedTransmission.length > 0 && !selectedTransmission.includes(car.transmission)) return false;
            if (selectedSeats.length > 0 && !selectedSeats.includes(car.seats)) return false;

            return true;
        });
    }, [cars, searchTerm, priceRange, selectedBrands, selectedFuel, selectedTransmission, selectedSeats]);

    useEffect(() => {
        onFilterChange(filteredCars);
    }, [filteredCars, onFilterChange]);

    const handleBrandChange = (brand) => {
        if (brand === "All Brands") {
            setSelectedBrands(["All Brands"]);
            return;
        }
        let updated = selectedBrands.filter((b) => b !== "All Brands");
        if (updated.includes(brand)) {
            updated = updated.filter((b) => b !== brand);
            if (updated.length === 0) updated = ["All Brands"];
        } else {
            updated.push(brand);
        }
        setSelectedBrands(updated);
    };

    const toggleSelection = (value, state, setState) => {
        setState((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    const resetFilters = () => {
        setSearchTerm("");
        setPriceRange([1000, 20000]);
        setSelectedBrands(["All Brands"]);
        setSelectedFuel([]);
        setSelectedTransmission([]);
        setSelectedSeats([]);
        setShowAllBrands(false);
    };

    return (
        <aside className="filters">
            <div className="filters__header">
                <h2>Filters</h2>
                <button className="clear-all" onClick={resetFilters}>
                    Clear All
                </button>
            </div>

            {/* Search */}
            <div className="filter-section">
                <label className="section-label">Search</label>
                <div className="search-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
                <label className="section-label">Price Range</label>
                <div className="price-values">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}+</span>
                </div>
                <div className="range-wrapper">
                    <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="range-slider"
                    />
                    <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="range-slider"
                    />
                </div>
            </div>

            {/* Brand */}
            <div className="filter-section">
                <label className="section-label">
                    <FiTag /> Brand
                </label>
                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes("All Brands")}
                            onChange={() => handleBrandChange("All Brands")}
                        />
                        <span>All Brands</span>
                    </label>
                    {visibleBrands.map(([brand, count]) => (
                        <label key={brand} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                            />
                            <span>
                                {brand} <span className="count">({count})</span>
                            </span>
                        </label>
                    ))}
                </div>
                {brandsData.length > 5 && (
                    <button className="show-more" onClick={() => setShowAllBrands(!showAllBrands)}>
                        {showAllBrands ? "Show less ↑" : "Show more ↓"}
                    </button>
                )}
            </div>

            {/* Fuel Type */}
            <div className="filter-section">
                <label className="section-label">
                    <FiDroplet /> Fuel Type
                </label>
                <div className="checkbox-group">
                    {fuelTypes.map((fuel) => (
                        <label key={fuel} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedFuel.includes(fuel)}
                                onChange={() => toggleSelection(fuel, selectedFuel, setSelectedFuel)}
                            />
                            <span>{fuel}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Transmission */}
            <div className="filter-section">
                <label className="section-label">
                    <FiSettings /> Transmission
                </label>
                <div className="checkbox-group">
                    {transmissions.map((type) => (
                        <label key={type} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedTransmission.includes(type)}
                                onChange={() => toggleSelection(type, selectedTransmission, setSelectedTransmission)}
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Seating Capacity */}
            <div className="filter-section">
                <label className="section-label">
                    <FiUsers /> Seating Capacity
                </label>
                <div className="checkbox-group">
                    {seatOptions.map((seat) => (
                        <label key={seat} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selectedSeats.includes(seat)}
                                onChange={() => toggleSelection(seat, selectedSeats, setSelectedSeats)}
                            />
                            <span>{seat} Seater</span>
                        </label>
                    ))}
                </div>
            </div>

            <button className="reset-btn" onClick={resetFilters}>
                <FiRotateCcw /> Reset Filters
            </button>
        </aside>
    );
};

export default Filters;