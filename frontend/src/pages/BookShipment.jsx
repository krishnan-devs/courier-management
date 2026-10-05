import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/BookShipment.css";

function BookShipment() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        senderName: "",
        senderPhone: "",
        receiverName: "",
        receiverPhone: "",
        pickupAddress: "",
        deliveryAddress: "",
        packageDescription: "",
        weight: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/api/shipments", {
                ...formData,
                weight: Number(formData.weight)
            });

            console.log("Shipment booking response:", response.data);

            alert(
                `Shipment booked successfully!\nTracking Number: ${response.data.data.trackingNumber}`
            );

            navigate("/customer");

        } catch (error) {

            console.error("Shipment booking error:", error);

            if (error.response && error.response.data) {

                console.log(
                    "Backend error response:",
                    error.response.data
                );

                alert(
                    typeof error.response.data === "object"
                        ? JSON.stringify(
                            error.response.data,
                            null,
                            2
                        )
                        : error.response.data
                );

            } else {

                alert(
                    "Shipment booking failed. Please try again."
                );
            }
        }
    };

    return (
        <div className="book-shipment-page">

            {/* Header */}

            <header className="book-shipment-header">

                <div>

                    <span className="book-shipment-label">
                        Customer
                    </span>

                    <h1>Book Shipment</h1>

                    <p>
                        Create a new courier shipment by entering
                        the shipment details below.
                    </p>

                </div>

                <div className="book-shipment-icon">
                    📦
                </div>

            </header>

            {/* Form Card */}

            <section className="book-shipment-card">

                <div className="book-shipment-card-header">

                    <div>

                        <h2>Shipment Details</h2>

                        <p>
                            Please provide accurate sender,
                            receiver, and package information.
                        </p>

                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    {/* Sender & Receiver */}

                    <div className="form-section">

                        <h3>Sender & Receiver</h3>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Sender Name</label>

                                <input
                                    type="text"
                                    name="senderName"
                                    placeholder="Enter sender name"
                                    value={formData.senderName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Sender Phone</label>

                                <input
                                    type="text"
                                    name="senderPhone"
                                    placeholder="Enter sender phone"
                                    value={formData.senderPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Receiver Name</label>

                                <input
                                    type="text"
                                    name="receiverName"
                                    placeholder="Enter receiver name"
                                    value={formData.receiverName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Receiver Phone</label>

                                <input
                                    type="text"
                                    name="receiverPhone"
                                    placeholder="Enter receiver phone"
                                    value={formData.receiverPhone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    {/* Addresses */}

                    <div className="form-section">

                        <h3>Delivery Information</h3>

                        <div className="form-grid">

                            <div className="form-group form-group-full">
                                <label>Pickup Address</label>

                                <input
                                    type="text"
                                    name="pickupAddress"
                                    placeholder="Enter pickup address"
                                    value={formData.pickupAddress}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group form-group-full">
                                <label>Delivery Address</label>

                                <input
                                    type="text"
                                    name="deliveryAddress"
                                    placeholder="Enter delivery address"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    {/* Package */}

                    <div className="form-section">

                        <h3>Package Information</h3>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Package Description</label>

                                <input
                                    type="text"
                                    name="packageDescription"
                                    placeholder="Example: Documents"
                                    value={formData.packageDescription}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Weight (kg)</label>

                                <input
                                    type="number"
                                    name="weight"
                                    placeholder="Enter weight"
                                    min="0.1"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>

                    </div>

                    {/* Buttons */}

                    <div className="book-shipment-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate("/customer")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="book-button"
                        >
                            📦 Book Shipment
                        </button>

                    </div>

                </form>

            </section>

        </div>
    );
}

export default BookShipment;