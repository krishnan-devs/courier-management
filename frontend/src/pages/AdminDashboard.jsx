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

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {

        try {

            const response = await api.get("/api/admin/dashboard");

            const data = response.data;

            console.log("Admin Dashboard Data:", data);

            setDashboard(data);

        } catch (error) {

            console.error("Dashboard error:", error);

            if (error.response?.status === 401 ||
                error.response?.status === 403) {

                alert("You are not authorized to access Admin Dashboard.");

                navigate("/login");
            }
        }
    };

    return (
        <div className="admin-dashboard">

            <div className="admin-header">

                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Courier Management System</p>
                </div>

                <LogoutButton />

            </div>

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

            <div className="admin-actions">

                <button onClick={() => navigate("/admin/deliveries")}>
                    Manage Deliveries
                </button>

                <button onClick={() => navigate("/admin/staff")}>
                    Manage Staff
                </button>

                <button onClick={() => navigate("/admin/shipments")}>
                    Manage Shipments
                </button>

            </div>

        </div>
    );
}

export default AdminDashboard;