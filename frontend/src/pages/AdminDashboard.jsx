import { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({
        totalShipments: 0,
        pendingShipments: 0,
        inTransit: 0,
        delivered: 0,
        cancelled: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/admin/dashboard",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard");
            }

            const data = await response.json();

            setDashboard(data);

        } catch (error) {

            console.error("Dashboard error:", error);
            setError("Unable to load dashboard");

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            {/* Header */}

            <div className="admin-header">

                <div>
                    <h1>Admin Dashboard</h1>

                    <p>
                        Manage and monitor courier operations
                    </p>
                </div>

                <LogoutButton />

            </div>

            {/* Error */}

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            {/* Dashboard Statistics */}

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
                    <p>{dashboard.inTransitShipments}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Delivered</h3>
                    <p>{dashboard.deliveredShipments}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Cancelled</h3>
                    <p>{dashboard.cancelledShipments}</p>
                </div>

            </div>

            {/* Admin Actions */}

            <div className="admin-actions">

                {/* Staff Management */}

                <div
                    className="admin-action-card"
                    onClick={() => navigate("/admin/staff")}
                >

                    <div className="admin-action-icon">
                        👥
                    </div>

                    <div className="admin-action-content">

                        <h3>
                            Staff Management
                        </h3>

                        <p>
                            Create and manage courier staff members.
                        </p>

                        <span>
                            Manage Staff →
                        </span>

                    </div>

                </div>

                {/* Shipment Management */}

                <div
                    className="admin-action-card"
                    onClick={() => navigate("/admin/shipments")}
                >

                    <div className="admin-action-icon">
                        📦
                    </div>

                    <div className="admin-action-content">

                        <h3>
                            Shipment Management
                        </h3>

                        <p>
                            View and manage all courier shipments.
                        </p>

                        <span>
                            Manage Shipments →
                        </span>

                    </div>

                </div>

                {/* Delivery Management */}

                <div
                    className="admin-action-card"
                    onClick={() => navigate("/admin/deliveries")}
                >

                    <div className="admin-action-icon">
                        🚚
                    </div>

                    <div className="admin-action-content">

                        <h3>
                            Delivery Management
                        </h3>

                        <p>
                            Manage shipment assignments and delivery status.
                        </p>

                        <span>
                            Manage Deliveries →
                        </span>

                    </div>

                </div>

                {/* Notification Management */}

                <div
                    className="admin-action-card"
                    onClick={() => navigate("/admin/notifications")}
                >

                    <div className="admin-action-icon">
                        🔔
                    </div>

                    <div className="admin-action-content">

                        <h3>
                            Notifications
                        </h3>

                        <p>
                            View and manage courier system notifications.
                        </p>

                        <span>
                            View Notifications →
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;