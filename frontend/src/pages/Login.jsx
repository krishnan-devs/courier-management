import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/api/auth/login", {
                email: email,
                password: password
            });

            console.log("Login response:", response.data);

            const token = response.data.token;
            const role = response.data.role;
            const userId = response.data.userId;

            // Store JWT
            localStorage.setItem("token", token);

            // Store user role
            localStorage.setItem("role", role);

            // Store logged-in user ID
            localStorage.setItem("userId", userId);

            console.log("JWT stored successfully");
            console.log("User role:", role);
            console.log("User ID:", userId);

            alert("Login successful!");

            // Role-based navigation
            if (role === "ADMIN") {

                navigate("/admin");

            } else if (role === "STAFF") {

                navigate("/staff");

            } else if (role === "CUSTOMER") {

                navigate("/customer");

            } else {

                console.error("Unknown role:", role);
                navigate("/");

            }

        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Login failed. Please check your email and password."
            );

        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Courier Management System</h1>

                <p className="login-subtitle">
                    Login to your account
                </p>

                <form
                    onSubmit={handleLogin}
                    autoComplete="off"
                >

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="login-email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="login-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />

                    </div>

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="register-link">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;