import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "../styles/CustomerNotifications.css";

function CustomerNotifications() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = localStorage.getItem("userId");

    const loadNotifications = async () => {

        if (!userId) {
            setError("Customer information not found. Please login again.");
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/api/notifications/user/${userId}`
            );

            setNotifications(response.data);

        } catch (error) {

            console.error("Notification loading error:", error);

            setError(
                "Unable to load notifications. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAsRead = async (notificationId) => {

        try {

            await api.put(
                `/api/notifications/${notificationId}/read`
            );

            setNotifications((previousNotifications) =>
                previousNotifications.map((notification) =>
                    notification.id === notificationId
                        ? {
                            ...notification,
                            read: true
                        }
                        : notification
                )
            );

        } catch (error) {

            console.error(
                "Mark notification as read error:",
                error
            );

            alert("Unable to mark notification as read.");

        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    return (
        <div className="customer-notifications">

            {/* Header */}
            <header className="notification-header">

                <div>

                    <h1>Notifications</h1>

                    <p>
                        Stay updated with your shipment activities.
                    </p>

                </div>

                <LogoutButton />

            </header>

            {/* Summary */}
            <section className="notification-summary">

                <div className="notification-stat">

                    <span className="notification-stat-icon">
                        🔔
                    </span>

                    <div>
                        <strong>
                            {notifications.length}
                        </strong>

                        <span>
                            Total Notifications
                        </span>
                    </div>

                </div>

                <div className="notification-stat">

                    <span className="notification-stat-icon unread">
                        📩
                    </span>

                    <div>
                        <strong>
                            {unreadCount}
                        </strong>

                        <span>
                            Unread Notifications
                        </span>
                    </div>

                </div>

            </section>

            {/* Main Content */}
            <section className="notification-container">

                <div className="notification-toolbar">

                    <div>
                        <h2>Recent Notifications</h2>

                        <p>
                            Notifications related to your shipments
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadNotifications}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {/* Loading */}
                {loading && (
                    <div className="notification-message">
                        <div className="notification-loader">
                            Loading notifications...
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="notification-error">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    notifications.length === 0 && (
                        <div className="notification-empty">

                            <div className="empty-icon">
                                🔔
                            </div>

                            <h3>No Notifications</h3>

                            <p>
                                You don't have any notifications yet.
                            </p>

                        </div>
                    )}

                {/* Notifications */}
                {!loading &&
                    !error &&
                    notifications.length > 0 && (

                        <div className="notification-list">

                            {notifications.map((notification) => (

                                <div
                                    key={notification.id}
                                    className={`notification-item ${
                                        notification.read
                                            ? "notification-read"
                                            : "notification-unread"
                                    }`}
                                >

                                    <div className="notification-icon">
                                        {notification.read
                                            ? "✓"
                                            : "🔔"}
                                    </div>

                                    <div className="notification-content">

                                        <div className="notification-title-row">

                                            <h3>
                                                {notification.title}
                                            </h3>

                                            {!notification.read && (
                                                <span className="unread-badge">
                                                    NEW
                                                </span>
                                            )}

                                        </div>

                                        <p>
                                            {notification.message}
                                        </p>

                                        <span className="notification-date">
                                            {notification.createdAt
                                                ? new Date(
                                                    notification.createdAt
                                                ).toLocaleString()
                                                : "Date unavailable"}
                                        </span>

                                    </div>

                                    {!notification.read && (

                                        <button
                                            className="read-button"
                                            onClick={() =>
                                                markAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            Mark as read
                                        </button>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                {/* Back Button */}
                <div className="notification-footer">

                    <button
                        className="back-button"
                        onClick={() => navigate("/customer")}
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </section>

        </div>
    );
}

export default CustomerNotifications;