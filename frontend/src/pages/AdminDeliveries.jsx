import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "../styles/AdminDeliveries.css";

function AdminDeliveries() {

    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [staff, setStaff] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedShipmentId, setSelectedShipmentId] = useState("");
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const token = localStorage.getItem("token");

    // ==============================
    // LOAD DELIVERIES
    // ==============================

    const loadDeliveries = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/deliveries",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch deliveries");
            }

            const result = await response.json();

            setDeliveries(result || []);

        } catch (error) {

            console.error("Load deliveries error:", error);

            setError(
                error.message ||
                "Unable to load delivery assignments"
            );

        } finally {

            setLoading(false);

        }
    };

    // ==============================
    // LOAD SHIPMENTS
    // ==============================

    const loadShipments = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/shipments",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch shipments");
            }

            const result = await response.json();

            setShipments(
                Array.isArray(result)
                    ? result
                    : result.data || []
            );

        } catch (error) {

            console.error("Load shipments error:", error);

            setError(
                error.message ||
                "Unable to load shipments"
            );
        }
    };

    // ==============================
    // LOAD STAFF
    // ==============================

    const loadStaff = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/staff",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch staff");
            }

            const result = await response.json();

            setStaff(result || []);

        } catch (error) {

            console.error("Load staff error:", error);

            setError(
                error.message ||
                "Unable to load staff"
            );
        }
    };

    // ==============================
    // INITIAL LOAD
    // ==============================

    useEffect(() => {

        loadDeliveries();
        loadShipments();
        loadStaff();

    }, []);

    // ==============================
    // STATUS CLASS
    // ==============================

    const getStatusClass = (status) => {

        if (!status) {
            return "unknown";
        }

        return status
            .toLowerCase()
            .replace(/\s+/g, "-");
    };

    // ==============================
    // VIEW DETAILS
    // ==============================

    const handleViewDetails = (delivery) => {

        setSelectedDelivery(delivery);
        setShowDetailsModal(true);
        setError("");
        setSuccessMessage("");
    };

    // ==============================
    // OPEN ASSIGN MODAL
    // ==============================

    const handleOpenAssign = (delivery = null) => {

        setSelectedDelivery(delivery);

        if (delivery) {

            setSelectedShipmentId(
                delivery.shipment?.id ||
                delivery.shipmentId ||
                ""
            );

            setSelectedStaffId(
                delivery.staff?.id ||
                delivery.staffId ||
                ""
            );

        } else {

            setSelectedShipmentId("");
            setSelectedStaffId("");
        }

        setShowAssignModal(true);
        setError("");
        setSuccessMessage("");
    };

    // ==============================
    // CREATE / REASSIGN DELIVERY
    // ==============================

    const handleAssignDelivery = async (event) => {

        event.preventDefault();

        if (!selectedShipmentId || !selectedStaffId) {

            setError(
                "Please select both shipment and staff."
            );

            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccessMessage("");

            const shipmentId = Number(selectedShipmentId);
            const staffId = Number(selectedStaffId);

            const deliveryData = {

                shipment: {
                    id: shipmentId
                },

                staff: {
                    id: staffId
                },

                deliveryStatus:
                    selectedDelivery?.deliveryStatus ||
                    "ASSIGNED",

                assignedAt:
                    selectedDelivery?.assignedAt ||
                    new Date().toISOString(),

                deliveredAt:
                    selectedDelivery?.deliveredAt ||
                    null
            };

            let response;

            // Existing delivery -> Update/Reassign
            if (selectedDelivery) {

                response = await fetch(
                    `http://localhost:8080/api/deliveries/${selectedDelivery.id}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(deliveryData)
                    }
                );

            } else {

                // New assignment
                response = await fetch(
                    "http://localhost:8080/api/deliveries",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(deliveryData)
                    }
                );
            }

            const responseText = await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to assign delivery"
                );
            }

            setShowAssignModal(false);
            setSelectedDelivery(null);
            setSelectedShipmentId("");
            setSelectedStaffId("");

            setSuccessMessage(
                selectedDelivery
                    ? "Delivery reassigned successfully!"
                    : "Shipment assigned to staff successfully!"
            );

            await loadDeliveries();

        } catch (error) {

            console.error("Assign delivery error:", error);

            setError(
                error.message ||
                "Unable to assign delivery"
            );

        } finally {

            setSaving(false);
        }
    };

    // ==============================
    // OPEN STATUS MODAL
    // ==============================

    const handleOpenStatus = (delivery) => {

        setSelectedDelivery(delivery);

        setSelectedStatus(
            delivery.deliveryStatus || "ASSIGNED"
        );

        setShowStatusModal(true);

        setError("");
        setSuccessMessage("");
    };

    // ==============================
    // UPDATE STATUS
    // ==============================

    const handleUpdateStatus = async (event) => {

        event.preventDefault();

        if (!selectedDelivery) {
            return;
        }

        try {

            setSaving(true);
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `http://localhost:8080/api/deliveries/${selectedDelivery.id}/status`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: selectedStatus
                    })
                }
            );

            const responseText = await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to update delivery status"
                );
            }

            setShowStatusModal(false);
            setSelectedDelivery(null);

            setSuccessMessage(
                "Delivery status updated successfully!"
            );

            await loadDeliveries();

        } catch (error) {

            console.error(
                "Update status error:",
                error
            );

            setError(
                error.message ||
                "Unable to update delivery status"
            );

        } finally {

            setSaving(false);
        }
    };

    // ==============================
    // OPEN DELETE MODAL
    // ==============================

    const handleOpenDelete = (delivery) => {

        setSelectedDelivery(delivery);

        setShowDeleteModal(true);

        setError("");
        setSuccessMessage("");
    };

    // ==============================
    // DELETE DELIVERY
    // ==============================

    const handleDeleteDelivery = async () => {

        if (!selectedDelivery) {
            return;
        }

        try {

            setDeleting(true);
            setError("");
            setSuccessMessage("");

            const response = await fetch(
                `http://localhost:8080/api/deliveries/${selectedDelivery.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const responseText = await response.text();

            if (!response.ok) {

                throw new Error(
                    responseText ||
                    "Failed to delete delivery"
                );
            }

            setShowDeleteModal(false);

            setSuccessMessage(
                `Delivery #${selectedDelivery.id} deleted successfully!`
            );

            setSelectedDelivery(null);

            await loadDeliveries();

        } catch (error) {

            console.error(
                "Delete delivery error:",
                error
            );

            setError(
                error.message ||
                "Unable to delete delivery"
            );

            setShowDeleteModal(false);

        } finally {

            setDeleting(false);
        }
    };

    // ==============================
    // GET SHIPMENT DETAILS
    // ==============================

    const getShipmentById = (shipmentId) => {

        return shipments.find(
            (shipment) =>
                Number(shipment.id) === Number(shipmentId)
        );
    };

    // ==============================
    // GET STAFF DETAILS
    // ==============================

    const getStaffById = (staffId) => {

        return staff.find(
            (member) =>
                Number(member.id) === Number(staffId)
        );
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="admin-deliveries">

                <div className="delivery-loading-page">

                    <div className="delivery-loading-icon">
                        🚚
                    </div>

                    <h2>
                        Loading Delivery Management...
                    </h2>

                    <p>
                        Please wait while delivery assignments are loaded.
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="admin-deliveries">

            {/* HEADER */}

            <div className="deliveries-header">

                <div>

                    <h1>
                        Delivery Management
                    </h1>

                    <p>
                        Manage shipment assignments and delivery status
                    </p>

                </div>

                <LogoutButton />

            </div>

            {/* BACK BUTTON */}

            <button
                className="back-dashboard-button"
                onClick={() => navigate("/admin")}
            >
                ← Back to Dashboard
            </button>

            {/* ERROR */}

            {error && (
                <div className="delivery-error">
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {successMessage && (
                <div className="delivery-success">
                    {successMessage}
                </div>
            )}

            {/* MAIN CONTAINER */}

            <div className="delivery-list-container">

                {/* LIST HEADER */}

                <div className="delivery-list-header">

                    <div>

                        <h2>
                            Delivery Assignments
                        </h2>

                        <p>
                            Total assignments: {deliveries.length}
                        </p>

                    </div>

                    <div className="delivery-header-actions">

                        <button
                            className="assign-delivery-button"
                            onClick={() =>
                                handleOpenAssign(null)
                            }
                        >
                            + Assign Shipment
                        </button>

                        <button
                            className="refresh-deliveries-button"
                            onClick={loadDeliveries}
                        >
                            ↻ Refresh
                        </button>

                    </div>

                </div>

                {/* EMPTY */}

                {!error &&
                    deliveries.length === 0 && (

                        <div className="delivery-empty">

                            <div className="delivery-empty-icon">
                                🚚
                            </div>

                            <h3>
                                No Delivery Assignments
                            </h3>

                            <p>
                                There are currently no delivery assignments.
                            </p>

                            <button
                                className="empty-assign-button"
                                onClick={() =>
                                    handleOpenAssign(null)
                                }
                            >
                                + Create First Assignment
                            </button>

                        </div>
                    )}

                {/* TABLE */}

                {deliveries.length > 0 && (

                    <div className="delivery-table-wrapper">

                        <table className="delivery-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Shipment
                                    </th>

                                    <th>
                                        Staff
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Assigned At
                                    </th>

                                    <th>
                                        Delivered At
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {deliveries.map(
                                    (delivery) => {

                                        const shipment =
                                            delivery.shipment;

                                        const deliveryStaff =
                                            delivery.staff;

                                        return (

                                            <tr
                                                key={
                                                    delivery.id
                                                }
                                            >

                                                {/* ID */}

                                                <td>

                                                    <strong>
                                                        #
                                                        {
                                                            delivery.id
                                                        }
                                                    </strong>

                                                </td>

                                                {/* SHIPMENT */}

                                                <td>

                                                    <div className="delivery-primary-info">

                                                        <strong>
                                                            {
                                                                shipment?.trackingNumber ||
                                                                `Shipment #${
                                                                    shipment?.id ||
                                                                    delivery.shipmentId ||
                                                                    "-"
                                                                }`
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                shipment?.receiverName ||
                                                                "No receiver"
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* STAFF */}

                                                <td>

                                                    <div className="delivery-primary-info">

                                                        <strong>
                                                            {
                                                                deliveryStaff?.name ||
                                                                (
                                                                    delivery.staffId
                                                                        ? `Staff #${delivery.staffId}`
                                                                        : "Not Assigned"
                                                                )
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                deliveryStaff?.location ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`delivery-status ${getStatusClass(
                                                            delivery.deliveryStatus
                                                        )}`}
                                                    >
                                                        {
                                                            delivery.deliveryStatus ||
                                                            "UNKNOWN"
                                                        }
                                                    </span>

                                                </td>

                                                {/* ASSIGNED */}

                                                <td>

                                                    {
                                                        delivery.assignedAt
                                                            ? new Date(
                                                                  delivery.assignedAt
                                                              ).toLocaleString()
                                                            : "-"
                                                    }

                                                </td>

                                                {/* DELIVERED */}

                                                <td>

                                                    {
                                                        delivery.deliveredAt
                                                            ? new Date(
                                                                  delivery.deliveredAt
                                                              ).toLocaleString()
                                                            : "-"
                                                    }

                                                </td>

                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="delivery-actions">

                                                        <button
                                                            className="view-delivery-button"
                                                            onClick={() =>
                                                                handleViewDetails(
                                                                    delivery
                                                                )
                                                            }
                                                        >
                                                            👁 View
                                                        </button>

                                                        <button
                                                            className="assign-action-button"
                                                            onClick={() =>
                                                                handleOpenAssign(
                                                                    delivery
                                                                )
                                                            }
                                                        >
                                                            👤 Assign
                                                        </button>

                                                        <button
                                                            className="status-action-button"
                                                            onClick={() =>
                                                                handleOpenStatus(
                                                                    delivery
                                                                )
                                                            }
                                                        >
                                                            🔄 Status
                                                        </button>

                                                        <button
                                                            className="delete-delivery-button"
                                                            onClick={() =>
                                                                handleOpenDelete(
                                                                    delivery
                                                                )
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* ================================= */}
            {/* VIEW DETAILS MODAL */}
            {/* ================================= */}

            {showDetailsModal &&
                selectedDelivery && (

                    <div
                        className="delivery-modal-overlay"
                        onClick={() =>
                            setShowDetailsModal(false)
                        }
                    >

                        <div
                            className="delivery-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="delivery-modal-header">

                                <div>

                                    <h2>
                                        Delivery Details
                                    </h2>

                                    <p>
                                        Delivery #
                                        {
                                            selectedDelivery.id
                                        }
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={() =>
                                        setShowDetailsModal(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="delivery-details-grid">

                                <div className="detail-card">

                                    <h3>
                                        Delivery
                                    </h3>

                                    <p>
                                        <span>
                                            ID
                                        </span>

                                        <strong>
                                            #
                                            {
                                                selectedDelivery.id
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Status
                                        </span>

                                        <span
                                            className={`delivery-status ${getStatusClass(
                                                selectedDelivery.deliveryStatus
                                            )}`}
                                        >
                                            {
                                                selectedDelivery.deliveryStatus ||
                                                "UNKNOWN"
                                            }
                                        </span>
                                    </p>

                                    <p>
                                        <span>
                                            Assigned At
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.assignedAt
                                                    ? new Date(
                                                          selectedDelivery.assignedAt
                                                      ).toLocaleString()
                                                    : "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Delivered At
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.deliveredAt
                                                    ? new Date(
                                                          selectedDelivery.deliveredAt
                                                      ).toLocaleString()
                                                    : "-"
                                            }
                                        </strong>
                                    </p>

                                </div>

                                <div className="detail-card">

                                    <h3>
                                        Shipment
                                    </h3>

                                    <p>
                                        <span>
                                            Tracking Number
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.shipment
                                                    ?.trackingNumber ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Sender
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.shipment
                                                    ?.senderName ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Receiver
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.shipment
                                                    ?.receiverName ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Delivery Address
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.shipment
                                                    ?.deliveryAddress ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                </div>

                                <div className="detail-card">

                                    <h3>
                                        Assigned Staff
                                    </h3>

                                    <p>
                                        <span>
                                            Name
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.staff
                                                    ?.name ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.staff
                                                    ?.email ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.staff
                                                    ?.phone ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                    <p>
                                        <span>
                                            Location
                                        </span>

                                        <strong>
                                            {
                                                selectedDelivery.staff
                                                    ?.location ||
                                                "-"
                                            }
                                        </strong>
                                    </p>

                                </div>

                            </div>

                            <div className="delivery-modal-footer">

                                <button
                                    className="modal-secondary-button"
                                    onClick={() =>
                                        setShowDetailsModal(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            {/* ================================= */}
            {/* ASSIGN / REASSIGN MODAL */}
            {/* ================================= */}

            {showAssignModal && (

                <div
                    className="delivery-modal-overlay"
                    onClick={() =>
                        !saving &&
                        setShowAssignModal(false)
                    }
                >

                    <div
                        className="delivery-modal assignment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="delivery-modal-header">

                            <div>

                                <h2>
                                    {
                                        selectedDelivery
                                            ? "Reassign Delivery"
                                            : "Assign Shipment"
                                    }
                                </h2>

                                <p>
                                    Select shipment and staff member
                                </p>

                            </div>

                            <button
                                className="modal-close-button"
                                disabled={saving}
                                onClick={() =>
                                    setShowAssignModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleAssignDelivery
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Shipment
                                </label>

                                <select
                                    value={
                                        selectedShipmentId
                                    }
                                    onChange={(event) =>
                                        setSelectedShipmentId(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        saving ||
                                        Boolean(
                                            selectedDelivery
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Shipment
                                    </option>

                                    {shipments
                                        .filter(
                                            (shipment) => {

                                                const alreadyAssigned =
                                                    deliveries.some(
                                                        (delivery) =>
                                                            Number(
                                                                delivery.shipment?.id ||
                                                                delivery.shipmentId
                                                            ) ===
                                                            Number(
                                                                shipment.id
                                                            )
                                                    );

                                                return (
                                                    !alreadyAssigned ||
                                                    Number(
                                                        selectedShipmentId
                                                    ) ===
                                                    Number(
                                                        shipment.id
                                                    )
                                                );
                                            }
                                        )
                                        .map(
                                            (shipment) => (

                                                <option
                                                    key={
                                                        shipment.id
                                                    }
                                                    value={
                                                        shipment.id
                                                    }
                                                >
                                                    {
                                                        shipment.trackingNumber
                                                    }
                                                    {" - "}
                                                    {
                                                        shipment.receiverName ||
                                                        "No receiver"
                                                    }
                                                </option>

                                            )
                                        )}

                                </select>

                                {selectedDelivery && (
                                    <small>
                                        Shipment cannot be changed
                                        while reassigning. You can
                                        change the staff member.
                                    </small>
                                )}

                            </div>

                            <div className="form-group">

                                <label>
                                    Staff Member
                                </label>

                                <select
                                    value={
                                        selectedStaffId
                                    }
                                    onChange={(event) =>
                                        setSelectedStaffId(
                                            event.target.value
                                        )
                                    }
                                    disabled={saving}
                                    required
                                >

                                    <option value="">
                                        Select Staff
                                    </option>

                                    {staff.map(
                                        (member) => (

                                            <option
                                                key={
                                                    member.id
                                                }
                                                value={
                                                    member.id
                                                }
                                            >
                                                {
                                                    member.name
                                                }
                                                {" - "}
                                                {
                                                    member.location ||
                                                    "No location"
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            <div className="delivery-modal-footer">

                                <button
                                    type="button"
                                    className="modal-secondary-button"
                                    disabled={saving}
                                    onClick={() =>
                                        setShowAssignModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-primary-button"
                                    disabled={saving}
                                >
                                    {
                                        saving
                                            ? "Saving..."
                                            : selectedDelivery
                                                ? "Reassign Staff"
                                                : "Assign Shipment"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* ================================= */}
            {/* STATUS MODAL */}
            {/* ================================= */}

            {showStatusModal &&
                selectedDelivery && (

                    <div
                        className="delivery-modal-overlay"
                        onClick={() =>
                            !saving &&
                            setShowStatusModal(
                                false
                            )
                        }
                    >

                        <div
                            className="delivery-modal status-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="delivery-modal-header">

                                <div>

                                    <h2>
                                        Update Delivery Status
                                    </h2>

                                    <p>
                                        Delivery #
                                        {
                                            selectedDelivery.id
                                        }
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    disabled={saving}
                                    onClick={() =>
                                        setShowStatusModal(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={
                                    handleUpdateStatus
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Delivery Status
                                    </label>

                                    <select
                                        value={
                                            selectedStatus
                                        }
                                        onChange={(event) =>
                                            setSelectedStatus(
                                                event.target.value
                                            )
                                        }
                                        disabled={saving}
                                        required
                                    >

                                        <option value="ASSIGNED">
                                            ASSIGNED
                                        </option>

                                        <option value="PICKED_UP">
                                            PICKED_UP
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

                                {selectedStatus ===
                                    "DELIVERED" && (

                                    <div className="status-warning">

                                        ⚠️ Marking this delivery as
                                        <strong>
                                            {" "}DELIVERED
                                        </strong>
                                        {" "}will also create a
                                        shipment notification.

                                    </div>
                                )}

                                <div className="delivery-modal-footer">

                                    <button
                                        type="button"
                                        className="modal-secondary-button"
                                        disabled={saving}
                                        onClick={() =>
                                            setShowStatusModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="modal-primary-button"
                                        disabled={saving}
                                    >
                                        {
                                            saving
                                                ? "Updating..."
                                                : "Update Status"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>
                )}

            {/* ================================= */}
            {/* DELETE MODAL */}
            {/* ================================= */}

            {showDeleteModal &&
                selectedDelivery && (

                    <div
                        className="delivery-modal-overlay"
                        onClick={() =>
                            !deleting &&
                            setShowDeleteModal(
                                false
                            )
                        }
                    >

                        <div
                            className="delete-delivery-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="delete-delivery-icon">
                                🗑️
                            </div>

                            <h2>
                                Delete Delivery?
                            </h2>

                            <p>
                                Are you sure you want to delete
                                delivery #
                                <strong>
                                    {
                                        selectedDelivery.id
                                    }
                                </strong>
                                ?
                            </p>

                            <div className="delete-delivery-info">

                                <span>
                                    Shipment
                                </span>

                                <strong>
                                    {
                                        selectedDelivery.shipment
                                            ?.trackingNumber ||
                                        "-"
                                    }
                                </strong>

                            </div>

                            <div className="delete-delivery-warning">

                                This action cannot be undone.

                            </div>

                            <div className="delete-delivery-actions">

                                <button
                                    className="modal-secondary-button"
                                    disabled={deleting}
                                    onClick={() =>
                                        setShowDeleteModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    className="confirm-delete-delivery-button"
                                    disabled={deleting}
                                    onClick={
                                        handleDeleteDelivery
                                    }
                                >
                                    {
                                        deleting
                                            ? "Deleting..."
                                            : "Yes, Delete"
                                    }
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
}

export default AdminDeliveries;