import { useEffect, useState } from "react";
import api from "../services/api";
import LogoutButton from "../components/LogoutButton";
import "../styles/StaffDashboard.css";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await api.get("/api/staff/dashboard");

                console.log("Staff dashboard response:", response.data);

                setMessage(response.data);

            } catch (error) {

                console.error("Dashboard error:", error);

                setMessage("Unable to load staff dashboard.");

            } finally {

                setLoading(false);

            }
        };

        loadDashboard();

    }, []);

    return (
        <div className="staff-dashboard">

            {/* Header */}
            <div className="staff-header">

                <div>
                    <h1>Staff Dashboard</h1>
                    <p>Manage your courier deliveries</p>
                </div>

                <div className="staff-role">
                    STAFF
                </div>

            </div>


            {/* Welcome Section */}
            <div className="staff-welcome">

                <div className="welcome-icon">
                    👋
                </div>

                <div>
                    <h2>Welcome Staff!</h2>

                    {loading ? (
                        <p>Loading dashboard...</p>
                    ) : (
                        <p>{message}</p>
                    )}
                </div>

            </div>


            {/* Dashboard Cards */}
            <div className="staff-card-container">

                {/* Assigned Shipments */}
                <div className="staff-card">

                    <div className="card-icon">
                        📦
                    </div>

                    <h3>Assigned Shipments</h3>

                    <p>
                        View all courier shipments assigned to you.
                    </p>

                    <button
                        onClick={() => navigate("/staff/shipments")}
                    >
                        View Shipments
                    </button>

                </div>


                {/* Delivery Status */}
                <div className="staff-card">

                    <div className="card-icon">
                        🚚
                    </div>

                    <h3>Delivery Status</h3>

                    <p>
                        Update the current status of your assigned deliveries.
                    </p>

                   <button onClick={() => navigate("/staff/status")}>
                        Update Status
                   </button>

                </div>


                {/* Delivery Management */}
                <div className="staff-card">

                    <div className="card-icon">
                        📍
                    </div>

                    <h3>Delivery Management</h3>

                    <p>
                        Manage pickup and delivery operations.
                    </p>

                    <button onClick={() => navigate("/staff/delivery-management")} > 
                        Manage Delivery 
                    </button>

                </div>

            </div>


            {/* Staff Information */}
            <div className="staff-info">

                <h2>Staff Access</h2>

                <p>
                    You can manage shipments assigned to you and
                    update their delivery status.
                </p>

                <div className="access-items">

                    <div>
                        <span>✓</span>
                        View Assigned Shipments
                    </div>

                    <div>
                        <span>✓</span>
                        Update Delivery Status
                    </div>

                    <div>
                        <span>✓</span>
                        Manage Deliveries
                    </div>

                </div>

            </div>


            {/* Logout */}
            <div className="staff-logout">
                <LogoutButton />
            </div>

        </div>
    );
}

export default StaffDashboard;