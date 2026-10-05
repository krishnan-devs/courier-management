import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AssignedShipments.css";

function AssignedShipments() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAssignedShipments = async () => {
            try {
                const response = await api.get("/api/deliveries/staff/me");

                console.log(
                    "Assigned shipments response:",
                    response.data
                );

                setDeliveries(response.data);
            } catch (error) {
                console.error(
                    "Assigned shipments error:",
                    error
                );

                setError("Unable to load assigned shipments.");
            } finally {
                setLoading(false);
            }
        };

        loadAssignedShipments();
    }, []);

    if (loading) {
        return (
            <div className="assigned-page">
                <div className="assigned-loading">
                    Loading assigned shipments...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="assigned-page">
                <div className="assigned-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="assigned-page">

            <div className="assigned-header">
                <div>
                    <h1>Assigned Shipments</h1>
                    <p>View shipments assigned to you</p>
                </div>

                <div className="shipment-count">
                    {deliveries.length} Shipment
                    {deliveries.length !== 1 ? "s" : ""}
                </div>
            </div>

            {deliveries.length === 0 ? (
                <div className="empty-shipments">
                    <div className="empty-icon">📦</div>
                    <h2>No Assigned Shipments</h2>
                    <p>
                        You currently don't have any shipments
                        assigned to you.
                    </p>
                </div>
            ) : (
                <div className="shipment-list">

                    {deliveries.map((delivery) => {

                        const shipment = delivery.shipment;

                        return (
                            <div
                                className="shipment-card"
                                key={delivery.id}
                            >

                                <div className="shipment-card-header">
                                    <div>
                                        <span className="tracking-label">
                                            Tracking Number
                                        </span>

                                        <h2>
                                            {shipment?.trackingNumber ||
                                                "N/A"}
                                        </h2>
                                    </div>

                                    <span
                                        className={`status-badge ${(
                                            delivery.deliveryStatus || ""
                                        ).toLowerCase()}`}
                                    >
                                        {delivery.deliveryStatus ||
                                            "NOT_ASSIGNED"}
                                    </span>
                                </div>

                                <div className="shipment-details">

                                    <div className="detail-box">
                                        <span>👤</span>

                                        <div>
                                            <small>Receiver</small>
                                            <strong>
                                                {shipment?.receiverName ||
                                                    "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="detail-box">
                                        <span>📞</span>

                                        <div>
                                            <small>Phone</small>
                                            <strong>
                                                {shipment?.receiverPhone ||
                                                    "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="detail-box">
                                        <span>📍</span>

                                        <div>
                                            <small>Pickup</small>
                                            <strong>
                                                {shipment?.pickupAddress ||
                                                    "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="detail-box">
                                        <span>🏠</span>

                                        <div>
                                            <small>Delivery</small>
                                            <strong>
                                                {shipment?.deliveryAddress ||
                                                    "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="detail-box">
                                        <span>📦</span>

                                        <div>
                                            <small>Package</small>
                                            <strong>
                                                {shipment?.packageDescription ||
                                                    "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="detail-box">
                                        <span>⚖️</span>

                                        <div>
                                            <small>Weight</small>
                                            <strong>
                                                {shipment?.weight
                                                    ? `${shipment.weight} kg`
                                                    : "N/A"}
                                            </strong>
                                        </div>
                                    </div>

                                </div>

                                <div className="shipment-footer">

                                    <div>
                                        <small>Assigned At</small>
                                        <strong>
                                            {delivery.assignedAt
                                                ? new Date(
                                                    delivery.assignedAt
                                                ).toLocaleString()
                                                : "Not assigned"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Delivered At</small>
                                        <strong>
                                            {delivery.deliveredAt
                                                ? new Date(
                                                    delivery.deliveredAt
                                                ).toLocaleString()
                                                : "Not delivered"}
                                        </strong>
                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
}

export default AssignedShipments;