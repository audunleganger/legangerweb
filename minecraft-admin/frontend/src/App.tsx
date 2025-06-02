import "./App.css";
import { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    // useNavigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

function getUsernameFromToken(token: string): string {
    if (!token) return "unknown";
    try {
        const decoded = jwtDecode<{ username: string }>(token);
        return decoded.username || "unknown";
    } catch (error) {
        console.error("Failed to decode token:", error);
        return "unknown";
    }
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!localStorage.getItem("token")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    // Check if the token is valid and not expired
    const token = localStorage.getItem("token");
    const username = getUsernameFromToken(token || "");
    console.log("Username from token:", username);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/admin" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                ></Route>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/admin" replace />
                        ) : (
                            <Login onLogin={() => setIsAuthenticated(true)} />
                        )
                    }
                ></Route>
                <Route
                    path="/admin"
                    element={
                        isAuthenticated ? (
                            <AdminPanel
                                username={username}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                ></Route>
            </Routes>
        </Router>
    );
}

export default App;
