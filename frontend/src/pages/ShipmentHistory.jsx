import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/ShipmentHistory.css";

function ShipmentHistory() {

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchShipmentHistory();
    }, []);

    const fetchShipmentHistory = async () => {
        try {

            const response =
                await api.get("/api/customer/shipments");

            console.log(
                "Shipment history:",
                response.data
            );

            setShipments(response.data.data);

        } catch (error) {

            console.error(
                "Shipment history error:",
                error
            );

            setError(
                "Unable to load shipment history."
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="shipment-history-page">

                <div className="shipment-history-message">
                    <div className="history-loading-icon">
                        🧾
                    </div>

                    <h2>Loading shipment history...</h2>

                    <p>
                        Please wait while we fetch your shipments.
                    </p>
                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="shipment-history-page">

                <div className="shipment-history-message error-message">

                    <div className="history-error-icon">
                        ⚠️
                    </div>

                    <h2>Unable to Load Shipments</h2>

                    <p>{error}</p>

                    <button
                        className="history-retry-button"
                        onClick={() => {
                            setLoading(true);
                            setError("");
                            fetchShipmentHistory();
                        }}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="shipment-history-page">

            {/* Header */}

            <header className="shipment-history-header">

                <div>

                    <span className="history-label">
                        Customer
                    </span>

                    <h1>Shipment History</h1>

                    <p>
                        View and track all your courier shipments
                        in one place.
                    </p>

                </div>

                <div className="history-header-icon">
                    🧾
                </div>

            </header>

            {/* Summary */}

            <section className="history-summary">

                <div className="history-summary-card">

                    <div className="summary-icon">
                        📦
                    </div>

                    <div>
                        <strong>
                            {shipments.length}
                        </strong>

                        <span>
                            Total Shipments
                        </span>
                    </div>

                </div>

                <div className="history-summary-card">

                    <div className="summary-icon pending">
                        ⏳
                    </div>

                    <div>
                        <strong>
                            {
                                shipments.filter(
                                    (shipment) =>
                                        shipment.status !== "DELIVERED"
                                ).length
                            }
                        </strong>

                        <span>
                            Active Shipments
                        </span>
                    </div>

                </div>

                <div className="history-summary-card">

                    <div className="summary-icon delivered">
                        ✓
                    </div>

                    <div>
                        <strong>
                            {
                                shipments.filter(
                                    (shipment) =>
                                        shipment.status === "DELIVERED"
                                ).length
                            }
                        </strong>

                        <span>
                            Delivered
                        </span>
                    </div>

                </div>

            </section>

            {/* Shipment List */}

            <section className="shipment-history-container">

                <div className="history-section-header">

                    <div>

                        <h2>Your Shipments</h2>

                        <p>
                            Details of your booked courier shipments
                        </p>

                    </div>

                    <button
                        className="history-refresh-button"
                        onClick={() => {
                            setLoading(true);
                            fetchShipmentHistory();
                        }}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {shipments.length === 0 ? (

                    <div className="history-empty">

                        <div className="empty-history-icon">
                            📦
                        </div>

                        <h3>No Shipments Found</h3>

                        <p>
                            You haven't booked any shipments yet.
                        </p>

                        <Link
                            to="/customer/book-shipment"
                            className="book-first-shipment"
                        >
                            Book Your First Shipment →
                        </Link>

                    </div>

                ) : (

                    <div className="shipment-list">

                        {shipments.map((shipment) => (

                            <article
                                className="shipment-history-card"
                                key={shipment.id}
                            >

                                {/* Card Header */}

                                <div className="shipment-card-header">

                                    <div>

                                        <span className="tracking-label">
                                            Tracking Number
                                        </span>

                                        <h3>
                                            {shipment.trackingNumber}
                                        </h3>

                                    </div>

                                    <span
                                        className={`shipment-status status-${shipment.status?.toLowerCase()}`}
                                    >
                                        {shipment.status}
                                    </span>

                                </div>

                                {/* Route */}

                                <div className="shipment-route">

                                    <div className="route-item">

                                        <span className="route-icon pickup">
                                            📍
                                        </span>

                                        <div>
                                            <span>
                                                Pickup
                                            </span>

                                            <strong>
                                                {shipment.pickupAddress}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="route-line"></div>

                                    <div className="route-item">

                                        <span className="route-icon delivery">
                                            🏁
                                        </span>

                                        <div>
                                            <span>
                                                Delivery
                                            </span>

                                            <strong>
                                                {shipment.deliveryAddress}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                                {/* Details */}

                                <div className="shipment-details">

                                    <div className="shipment-detail">

                                        <span>
                                            Sender
                                        </span>

                                        <strong>
                                            {shipment.senderName}
                                        </strong>

                                    </div>

                                    <div className="shipment-detail">

                                        <span>
                                            Receiver
                                        </span>

                                        <strong>
                                            {shipment.receiverName}
                                        </strong>

                                    </div>

                                    <div className="shipment-detail">

                                        <span>
                                            Package
                                        </span>

                                        <strong>
                                            {shipment.packageDescription}
                                        </strong>

                                    </div>

                                    <div className="shipment-detail">

                                        <span>
                                            Weight
                                        </span>

                                        <strong>
                                            {shipment.weight} kg
                                        </strong>

                                    </div>

                                </div>

                                {/* Card Footer */}

                                <div className="shipment-card-footer">

                                    <span>
                                        Shipment ID: #{shipment.id}
                                    </span>

                                    <Link
                                        to={`/customer/track?trackingNumber=${shipment.trackingNumber}`}
                                        className="track-shipment-button"
                                    >
                                        Track Shipment →
                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

                {/* Back */}

                <div className="history-footer">

                    <Link
                        to="/customer"
                        className="back-dashboard-button"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default ShipmentHistory;