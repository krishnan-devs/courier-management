import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalShipments: 0,
        pendingShipments: 0,
        inTransit: 0,
        delivered: 0,
        cancelled: 0
    });

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchDashboard();
        fetchNotifications();
    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/api/admin/dashboard");

            const data = response.data;

            console.log("Admin Dashboard Data:", data);

            setDashboard(data);

        } catch (error) {

            console.error("Dashboard error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert("You are not authorized to access Admin Dashboard.");

                navigate("/login");
            }
        }
    };

    const fetchNotifications = async () => {

        try {

            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.warn("Admin userId not found.");
                return;
            }

            const response = await api.get(
                `/api/notifications/user/${userId}`
            );

            console.log("Admin Notifications:", response.data);

            setNotifications(response.data || []);

        } catch (error) {

            console.error("Notification error:", error);

        }
    };

    const markAsRead = async (notificationId) => {

        try {

            await api.put(
                `/api/notifications/${notificationId}/read`
            );

            setNotifications((previousNotifications) =>
                previousNotifications.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, read: true }
                        : notification
                )
            );

        } catch (error) {

            console.error("Mark notification as read error:", error);

        }
    };

    return (
        <div className="admin-dashboard">

            {/* HEADER */}

            <div className="admin-header">

                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Courier Management System</p>
                </div>

                <LogoutButton />

            </div>


            {/* DASHBOARD CARDS */}

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Shipments</h3>
                    <p>{dashboard.totalShipments}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Pending Shipments</h3>
                    <p>{dashboard.pendingShipments}</p>
                </div>

                <div className="dashboard-card">
                    <h3>In Transit</h3>
                    <p>{dashboard.inTransit}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Delivered</h3>
                    <p>{dashboard.delivered}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Cancelled</h3>
                    <p>{dashboard.cancelled}</p>
                </div>

            </div>


            {/* ADMIN ACTIONS */}

            <div className="admin-actions">

                <button
                    className="admin-action-card"
                    onClick={() => navigate("/admin/deliveries")}
                >

                    <div className="admin-action-icon">
                        🚚
                    </div>

                    <div className="admin-action-content">

                        <h3>Manage Deliveries</h3>

                        <p>
                            Assign shipments and manage delivery status.
                        </p>

                        <span>
                            Open Deliveries →
                        </span>

                    </div>

                </button>


                <button
                    className="admin-action-card"
                    onClick={() => navigate("/admin/staff")}
                >

                    <div className="admin-action-icon">
                        👨‍💼
                    </div>

                    <div className="admin-action-content">

                        <h3>Manage Staff</h3>

                        <p>
                            Create, update and manage courier staff.
                        </p>

                        <span>
                            Open Staff →
                        </span>

                    </div>

                </button>


                <button
                    className="admin-action-card"
                    onClick={() => navigate("/admin/shipments")}
                >

                    <div className="admin-action-icon">
                        📦
                    </div>

                    <div className="admin-action-content">

                        <h3>Manage Shipments</h3>

                        <p>
                            View and manage all courier shipments.
                        </p>

                        <span>
                            Open Shipments →
                        </span>

                    </div>

                </button>

            </div>


            {/* NOTIFICATIONS */}

            <div className="admin-notifications">

                <div className="notifications-header">

                    <div>
                        <h2>Recent Notifications</h2>
                        <p>Latest courier system notifications</p>
                    </div>

                    <button
                        className="view-all-button"
                        onClick={() => navigate("/admin/notifications")}
                    >
                        View All
                    </button>

                </div>


                {notifications.length === 0 ? (

                    <div className="no-notifications">
                        No notifications available.
                    </div>

                ) : (

                    <div className="notification-list">

                        {notifications.slice(0, 5).map((notification) => (

                            <div
                                key={notification.id}
                                className={`notification-item ${
                                    notification.read
                                        ? "notification-read"
                                        : "notification-unread"
                                }`}
                            >

                                <div className="notification-icon">
                                    🔔
                                </div>

                                <div className="notification-content">

                                    <h3>
                                        {notification.title}
                                    </h3>

                                    <p>
                                        {notification.message}
                                    </p>

                                </div>

                                {!notification.read && (

                                    <button
                                        className="mark-read-button"
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                    >
                                        Mark as Read
                                    </button>

                                )}

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminDashboard;