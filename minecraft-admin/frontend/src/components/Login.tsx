import { useEffect, useState } from "react";

function Login({ onLogin }: { onLogin: (name: string) => void }) {
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pin }),
        });
        const data = await response.json();
        setLoading(false);
        if (response.ok && data.token) {
            localStorage.setItem("token", data.token);
            onLogin(pin);
        } else {
            alert(`Login failed: ${data.error || "Unknown error"}`);
        }
    };

    return (
        <div className="login">
            <h1>Minecraft Admin login</h1>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => {
                    setPin(e.target.value);
                }}
            />
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
}

export default Login;
