import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "../styles/CustomerDashboard.css";

function CustomerDashboard() {

    return (
        <div className="customer-dashboard">

            {/* Header */}
            <header className="customer-header">

                <div>
                    <h1>Customer Dashboard</h1>
                    <p>Manage your courier shipments easily</p>
                </div>

                <LogoutButton />

            </header>

            {/* Welcome Section */}
            <section className="customer-welcome">

                <div>
                    <span className="welcome-label">
                        Welcome back
                    </span>

                    <h2>Courier Management System</h2>

                    <p>
                        Book a new shipment, view your shipment history,
                        or track your courier in real time.
                    </p>
                </div>

                <div className="welcome-icon">
                    📦
                </div>

            </section>

            {/* Action Cards */}
            <section className="customer-actions">

                {/* Book Shipment */}
                <div className="customer-card">

                    <div className="card-icon book-icon">
                        📦
                    </div>

                    <div className="card-content">

                        <h3>Book Shipment</h3>

                        <p>
                            Send a new courier shipment by providing
                            sender, receiver, and package details.
                        </p>

                        <Link
                            to="/customer/book-shipment"
                            className="customer-button"
                        >
                            Book Shipment
                            <span>→</span>
                        </Link>

                    </div>

                </div>

                {/* Shipment History */}
                <div className="customer-card">

                    <div className="card-icon history-icon">
                        🧾
                    </div>

                    <div className="card-content">

                        <h3>Shipment History</h3>

                        <p>
                            View all your previous shipments and
                            check their current status.
                        </p>

                        <Link
                            to="/customer/shipments"
                            className="customer-button"
                        >
                            View History
                            <span>→</span>
                        </Link>

                    </div>

                </div>

                {/* Track Shipment */}
                <div className="customer-card">

                    <div className="card-icon tracking-icon">
                        📍
                    </div>

                    <div className="card-content">

                        <h3>Track Shipment</h3>

                        <p>
                            Track your courier using the shipment
                            tracking number.
                        </p>

                        <Link
                            to="/customer/track"
                            className="customer-button"
                        >
                            Track Shipment
                            <span>→</span>
                        </Link>

                    </div>

                </div>

                {/* Notifications */}
                <div className="customer-card">

                    <div className="card-icon notification-icon">
                        🔔
                    </div>

                    <div className="card-content">

                        <h3>Notifications</h3>

                        <p>
                            View important updates and notifications
                            related to your shipments.
                        </p>

                        <Link
                            to="/customer/notifications"
                            className="customer-button"
                        >
                            View Notifications
                            <span>→</span>
                        </Link>

                    </div>

                </div>

            </section>

            {/* Quick Info */}
            <section className="customer-info">

                <div className="info-item">
                    <span>📦</span>
                    <div>
                        <strong>Book</strong>
                        <p>Create a new shipment</p>
                    </div>
                </div>

                <div className="info-item">
                    <span>🧾</span>
                    <div>
                        <strong>History</strong>
                        <p>View previous shipments</p>
                    </div>
                </div>

                <div className="info-item">
                    <span>📍</span>
                    <div>
                        <strong>Track</strong>
                        <p>Check shipment status</p>
                    </div>
                </div>

                <div className="info-item">
                    <span>🔔</span>
                    <div>
                        <strong>Notifications</strong>
                        <p>View shipment updates</p>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default CustomerDashboard;