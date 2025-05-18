import "./App.css";
import { useState } from "react";

function App() {
    const [command, setCommand] = useState("");

    const handleSend = async () => {
        await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ command }),
        });
        setCommand("");
    };

    return (
        <>
            <h1>Type a command</h1>
            <div className="card">
                <input
                    type="text"
                    placeholder="Type a command"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </>
    );
}

export default App;
