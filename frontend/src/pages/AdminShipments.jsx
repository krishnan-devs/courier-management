import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import api from "../services/api";
import "../styles/AdminShipments.css";

function AdminShipments() {

    const navigate = useNavigate();

    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Selected shipment for details
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    // Shipment editing
    const [editingShipment, setEditingShipment] = useState(null);
    const [updatingShipment, setUpdatingShipment] = useState(false);

    // Shipment deletion
    const [shipmentToDelete, setShipmentToDelete] = useState(null);
    const [deletingShipment, setDeletingShipment] = useState(false);

    const loadShipments = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await api.get("/api/shipments");

            setShipments(response.data?.data || []);

        } catch (error) {

            console.error("Load shipments error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load shipments"
            );

        } finally {
            setLoading(false);
        }
    };

    // Load individual shipment details
    const handleViewShipment = async (id) => {

        try {
            setDetailsLoading(true);
            setError("");

            const response = await api.get(
                `/api/shipments/${id}`
            );

            // Backend returns ApiResponse<Shipment>
            setSelectedShipment(response.data?.data);

        } catch (error) {

            console.error(
                "Load shipment details error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.message ||
                "Unable to load shipment details"
            );

        } finally {
            setDetailsLoading(false);
        }
    };

    // Open edit modal
    const handleEditShipment = (shipment) => {

        setError("");
        setSuccessMessage("");

        setEditingShipment({
            id: shipment.id,
            trackingNumber: shipment.trackingNumber || "",
            senderName: shipment.senderName || "",
            senderPhone: shipment.senderPhone || "",
            receiverName: shipment.receiverName || "",
            receiverPhone: shipment.receiverPhone || "",
            pickupAddress: shipment.pickupAddress || "",
            deliveryAddress: shipment.deliveryAddress || "",
            packageDescription: shipment.packageDescription || "",
            weight: shipment.weight || "",
            status: shipment.status || "BOOKED"
        });
    };

    // Handle edit form changes
    const handleEditChange = (event) => {

        const { name, value } = event.target;

        setEditingShipment((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Update shipment
    const handleUpdateShipment = async (event) => {

        event.preventDefault();

        if (!editingShipment) {
            return;
        }

        try {

            setUpdatingShipment(true);
            setError("");
            setSuccessMessage("");

            await api.put(
                `/api/shipments/${editingShipment.id}`,
                {
                    trackingNumber:
                        editingShipment.trackingNumber,

                    senderName:
                        editingShipment.senderName,

                    senderPhone:
                        editingShipment.senderPhone,

                    receiverName:
                        editingShipment.receiverName,

                    receiverPhone:
                        editingShipment.receiverPhone,

                    pickupAddress:
                        editingShipment.pickupAddress,

                    deliveryAddress:
                        editingShipment.deliveryAddress,

                    packageDescription:
                        editingShipment.packageDescription,

                    weight:
                        Number(editingShipment.weight),

                    status:
                        editingShipment.status
                }
            );

            setEditingShipment(null);

            setSuccessMessage(
                "Shipment updated successfully!"
            );

            await loadShipments();

        } catch (error) {

            console.error(
                "Update shipment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to update shipment"
            );

        } finally {

            setUpdatingShipment(false);
        }
    };

    // Open delete confirmation
    const handleDeleteClick = (shipment) => {

        setError("");
        setSuccessMessage("");

        setShipmentToDelete(shipment);
    };

    // Delete shipment
    const handleDeleteShipment = async () => {

        if (!shipmentToDelete) {
            return;
        }

        try {

            setDeletingShipment(true);
            setError("");
            setSuccessMessage("");

            await api.delete(
                `/api/shipments/${shipmentToDelete.id}`
            );

            setShipmentToDelete(null);

            setSuccessMessage(
                `${shipmentToDelete.trackingNumber} deleted successfully!`
            );

            await loadShipments();

        } catch (error) {

            console.error(
                "Delete shipment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Unable to delete shipment"
            );

            setShipmentToDelete(null);

        } finally {

            setDeletingShipment(false);
        }
    };

    // Close shipment details
    const closeShipmentDetails = () => {
        setSelectedShipment(null);
    };

    // Close edit modal
    const closeEditShipment = () => {

        if (!updatingShipment) {
            setEditingShipment(null);
        }
    };

    // Close delete confirmation
    const closeDeleteConfirmation = () => {

        if (!deletingShipment) {
            setShipmentToDelete(null);
        }
    };

    useEffect(() => {
        loadShipments();
    }, []);

    return (
        <div className="admin-shipments">

            {/* Header */}
            <div className="shipments-header">

                <div>
                    <h1>Shipment Management</h1>

                    <p>
                        View and manage all courier shipments
                    </p>
                </div>

                <LogoutButton />

            </div>

            {/* Back Button */}
            <button
                className="back-dashboard-button"
                onClick={() => navigate("/admin")}
            >
                ← Back to Dashboard
            </button>

            {/* Success */}
            {successMessage && (
                <div className="shipment-success">
                    {successMessage}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="shipment-error">
                    {error}
                </div>
            )}

            {/* Shipment List */}
            <div className="shipment-list-container">

                <div className="shipment-list-header">

                    <div>
                        <h2>All Shipments</h2>

                        <p>
                            Total shipments: {shipments.length}
                        </p>
                    </div>

                    <button
                        className="refresh-shipments-button"
                        onClick={loadShipments}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {loading ? (

                    <div className="shipment-loading">
                        Loading shipments...
                    </div>

                ) : shipments.length === 0 ? (

                    <div className="shipment-empty">

                        <div className="shipment-empty-icon">
                            📦
                        </div>

                        <h3>No Shipments Found</h3>

                        <p>
                            There are currently no shipments
                            in the system.
                        </p>

                    </div>

                ) : (

                    <div className="shipment-table-wrapper">

                        <table className="shipment-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tracking Number</th>
                                    <th>Sender</th>
                                    <th>Receiver</th>
                                    <th>Pickup</th>
                                    <th>Delivery</th>
                                    <th>Weight</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {shipments.map((shipment) => (

                                    <tr key={shipment.id}>

                                        <td>
                                            #{shipment.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {shipment.trackingNumber}
                                            </strong>
                                        </td>

                                        <td>
                                            {shipment.senderName}
                                        </td>

                                        <td>
                                            {shipment.receiverName}
                                        </td>

                                        <td>
                                            {shipment.pickupAddress}
                                        </td>

                                        <td>
                                            {shipment.deliveryAddress}
                                        </td>

                                        <td>
                                            {shipment.weight} kg
                                        </td>

                                        <td>
                                            <span
                                                className={`shipment-status ${
                                                    shipment.status
                                                        ?.toLowerCase()
                                                        .replace(/\s+/g, "-")
                                                }`}
                                            >
                                                {shipment.status}
                                            </span>
                                        </td>

                                        <td>

                                            <div className="shipment-action-buttons">

                                                <button
                                                    className="view-shipment-button"
                                                    onClick={() =>
                                                        handleViewShipment(
                                                            shipment.id
                                                        )
                                                    }
                                                >
                                                    👁 View
                                                </button>

                                                <button
                                                    className="edit-shipment-button"
                                                    onClick={() =>
                                                        handleEditShipment(
                                                            shipment
                                                        )
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    className="delete-shipment-button"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            shipment
                                                        )
                                                    }
                                                >
                                                    🗑 Delete
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

            {/* Shipment Details Loading */}
            {detailsLoading && (
                <div className="shipment-modal-overlay">

                    <div className="shipment-modal">

                        <div className="shipment-loading">
                            Loading shipment details...
                        </div>

                    </div>

                </div>
            )}

            {/* Shipment Details Modal */}
            {selectedShipment && !detailsLoading && (

                <div
                    className="shipment-modal-overlay"
                    onClick={closeShipmentDetails}
                >

                    <div
                        className="shipment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="shipment-modal-header">

                            <div>
                                <h2>
                                    Shipment Details
                                </h2>

                                <p>
                                    {selectedShipment.trackingNumber}
                                </p>
                            </div>

                            <button
                                className="close-shipment-modal"
                                onClick={closeShipmentDetails}
                            >
                                ✕
                            </button>

                        </div>

                        <div className="shipment-details-grid">

                            <div className="shipment-detail-card">

                                <h3>
                                    📦 Shipment Information
                                </h3>

                                <div className="shipment-detail-row">
                                    <span>
                                        Tracking Number
                                    </span>

                                    <strong>
                                        {selectedShipment.trackingNumber}
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">
                                    <span>
                                        Package
                                    </span>

                                    <strong>
                                        {selectedShipment.packageDescription}
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">
                                    <span>
                                        Weight
                                    </span>

                                    <strong>
                                        {selectedShipment.weight} kg
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">

                                    <span>
                                        Status
                                    </span>

                                    <span
                                        className={`shipment-status ${
                                            selectedShipment.status
                                                ?.toLowerCase()
                                                .replace(/\s+/g, "-")
                                        }`}
                                    >
                                        {selectedShipment.status}
                                    </span>

                                </div>

                            </div>

                            <div className="shipment-detail-card">

                                <h3>
                                    👤 Sender Information
                                </h3>

                                <div className="shipment-detail-row">
                                    <span>Name</span>

                                    <strong>
                                        {selectedShipment.senderName}
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">
                                    <span>Phone</span>

                                    <strong>
                                        {selectedShipment.senderPhone}
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">
                                    <span>
                                        Pickup Address
                                    </span>

                                    <strong>
                                        {selectedShipment.pickupAddress}
                                    </strong>
                                </div>

                            </div>

                            <div className="shipment-detail-card">

                                <h3>
                                    👤 Receiver Information
                                </h3>

                                <div className="shipment-detail-row">
                                    <span>Name</span>

                                    <strong>
                                        {selectedShipment.receiverName}
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">
                                    <span>Phone</span>

                                    <strong>
                                        {selectedShipment.receiverPhone}
                                    </strong>
                                </div>

                                <div className="shipment-detail-row">
                                    <span>
                                        Delivery Address
                                    </span>

                                    <strong>
                                        {selectedShipment.deliveryAddress}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        <div className="shipment-modal-footer">

                            <button
                                className="close-details-button"
                                onClick={closeShipmentDetails}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* Edit Shipment Modal */}
            {editingShipment && (

                <div
                    className="shipment-modal-overlay"
                    onClick={closeEditShipment}
                >

                    <div
                        className="shipment-modal edit-shipment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="shipment-modal-header">

                            <div>
                                <h2>
                                    Edit Shipment
                                </h2>

                                <p>
                                    {editingShipment.trackingNumber}
                                </p>
                            </div>

                            <button
                                className="close-shipment-modal"
                                onClick={closeEditShipment}
                                disabled={updatingShipment}
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            className="shipment-edit-form"
                            onSubmit={handleUpdateShipment}
                        >

                            <div className="shipment-edit-grid">

                                <div className="shipment-form-group">

                                    <label>
                                        Tracking Number
                                    </label>

                                    <input
                                        type="text"
                                        name="trackingNumber"
                                        value={
                                            editingShipment.trackingNumber
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Package Description
                                    </label>

                                    <input
                                        type="text"
                                        name="packageDescription"
                                        value={
                                            editingShipment.packageDescription
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Sender Name
                                    </label>

                                    <input
                                        type="text"
                                        name="senderName"
                                        value={
                                            editingShipment.senderName
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Sender Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="senderPhone"
                                        value={
                                            editingShipment.senderPhone
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Receiver Name
                                    </label>

                                    <input
                                        type="text"
                                        name="receiverName"
                                        value={
                                            editingShipment.receiverName
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Receiver Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="receiverPhone"
                                        value={
                                            editingShipment.receiverPhone
                                        }
                                        onChange={handleEditChange}
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Weight (kg)
                                    </label>

                                    <input
                                        type="number"
                                        name="weight"
                                        value={
                                            editingShipment.weight
                                        }
                                        onChange={handleEditChange}
                                        min="0.1"
                                        step="0.1"
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            editingShipment.status
                                        }
                                        onChange={handleEditChange}
                                        required
                                    >
                                        <option value="BOOKED">
                                            BOOKED
                                        </option>

                                        <option value="PENDING">
                                            PENDING
                                        </option>

                                        <option value="IN_TRANSIT">
                                            IN_TRANSIT
                                        </option>

                                        <option value="DELIVERED">
                                            DELIVERED
                                        </option>

                                        <option value="CANCELLED">
                                            CANCELLED
                                        </option>
                                    </select>

                                </div>

                                <div className="shipment-form-group full-width">

                                    <label>
                                        Pickup Address
                                    </label>

                                    <textarea
                                        name="pickupAddress"
                                        value={
                                            editingShipment.pickupAddress
                                        }
                                        onChange={handleEditChange}
                                        rows="3"
                                        required
                                    />

                                </div>

                                <div className="shipment-form-group full-width">

                                    <label>
                                        Delivery Address
                                    </label>

                                    <textarea
                                        name="deliveryAddress"
                                        value={
                                            editingShipment.deliveryAddress
                                        }
                                        onChange={handleEditChange}
                                        rows="3"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="shipment-modal-footer">

                                <button
                                    type="button"
                                    className="cancel-edit-button"
                                    onClick={closeEditShipment}
                                    disabled={updatingShipment}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-shipment-button"
                                    disabled={updatingShipment}
                                >
                                    {updatingShipment
                                        ? "Updating..."
                                        : "💾 Update Shipment"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* Delete Confirmation Modal */}
            {shipmentToDelete && (

                <div
                    className="shipment-modal-overlay delete-confirmation-overlay"
                    onClick={closeDeleteConfirmation}
                >

                    <div
                        className="delete-confirmation-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="delete-confirmation-icon">
                            🗑️
                        </div>

                        <h2>
                            Delete Shipment?
                        </h2>

                        <p>
                            Are you sure you want to delete
                            this shipment?
                        </p>

                        <div className="delete-shipment-info">

                            <strong>
                                {shipmentToDelete.trackingNumber}
                            </strong>

                            <span>
                                {shipmentToDelete.senderName}
                                {" → "}
                                {shipmentToDelete.receiverName}
                            </span>

                        </div>

                        <p className="delete-warning">
                            This action cannot be undone.
                        </p>

                        <div className="delete-confirmation-actions">

                            <button
                                type="button"
                                className="cancel-delete-button"
                                onClick={closeDeleteConfirmation}
                                disabled={deletingShipment}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="confirm-delete-button"
                                onClick={handleDeleteShipment}
                                disabled={deletingShipment}
                            >
                                {deletingShipment
                                    ? "Deleting..."
                                    : "🗑 Delete Shipment"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminShipments;