import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/UpdateDeliveryStatus.css";

function UpdateDeliveryStatus() {

    const [deliveries, setDeliveries] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDeliveries = async () => {

            try {

                const response =
                    await api.get("/api/deliveries/staff/me");

                console.log(
                    "Staff deliveries:",
                    response.data
                );

                setDeliveries(response.data);

            } catch (error) {

                console.error(
                    "Failed to load deliveries:",
                    error
                );

                setError(
                    "Unable to load assigned deliveries."
                );

            } finally {

                setLoading(false);
            }
        };

        loadDeliveries();

    }, []);


    const handleDeliveryChange = (event) => {

        const deliveryId = event.target.value;

        setSelectedDelivery(deliveryId);
        setMessage("");
        setError("");

        const delivery = deliveries.find(
            (item) => String(item.id) === String(deliveryId)
        );

        if (delivery) {
            setStatus(delivery.deliveryStatus || "");
        } else {
            setStatus("");
        }
    };


    const handleStatusUpdate = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        if (!selectedDelivery) {

            setError("Please select a delivery.");

            return;
        }

        if (!status) {

            setError("Please select a delivery status.");

            return;
        }

        try {

            setUpdating(true);

            const response =
                await api.put(
                    `/api/deliveries/${selectedDelivery}/status`,
                    {
                        status: status
                    }
                );

            console.log(
                "Updated delivery:",
                response.data
            );


            setDeliveries((previousDeliveries) =>
                previousDeliveries.map((delivery) =>
                    String(delivery.id) ===
                    String(selectedDelivery)
                        ? {
                            ...delivery,
                            deliveryStatus:
                                response.data.deliveryStatus,
                            deliveredAt:
                                response.data.deliveredAt
                        }
                        : delivery
                )
            );


            setMessage(
                "Delivery status updated successfully."
            );

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to update delivery status."
            );

        } finally {

            setUpdating(false);
        }
    };


    if (loading) {

        return (
            <div className="status-page">

                <div className="status-loading">
                    Loading deliveries...
                </div>

            </div>
        );
    }


    return (
        <div className="status-page">

            {/* Header */}
            <div className="status-header">

                <div>
                    <h1>Update Delivery Status</h1>

                    <p>
                        Update the current status of your
                        assigned deliveries.
                    </p>
                </div>

                <div className="status-role">
                    STAFF
                </div>

            </div>


            {/* Main Card */}
            <div className="status-card">

                <div className="status-card-icon">
                    🚚
                </div>

                <h2>Delivery Status</h2>

                <p className="status-description">
                    Select an assigned shipment and update
                    its current delivery status.
                </p>


                {deliveries.length === 0 ? (

                    <div className="no-deliveries">
                        <div>📦</div>

                        <h3>No Assigned Deliveries</h3>

                        <p>
                            You currently have no deliveries
                            assigned to you.
                        </p>
                    </div>

                ) : (

                    <form onSubmit={handleStatusUpdate}>

                        {/* Delivery Selection */}
                        <div className="form-group">

                            <label htmlFor="delivery">
                                Select Delivery
                            </label>

                            <select
                                id="delivery"
                                value={selectedDelivery}
                                onChange={handleDeliveryChange}
                            >

                                <option value="">
                                    -- Select Delivery --
                                </option>

                                {deliveries.map((delivery) => (

                                    <option
                                        key={delivery.id}
                                        value={delivery.id}
                                    >
                                        {delivery.shipment?.trackingNumber ||
                                            `Delivery #${delivery.id}`}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Selected Delivery Details */}
                        {selectedDelivery && (

                            <div className="selected-delivery">

                                {(() => {

                                    const delivery =
                                        deliveries.find(
                                            (item) =>
                                                String(item.id) ===
                                                String(selectedDelivery)
                                        );

                                    const shipment =
                                        delivery?.shipment;

                                    return (
                                        <>
                                            <div>
                                                <span>
                                                    Tracking Number
                                                </span>

                                                <strong>
                                                    {shipment?.trackingNumber ||
                                                        "N/A"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Receiver
                                                </span>

                                                <strong>
                                                    {shipment?.receiverName ||
                                                        "N/A"}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    Current Status
                                                </span>

                                                <strong>
                                                    {delivery?.deliveryStatus ||
                                                        "N/A"}
                                                </strong>
                                            </div>
                                        </>
                                    );

                                })()}

                            </div>
                        )}


                        {/* Status Selection */}
                        <div className="form-group">

                            <label htmlFor="status">
                                New Delivery Status
                            </label>

                            <select
                                id="status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value)
                                }
                                disabled={!selectedDelivery}
                            >

                                <option value="">
                                    -- Select Status --
                                </option>

                                <option value="ASSIGNED">
                                    ASSIGNED
                                </option>

                                <option value="PICKED_UP">
                                    PICKED UP
                                </option>

                                <option value="IN_TRANSIT">
                                    IN TRANSIT
                                </option>

                                <option value="OUT_FOR_DELIVERY">
                                    OUT FOR DELIVERY
                                </option>

                                <option value="DELIVERED">
                                    DELIVERED
                                </option>

                                <option value="CANCELLED">
                                    CANCELLED
                                </option>

                            </select>

                        </div>


                        {/* Success Message */}
                        {message && (

                            <div className="success-message">
                                ✓ {message}
                            </div>

                        )}


                        {/* Error Message */}
                        {error && (

                            <div className="error-message">
                                {error}
                            </div>

                        )}


                        {/* Update Button */}
                        <button
                            type="submit"
                            className="update-status-button"
                            disabled={
                                updating ||
                                !selectedDelivery ||
                                !status
                            }
                        >

                            {updating
                                ? "Updating..."
                                : "Update Status"}

                        </button>

                    </form>
                )}

            </div>

        </div>
    );
}

export default UpdateDeliveryStatus;