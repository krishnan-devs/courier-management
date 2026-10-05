import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "../styles/AdminNotifications.css";

function AdminNotifications() {

    const navigate = useNavigate();

    const [userId, setUserId] = useState("1");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [markingRead, setMarkingRead] = useState(false);

    const fetchNotifications = async () => {

        if (!userId || isNaN(userId)) {
            setError("Please enter a valid User ID.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/notifications/user/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await response.json();

            setNotifications(data);

        } catch (error) {

            console.error("Notification fetch error:", error);

            setError(
                error.message ||
                "Unable to load notifications."
            );

            setNotifications([]);

        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {

        try {

            setMarkingRead(true);
            setError("");
            setSuccessMessage("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/notifications/${notificationId}/read`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to mark notification as read");
            }

            const updatedNotification = await response.json();

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification.id === updatedNotification.id
                        ? updatedNotification
                        : notification
                )
            );

            if (
                selectedNotification &&
                selectedNotification.id === updatedNotification.id
            ) {
                setSelectedNotification(updatedNotification);
            }

            setSuccessMessage("Notification marked as read.");

        } catch (error) {

            console.error("Mark notification error:", error);

            setError(
                error.message ||
                "Unable to mark notification as read."
            );

        } finally {
            setMarkingRead(false);
        }
    };

    const handleViewNotification = (notification) => {
        setError("");
        setSuccessMessage("");
        setSelectedNotification(notification);
    };

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "N/A";
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString();
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="admin-notifications-page">

            <div className="notification-header">

                <div>
                    <h1>Notifications</h1>
                    <p>
                        View and manage courier system notifications
                    </p>
                </div>

                <div className="notification-header-actions">
                    <button
                        className="notification-back-btn"
                        onClick={() => navigate("/admin")}
                    >
                        ← Back to Dashboard
                    </button>

                    <LogoutButton />
                </div>

            </div>

            <div className="notification-controls">

                <div className="user-filter">

                    <label htmlFor="userId">
                        User ID
                    </label>

                    <input
                        id="userId"
                        type="number"
                        min="1"
                        value={userId}
                        onChange={(event) =>
                            setUserId(event.target.value)
                        }
                        placeholder="Enter User ID"
                    />

                    <button
                        className="load-notification-btn"
                        onClick={fetchNotifications}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Load Notifications"}
                    </button>

                </div>

                <div className="notification-summary">

                    <div className="summary-card">
                        <span>Total</span>
                        <strong>{notifications.length}</strong>
                    </div>

                    <div className="summary-card unread-summary">
                        <span>Unread</span>
                        <strong>{unreadCount}</strong>
                    </div>

                </div>

            </div>

            {error && (
                <div className="notification-message error-message">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="notification-message success-message">
                    {successMessage}
                </div>
            )}

            {loading ? (

                <div className="notification-empty-state">
                    <div className="notification-loader"></div>
                    <h3>Loading notifications...</h3>
                    <p>Please wait.</p>
                </div>

            ) : notifications.length === 0 ? (

                <div className="notification-empty-state">
                    <div className="empty-notification-icon">
                        🔔
                    </div>

                    <h3>No Notifications</h3>

                    <p>
                        There are no notifications available
                        for User ID {userId}.
                    </p>
                </div>

            ) : (

                <div className="notifications-list">

                    {notifications.map((notification) => (

                        <div
                            key={notification.id}
                            className={`notification-card ${
                                notification.read
                                    ? "notification-read"
                                    : "notification-unread"
                            }`}
                        >

                            <div className="notification-icon">
                                {notification.read ? "📬" : "🔔"}
                            </div>

                            <div className="notification-content">

                                <div className="notification-card-header">

                                    <h3>
                                        {notification.title}
                                    </h3>

                                    <span
                                        className={`notification-status ${
                                            notification.read
                                                ? "read-status"
                                                : "unread-status"
                                        }`}
                                    >
                                        {notification.read
                                            ? "READ"
                                            : "UNREAD"}
                                    </span>

                                </div>

                                <p className="notification-message-text">
                                    {notification.message}
                                </p>

                                <div className="notification-meta">

                                    <span>
                                        User ID: {notification.userId}
                                    </span>

                                    <span>
                                        {formatDate(
                                            notification.createdAt
                                        )}
                                    </span>

                                </div>

                            </div>

                            <div className="notification-actions">

                                <button
                                    className="view-notification-btn"
                                    onClick={() =>
                                        handleViewNotification(
                                            notification
                                        )
                                    }
                                >
                                    View
                                </button>

                                {!notification.read && (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() =>
                                            handleMarkAsRead(
                                                notification.id
                                            )
                                        }
                                        disabled={markingRead}
                                    >
                                        {markingRead
                                            ? "Updating..."
                                            : "Mark Read"}
                                    </button>
                                )}

                            </div>

                        </div>

                    ))}

                </div>
            )}

            {selectedNotification && (

                <div
                    className="notification-modal-overlay"
                    onClick={() =>
                        setSelectedNotification(null)
                    }
                >

                    <div
                        className="notification-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="notification-modal-header">

                            <div>
                                <span className="modal-label">
                                    Notification Details
                                </span>

                                <h2>
                                    {selectedNotification.title}
                                </h2>
                            </div>

                            <button
                                className="modal-close-btn"
                                onClick={() =>
                                    setSelectedNotification(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="notification-detail-body">

                            <div className="notification-detail-row">
                                <span>Notification ID</span>
                                <strong>
                                    #{selectedNotification.id}
                                </strong>
                            </div>

                            <div className="notification-detail-row">
                                <span>User ID</span>
                                <strong>
                                    {selectedNotification.userId}
                                </strong>
                            </div>

                            <div className="notification-detail-row">
                                <span>Status</span>
                                <strong
                                    className={
                                        selectedNotification.read
                                            ? "detail-read"
                                            : "detail-unread"
                                    }
                                >
                                    {selectedNotification.read
                                        ? "READ"
                                        : "UNREAD"}
                                </strong>
                            </div>

                            <div className="notification-detail-row">
                                <span>Created At</span>
                                <strong>
                                    {formatDate(
                                        selectedNotification.createdAt
                                    )}
                                </strong>
                            </div>

                            <div className="notification-detail-message">
                                <span>Message</span>

                                <p>
                                    {selectedNotification.message}
                                </p>
                            </div>

                        </div>

                        <div className="notification-modal-footer">

                            {!selectedNotification.read && (
                                <button
                                    className="mark-read-btn"
                                    onClick={() =>
                                        handleMarkAsRead(
                                            selectedNotification.id
                                        )
                                    }
                                    disabled={markingRead}
                                >
                                    {markingRead
                                        ? "Updating..."
                                        : "Mark as Read"}
                                </button>
                            )}

                            <button
                                className="close-modal-btn"
                                onClick={() =>
                                    setSelectedNotification(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminNotifications;