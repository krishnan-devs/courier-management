import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LogoutButton() {

    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {

        // Remove authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Redirect to login
        navigate("/login");
    };

    const buttonStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "10px 18px",
        border: "1px solid #fecaca",
        borderRadius: "9px",
        backgroundColor: isHovered ? "#dc2626" : "#fff1f2",
        color: isHovered ? "#ffffff" : "#dc2626",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered
            ? "0 4px 12px rgba(220, 38, 38, 0.25)"
            : "0 2px 6px rgba(0, 0, 0, 0.05)"
    };

    return (
        <button
            onClick={handleLogout}
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title="Logout"
        >
            <span
                style={{
                    fontSize: "16px",
                    lineHeight: "1"
                }}
            >
                ↪
            </span>

            <span>
                Logout
            </span>
        </button>
    );
}

export default LogoutButton;