import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/TrackShipment.css";

function TrackShipment() {

    const [trackingNumber, setTrackingNumber] = useState("");
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();

        console.log("Track button clicked");
        console.log("Tracking number:", trackingNumber);

        if (!trackingNumber.trim()) {
            setError("Please enter a tracking number.");
            return;
        }

        setLoading(true);
        setError("");
        setShipment(null);

        try {

            const response = await api.get(
                `/api/tracking/${trackingNumber.trim()}`
            );

            console.log("Tracking response:", response.data);

            setShipment(response.data);

        } catch (error) {

            console.error("Tracking error:", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(
                    "Shipment not found. Please check the tracking number."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="track-shipment-page">

            {/* Header */}

            <header className="track-shipment-header">

                <div>

                    <span className="tracking-label">
                        Customer
                    </span>

                    <h1>Track Shipment</h1>

                    <p>
                        Enter your tracking number to check your
                        shipment status and delivery information.
                    </p>

                </div>

                <div className="tracking-header-icon">
                    📍
                </div>

            </header>

            {/* Tracking Search */}

            <section className="tracking-search-card">

                <div className="tracking-search-header">

                    <div className="tracking-search-icon">
                        🔎
                    </div>

                    <div>

                        <h2>Track Your Courier</h2>

                        <p>
                            Enter the tracking number provided
                            after booking your shipment.
                        </p>

                    </div>

                </div>

                <form
                    className="tracking-form"
                    onSubmit={handleTrack}
                >

                    <div className="tracking-input-wrapper">

                        <label>
                            Tracking Number
                        </label>

                        <input
                            type="text"
                            placeholder="Example: TRK-1807C39A"
                            value={trackingNumber}
                            onChange={(e) =>
                                setTrackingNumber(e.target.value)
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        className="track-button"
                    >
                        {loading
                            ? "Tracking..."
                            : "Track Shipment →"}
                    </button>

                </form>

            </section>

            {/* Error */}

            {error && (

                <section className="tracking-error">

                    <div className="tracking-error-icon">
                        ⚠️
                    </div>

                    <div>
                        <h3>Unable to Track Shipment</h3>

                        <p>
                            {error}
                        </p>
                    </div>

                </section>

            )}

            {/* Shipment Result */}

            {shipment && (

                <section className="tracking-result">

                    {/* Result Header */}

                    <div className="tracking-result-header">

                        <div>

                            <span>
                                Tracking Number
                            </span>

                            <h2>
                                {shipment.trackingNumber}
                            </h2>

                        </div>

                        <span
                            className={`tracking-status status-${shipment.deliveryStatus?.toLowerCase()}`}
                        >
                            {shipment.deliveryStatus}
                        </span>

                    </div>

                    {/* Status Progress */}

                    <div className="tracking-progress">

                        <div className="progress-step completed">

                            <div className="progress-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Shipment Booked
                                </strong>

                                <span>
                                    Your shipment has been booked.
                                </span>
                            </div>

                        </div>

                        <div
                            className={`progress-line ${
                                shipment.deliveryStatus !==
                                "NOT_ASSIGNED"
                                    ? "active"
                                    : ""
                            }`}
                        ></div>

                        <div
                            className={`progress-step ${
                                shipment.deliveryStatus !==
                                "NOT_ASSIGNED"
                                    ? "completed"
                                    : ""
                            }`}
                        >

                            <div className="progress-icon">
                                {shipment.deliveryStatus !==
                                "NOT_ASSIGNED"
                                    ? "✓"
                                    : "2"}
                            </div>

                            <div>
                                <strong>
                                    Staff Assigned
                                </strong>

                                <span>
                                    {shipment.staffName
                                        ? "Delivery staff assigned."
                                        : "Waiting for staff assignment."}
                                </span>
                            </div>

                        </div>

                        <div
                            className={`progress-line ${
                                shipment.deliveryStatus ===
                                    "IN_TRANSIT" ||
                                shipment.deliveryStatus ===
                                    "DELIVERED"
                                    ? "active"
                                    : ""
                            }`}
                        ></div>

                        <div
                            className={`progress-step ${
                                shipment.deliveryStatus ===
                                    "IN_TRANSIT" ||
                                shipment.deliveryStatus ===
                                    "DELIVERED"
                                    ? "completed"
                                    : ""
                            }`}
                        >

                            <div className="progress-icon">
                                {shipment.deliveryStatus ===
                                    "IN_TRANSIT" ||
                                shipment.deliveryStatus ===
                                    "DELIVERED"
                                    ? "✓"
                                    : "3"}
                            </div>

                            <div>
                                <strong>
                                    In Transit
                                </strong>

                                <span>
                                    {shipment.deliveryStatus ===
                                        "IN_TRANSIT" ||
                                    shipment.deliveryStatus ===
                                        "DELIVERED"
                                        ? "Shipment is on the way."
                                        : "Shipment is not yet in transit."}
                                </span>
                            </div>

                        </div>

                        <div
                            className={`progress-line ${
                                shipment.deliveryStatus ===
                                "DELIVERED"
                                    ? "active"
                                    : ""
                            }`}
                        ></div>

                        <div
                            className={`progress-step ${
                                shipment.deliveryStatus ===
                                "DELIVERED"
                                    ? "completed"
                                    : ""
                            }`}
                        >

                            <div className="progress-icon">
                                {shipment.deliveryStatus ===
                                "DELIVERED"
                                    ? "✓"
                                    : "4"}
                            </div>

                            <div>
                                <strong>
                                    Delivered
                                </strong>

                                <span>
                                    {shipment.deliveryStatus ===
                                    "DELIVERED"
                                        ? "Shipment delivered successfully."
                                        : "Waiting for delivery."}
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Shipment Information */}

                    <div className="tracking-information">

                        <h3>
                            Delivery Information
                        </h3>

                        <div className="tracking-info-grid">

                            <div className="tracking-info-item">

                                <span className="info-icon">
                                    👤
                                </span>

                                <div>
                                    <span>
                                        Delivery Staff
                                    </span>

                                    <strong>
                                        {shipment.staffName ||
                                            "Not assigned"}
                                    </strong>
                                </div>

                            </div>

                            <div className="tracking-info-item">

                                <span className="info-icon">
                                    📞
                                </span>

                                <div>
                                    <span>
                                        Staff Phone
                                    </span>

                                    <strong>
                                        {shipment.staffPhone ||
                                            "Not assigned"}
                                    </strong>
                                </div>

                            </div>

                            <div className="tracking-info-item">

                                <span className="info-icon">
                                    🕐
                                </span>

                                <div>
                                    <span>
                                        Assigned At
                                    </span>

                                    <strong>
                                        {shipment.assignedAt ||
                                            "Not assigned"}
                                    </strong>
                                </div>

                            </div>

                            <div className="tracking-info-item">

                                <span className="info-icon">
                                    ✓
                                </span>

                                <div>
                                    <span>
                                        Delivered At
                                    </span>

                                    <strong>
                                        {shipment.deliveredAt ||
                                            "Not delivered"}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            )}

            {/* Footer */}

            <div className="tracking-footer">

                <Link
                    to="/customer"
                    className="tracking-back-button"
                >
                    ← Back to Dashboard
                </Link>

            </div>

        </div>
    );
}

export default TrackShipment;