import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import AdminDashboard from "../pages/AdminDashboard";
import StaffDashboard from "../pages/StaffDashboard";
import CustomerDashboard from "../pages/CustomerDashboard";
import BookShipment from "../pages/BookShipment";
import ShipmentHistory from "../pages/ShipmentHistory";
import TrackShipment from "../pages/TrackShipment";
import CustomerNotifications from "../pages/CustomerNotifications";

import AssignedShipments from "../pages/AssignedShipments";
import UpdateDeliveryStatus from "../pages/UpdateDeliveryStatus";
import DeliveryManagement from "../pages/DeliveryManagement";
import StaffManagement from "../pages/StaffManagement";
import AdminShipments from "../pages/AdminShipments";
import AdminDeliveries from "../pages/AdminDeliveries";
import AdminNotifications from "../pages/AdminNotifications";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>

            {/* Default Route */}
            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            {/* Public Routes */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN - STAFF MANAGEMENT */}
            <Route
                path="/admin/staff"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <StaffManagement />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN - SHIPMENT MANAGEMENT */}
            <Route
                path="/admin/shipments"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminShipments />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN - DELIVERY MANAGEMENT */}
            <Route
                path="/admin/deliveries"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminDeliveries />
                    </ProtectedRoute>
                }
            />

            {/* STAFF */}
            <Route
                path="/staff"
                element={
                    <ProtectedRoute allowedRole="STAFF">
                        <StaffDashboard />
                    </ProtectedRoute>
                }
            />

            {/* STAFF - ASSIGNED SHIPMENTS */}
            <Route
                path="/staff/shipments"
                element={
                    <ProtectedRoute allowedRole="STAFF">
                        <AssignedShipments />
                    </ProtectedRoute>
                }
            />

            {/* STAFF - UPDATE DELIVERY STATUS */}
            <Route
                path="/staff/status"
                element={
                    <ProtectedRoute allowedRole="STAFF">
                        <UpdateDeliveryStatus />
                    </ProtectedRoute>
                }
            />

            {/* STAFF - DELIVERY MANAGEMENT */}
            <Route
                path="/staff/delivery-management"
                element={
                    <ProtectedRoute allowedRole="STAFF">
                        <DeliveryManagement />
                    </ProtectedRoute>
                }
            />

            {/* CUSTOMER */}
            <Route
                path="/customer"
                element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                        <CustomerDashboard />
                    </ProtectedRoute>
                }
            />

            {/* CUSTOMER - BOOK SHIPMENT */}
            <Route
                path="/customer/book-shipment"
                element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                        <BookShipment />
                    </ProtectedRoute>
                }
            />

            {/* CUSTOMER - SHIPMENT HISTORY */}
            <Route
                path="/customer/shipments"
                element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                        <ShipmentHistory />
                    </ProtectedRoute>
                }
            />

            {/* CUSTOMER - TRACK SHIPMENT */}
            <Route
                path="/customer/track"
                element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                        <TrackShipment />
                    </ProtectedRoute>
                }
            />

            {/* CUSTOMER - NOTIFICATIONS */}
            <Route
                path="/customer/notifications"
                element={
                    <ProtectedRoute allowedRole="CUSTOMER">
                        <CustomerNotifications />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN - NOTIFICATIONS */}
            <Route
                path="/admin/notifications"
                element={
                    <ProtectedRoute allowedRole="ADMIN">
                        <AdminNotifications />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;