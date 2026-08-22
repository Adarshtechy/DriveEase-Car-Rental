import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiX,
  FiSave,
  FiImage,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { FaCar } from "react-icons/fa";

import "./AdminCars.css";

const API_URL = `${import.meta.env.VITE_Backend_Url}/api/admin/cars`;

const initialFormData = {
  brand: "",
  model: "",
  year: "",
  category: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  seats: 5,
  doors: 4,
  luggage: 2,
  mileage: "",
  color: "",
  location: "",
  pricePerDay: "",
  rating: 0,
  reviews: 0,
  available: true,
  image: "",
  gallery: "",
  features: "",
  description: "",
};

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch Cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCars(response.data.cars || []);
      } else {
        setError(response.data.message || "Unable to load cars.");
      }
    } catch (error) {
      console.error("Admin Cars API Error:", error);

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Unable to load cars from the server.",
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please make sure the backend is running.",
        );
      } else {
        setError("Something went wrong while loading cars.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Search
  const filteredCars = cars.filter((car) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) return true;

    return (
      `${car.brand} ${car.model}`.toLowerCase().includes(searchValue) ||
      car.category?.toLowerCase().includes(searchValue) ||
      car.fuelType?.toLowerCase().includes(searchValue) ||
      car.transmission?.toLowerCase().includes(searchValue) ||
      car.location?.toLowerCase().includes(searchValue)
    );
  });

  // Format Price
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}/day`;
  };

  // Car Name
  const getCarName = (car) => {
    return `${car.brand} ${car.model}`;
  };

  // Handle Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingCar(null);
    setFormData(initialFormData);
    setFormError("");
    setShowModal(true);
  };

  //  Open Edit Modal
  const openEditModal = (car) => {
    setEditingCar(car);

    setFormData({
      brand: car.brand || "",
      model: car.model || "",
      year: car.year || "",
      category: car.category || "",
      transmission: car.transmission || "Automatic",
      fuelType: car.fuelType || "Petrol",
      seats: car.seats || 5,
      doors: car.doors || 4,
      luggage: car.luggage || 2,
      mileage: car.mileage || "",
      color: car.color || "",
      location: car.location || "",
      pricePerDay: car.pricePerDay || "",
      rating: car.rating ?? 0,
      reviews: car.reviews ?? 0,
      available: car.available ?? true,
      image: car.image || "",
      gallery: Array.isArray(car.gallery)
        ? car.gallery.join("\n")
        : car.gallery || "",
      features: Array.isArray(car.features)
        ? car.features.join(", ")
        : car.features || "",
      description: car.description || "",
    });

    setFormError("");
    setShowModal(true);
  };

  //  Close Modal
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCar(null);
    setFormData(initialFormData);
    setFormError("");
  };

  // Prepare form Data
  const preparePayload = () => {
    return {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      year: Number(formData.year),
      category: formData.category.trim(),
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      seats: Number(formData.seats),
      doors: Number(formData.doors),
      luggage: Number(formData.luggage),
      mileage: formData.mileage.trim(),
      color: formData.color.trim(),
      location: formData.location.trim(),
      pricePerDay: Number(formData.pricePerDay),
      rating: Number(formData.rating || 0),
      reviews: Number(formData.reviews || 0),
      available: formData.available,
      image: formData.image.trim(),
      gallery: formData.gallery
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      features: formData.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: formData.description.trim(),
    };
  };

  // Validate Form
  const validateForm = () => {
    if (!formData.brand.trim()) {
      return "Brand is required.";
    }

    if (!formData.model.trim()) {
      return "Model is required.";
    }

    if (!formData.year) {
      return "Year is required.";
    }

    if (Number(formData.year) < 1900 || Number(formData.year) > 2100) {
      return "Please enter a valid vehicle year.";
    }

    if (!formData.category.trim()) {
      return "Category is required.";
    }

    if (!formData.mileage.trim()) {
      return "Mileage is required.";
    }

    if (!formData.color.trim()) {
      return "Color is required.";
    }

    if (!formData.location.trim()) {
      return "Location is required.";
    }

    if (formData.pricePerDay === "" || Number(formData.pricePerDay) < 0) {
      return "Please enter a valid price per day.";
    }

    if (!formData.image.trim()) {
      return "Main car image URL is required.";
    }

    if (!formData.description.trim()) {
      return "Description is required.";
    }

    if (Number(formData.seats) < 2) {
      return "Seats must be at least 2.";
    }

    if (Number(formData.rating) < 0 || Number(formData.rating) > 5) {
      return "Rating must be between 0 and 5.";
    }

    return "";
  };

  // Create / Update Car
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const token = getToken();

      if (!token) {
        setFormError("Authentication token not found. Please login again.");
        return;
      }

      const payload = preparePayload();

      let response;

      if (editingCar) {
        response = await axios.put(`${API_URL}/${editingCar._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        response = await axios.post(API_URL, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            `Failed to ${editingCar ? "update" : "create"} car.`,
        );
      }

      await fetchCars();
      closeModal();
    } catch (error) {
      console.error("Save car error:", error);

      setFormError(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${editingCar ? "update" : "create"} car.`,
      );
    } finally {
      setSaving(false);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (car) => {
    setCarToDelete(car);
    setShowDeleteModal(true);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    if (deleting) return;

    setShowDeleteModal(false);
    setCarToDelete(null);
  };

  // Delete Car
  const handleDelete = async () => {
    if (!carToDelete) return;

    try {
      setDeleting(true);

      const token = getToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.delete(`${API_URL}/${carToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete car.");
      }

      setCars((prevCars) =>
        prevCars.filter((car) => car._id !== carToDelete._id),
      );

      closeDeleteModal();
    } catch (error) {
      console.error("Delete car error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete car.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="admin-cars-page">
        <div className="admin-cars-loading">
          <div className="admin-loading-spinner"></div>

          <h2>Loading cars...</h2>

          <p>Please wait while we fetch your vehicle fleet.</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="admin-cars-page">
        <div className="admin-cars-error">
          <div className="admin-error-icon">
            <FiAlertCircle />
          </div>

          <h2>Unable to load cars</h2>

          <p>{error}</p>

          <button type="button" className="admin-retry-btn" onClick={fetchCars}>
            <FiRefreshCw />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cars-page">
      {/* Header */}
      <div className="admin-cars-header">
        <div>
          <span className="admin-page-label">FLEET MANAGEMENT</span>

          <h1>Cars</h1>

          <p>Manage your vehicle fleet and availability.</p>
        </div>

        <button
          type="button"
          className="admin-add-car-btn"
          onClick={openAddModal}
        >
          <FiPlus />
          Add New Car
        </button>
      </div>

      {/* Main Card */}
      <div className="admin-cars-card">
        <div className="admin-cars-toolbar">
          <div className="admin-search-box">
            <FiSearch />

            <input
              type="text"
              placeholder="Search cars, brand, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-cars-count">
            <strong>{filteredCars.length}</strong>

            <span>{filteredCars.length === 1 ? "vehicle" : "vehicles"}</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredCars.length === 0 ? (
          <div className="admin-cars-empty">
            <div className="admin-empty-icon">
              <FaCar />
            </div>

            <h3>{cars.length === 0 ? "No cars found" : "No matching cars"}</h3>

            <p>
              {cars.length === 0
                ? "Your vehicle fleet is currently empty."
                : "Try changing your search."}
            </p>

            {cars.length === 0 && (
              <button
                type="button"
                className="admin-empty-add-btn"
                onClick={openAddModal}
              >
                <FiPlus />
                Add Your First Car
              </button>
            )}
          </div>
        ) : (
          <div className="admin-cars-table-wrapper">
            <table className="admin-cars-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>Fuel</th>
                  <th>Transmission</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car._id}>
                    <td>
                      <div className="admin-car-name">
                        <div className="admin-car-image">
                          {car.image ? (
                            <img src={car.image} alt={getCarName(car)} />
                          ) : (
                            <FaCar />
                          )}
                        </div>

                        <div className="admin-car-info">
                          <strong>{getCarName(car)}</strong>
                          <span>{car.year}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="admin-table-text">{car.category}</span>
                    </td>

                    <td>
                      <span className="admin-table-text">{car.fuelType}</span>
                    </td>

                    <td>
                      <span className="admin-table-text">
                        {car.transmission}
                      </span>
                    </td>

                    <td>
                      <strong className="admin-car-price">
                        {formatPrice(car.pricePerDay)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`admin-car-status ${
                          car.available ? "available" : "unavailable"
                        }`}
                      >
                        <span className="status-dot"></span>

                        {car.available ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-car-actions">
                        <button
                          type="button"
                          title="Edit car"
                          className="edit"
                          onClick={() => openEditModal(car)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          title="Delete car"
                          className="delete"
                          onClick={() => openDeleteModal(car)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="admin-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="admin-car-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-modal-label">
                  {editingCar ? "UPDATE VEHICLE" : "FLEET MANAGEMENT"}
                </span>

                <h2>{editingCar ? "Edit Car" : "Add New Car"}</h2>

                <p>
                  {editingCar
                    ? "Update the vehicle information below."
                    : "Add a new vehicle to your fleet."}
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <FiX />
              </button>
            </div>

            <form className="admin-car-form" onSubmit={handleSubmit}>
              {formError && (
                <div className="admin-form-error">
                  <FiAlertCircle />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Information */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FaCar />
                  <div>
                    <h3>Basic Information</h3>
                    <p>Enter the main vehicle details.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>
                      Brand <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="e.g. Toyota"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Model <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      placeholder="e.g. Camry"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Year <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="2025"
                      min="1900"
                      max="2100"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Category <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g. Sedan"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Transmission <span>*</span>
                    </label>

                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                    >
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Fuel Type <span>*</span>
                    </label>

                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiCheckCircle />
                  <div>
                    <h3>Vehicle Specifications</h3>
                    <p>Set the capacity and vehicle specifications.</p>
                  </div>
                </div>

                <div className="admin-form-grid four-columns">
                  <div className="admin-form-group">
                    <label>
                      Seats <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      min="2"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Doors <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="doors"
                      value={formData.doors}
                      onChange={handleChange}
                      min="2"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Luggage <span>*</span>
                    </label>

                    <input
                      type="number"
                      name="luggage"
                      value={formData.luggage}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Mileage <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      placeholder="e.g. 18 km/l"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Color <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. White"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>
                      Location <span>*</span>
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Ongole"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Rating</label>

                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Reviews</label>

                    <input
                      type="number"
                      name="reviews"
                      value={formData.reviews}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <span className="admin-price-icon">₹</span>
                  <div>
                    <h3>Pricing & Availability</h3>
                    <p>Set the rental price and current availability.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>
                      Price Per Day <span>*</span>
                    </label>

                    <div className="admin-input-prefix">
                      <span>₹</span>

                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder="2500"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="admin-availability-control">
                    <div>
                      <strong>Vehicle Availability</strong>
                      <span>
                        {formData.available
                          ? "Available for booking"
                          : "Currently unavailable"}
                      </span>
                    </div>

                    <label className="admin-switch">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                      />

                      <span className="admin-switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiImage />
                  <div>
                    <h3>Images</h3>
                    <p>Add the main image and optional gallery images.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group full-width">
                    <label>
                      Main Image URL <span>*</span>
                    </label>

                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://example.com/car-image.jpg"
                    />

                    {formData.image && (
                      <div className="admin-image-preview">
                        <img
                          src={formData.image}
                          alt="Car preview"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group full-width">
                    <label>Gallery Images</label>

                    <textarea
                      name="gallery"
                      value={formData.gallery}
                      onChange={handleChange}
                      placeholder={`Enter one image URL per line\nhttps://example.com/car-1.jpg\nhttps://example.com/car-2.jpg`}
                      rows="4"
                    />

                    <small>Enter one image URL on each line.</small>
                  </div>
                </div>
              </div>

              {/* Features & Description */}
              <div className="admin-form-section">
                <div className="admin-form-section-title">
                  <FiCheckCircle />
                  <div>
                    <h3>Features & Description</h3>
                    <p>Describe what makes this vehicle special.</p>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <div className="admin-form-group full-width">
                    <label>Features</label>

                    <input
                      type="text"
                      name="features"
                      value={formData.features}
                      onChange={handleChange}
                      placeholder="AC, Bluetooth, GPS, Sunroof"
                    />

                    <small>Separate multiple features using commas.</small>
                  </div>

                  <div className="admin-form-group full-width">
                    <label>
                      Description <span>*</span>
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter a detailed description of the vehicle..."
                      rows="5"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="admin-button-spinner"></span>
                      {editingCar ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <FiSave />
                      {editingCar ? "Update Car" : "Create Car"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && carToDelete && (
        <div
          className="admin-modal-overlay delete-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              closeDeleteModal();
            }
          }}
        >
          <div className="admin-delete-modal">
            <div className="admin-delete-icon">
              <FiAlertTriangle />
            </div>

            <h2>Delete this car?</h2>

            <p>
              You are about to permanently delete{" "}
              <strong>{getCarName(carToDelete)}</strong>. This action cannot be
              undone.
            </p>

            <div className="admin-delete-car-preview">
              <div className="admin-delete-car-image">
                {carToDelete.image ? (
                  <img src={carToDelete.image} alt={getCarName(carToDelete)} />
                ) : (
                  <FaCar />
                )}
              </div>

              <div>
                <strong>{getCarName(carToDelete)}</strong>
                <span>{carToDelete.year}</span>
              </div>
            </div>

            <div className="admin-delete-actions">
              <button
                type="button"
                className="admin-delete-cancel"
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-confirm-delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="admin-button-spinner"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete Car
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;
