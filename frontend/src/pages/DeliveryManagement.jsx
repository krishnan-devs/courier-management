import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/DeliveryManagement.css";

function DeliveryManagement() {

    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDeliveries = async () => {

            try {

                const response =
                    await api.get("/api/deliveries/staff/me");

                console.log(
                    "Delivery management response:",
                    response.data
                );

                setDeliveries(response.data);

            } catch (error) {

                console.error(
                    "Delivery management error:",
                    error
                );

                setError(
                    "Unable to load delivery information."
                );

            } finally {

                setLoading(false);
            }
        };

        loadDeliveries();

    }, []);


    const getStatusClass = (status) => {

        if (!status) {
            return "status-default";
        }

        return status
            .toLowerCase()
            .replaceAll("_", "-");
    };


    if (loading) {

        return (
            <div className="delivery-management-page">

                <div className="delivery-loading">
                    Loading delivery information...
                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="delivery-management-page">

                <div className="delivery-error">
                    {error}
                </div>

            </div>
        );
    }


    return (
        <div className="delivery-management-page">

            {/* Header */}
            <div className="delivery-management-header">

                <div>
                    <h1>Delivery Management</h1>

                    <p>
                        Manage pickup and delivery operations.
                    </p>
                </div>

                <div className="delivery-role">
                    STAFF
                </div>

            </div>


            {/* Summary */}
            <div className="delivery-summary">

                <div className="summary-card">
                    <span className="summary-icon">📦</span>

                    <div>
                        <small>Total Deliveries</small>

                        <strong>
                            {deliveries.length}
                        </strong>
                    </div>
                </div>


                <div className="summary-card">
                    <span className="summary-icon">🚚</span>

                    <div>
                        <small>In Transit</small>

                        <strong>
                            {
                                deliveries.filter(
                                    (delivery) =>
                                        delivery.deliveryStatus ===
                                        "IN_TRANSIT"
                                ).length
                            }
                        </strong>
                    </div>
                </div>


                <div className="summary-card">
                    <span className="summary-icon">✅</span>

                    <div>
                        <small>Delivered</small>

                        <strong>
                            {
                                deliveries.filter(
                                    (delivery) =>
                                        delivery.deliveryStatus ===
                                        "DELIVERED"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

            </div>


            {/* Delivery List */}
            {deliveries.length === 0 ? (

                <div className="no-deliveries">

                    <div className="no-delivery-icon">
                        📦
                    </div>

                    <h2>No Deliveries Assigned</h2>

                    <p>
                        You currently don't have any deliveries
                        assigned to you.
                    </p>

                </div>

            ) : (

                <div className="delivery-list">

                    {deliveries.map((delivery) => {

                        const shipment =
                            delivery.shipment;

                        return (
                            <div
                                className="delivery-management-card"
                                key={delivery.id}
                            >

                                {/* Card Header */}
                                <div className="delivery-card-header">

                                    <div>

                                        <small>
                                            Tracking Number
                                        </small>

                                        <h2>
                                            {
                                                shipment?.trackingNumber ||
                                                "N/A"
                                            }
                                        </h2>

                                    </div>


                                    <span
                                        className={`delivery-status ${getStatusClass(
                                            delivery.deliveryStatus
                                        )}`}
                                    >
                                        {
                                            delivery.deliveryStatus ||
                                            "NOT_ASSIGNED"
                                        }
                                    </span>

                                </div>


                                {/* Route */}
                                <div className="delivery-route">

                                    <div className="route-point">

                                        <div className="route-icon">
                                            📍
                                        </div>

                                        <div>
                                            <small>
                                                Pickup
                                            </small>

                                            <strong>
                                                {
                                                    shipment?.pickupAddress ||
                                                    "N/A"
                                                }
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="route-line">
                                        ↓
                                    </div>


                                    <div className="route-point">

                                        <div className="route-icon">
                                            🏠
                                        </div>

                                        <div>
                                            <small>
                                                Delivery
                                            </small>

                                            <strong>
                                                {
                                                    shipment?.deliveryAddress ||
                                                    "N/A"
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                {/* Delivery Details */}
                                <div className="delivery-details">

                                    <div>
                                        <small>
                                            Receiver
                                        </small>

                                        <strong>
                                            {
                                                shipment?.receiverName ||
                                                "N/A"
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <small>
                                            Phone
                                        </small>

                                        <strong>
                                            {
                                                shipment?.receiverPhone ||
                                                "N/A"
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <small>
                                            Package
                                        </small>

                                        <strong>
                                            {
                                                shipment?.packageDescription ||
                                                "N/A"
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <small>
                                            Weight
                                        </small>

                                        <strong>
                                            {
                                                shipment?.weight
                                                    ? `${shipment.weight} kg`
                                                    : "N/A"
                                            }
                                        </strong>
                                    </div>

                                </div>


                                {/* Time Information */}
                                <div className="delivery-times">

                                    <div>
                                        <small>
                                            Assigned At
                                        </small>

                                        <strong>
                                            {
                                                delivery.assignedAt
                                                    ? new Date(
                                                        delivery.assignedAt
                                                    ).toLocaleString()
                                                    : "Not assigned"
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <small>
                                            Delivered At
                                        </small>

                                        <strong>
                                            {
                                                delivery.deliveredAt
                                                    ? new Date(
                                                        delivery.deliveredAt
                                                    ).toLocaleString()
                                                    : "Not delivered"
                                            }
                                        </strong>
                                    </div>

                                </div>


                                {/* Action */}
                                <div className="delivery-card-actions">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                "/staff/status"
                                            )
                                        }
                                    >
                                        Update Status
                                    </button>

                                </div>

                            </div>
                        );

                    })}

                </div>
            )}

        </div>
    );
}

export default DeliveryManagement;