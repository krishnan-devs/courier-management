import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role
    if (role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;