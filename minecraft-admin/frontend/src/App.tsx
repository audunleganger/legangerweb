import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
    const [command, setCommand] = useState("");
    const [currentDifficulty, setCurrentDifficulty] = useState<string>("");

    // useEffect(() => {
    //     const socket = io("http://mc-backend:8000");

    //     socket.on("difficulty", (difficulty: string) => {
    //         console.log("Received difficulty update:", difficulty);
    //         setCurrentDifficulty(difficulty);
    //     });
    // });

    const handleSend = async () => {
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ command }),
        });
        const data = await response.json();
        if (!response.ok) {
            alert(`Error: ${data.error}`);
            return;
        }
        setCommand("");
    };

    const sendCommand = async (command: string) => {
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ command: `${command}` }),
        });
        const data = await response.json();
        if (!response.ok) {
            alert(`Error: ${data.error}`);
            return;
        }
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend}>Send</button>
            </div>
            <div className="difficulty-buttons">
                <button onClick={() => sendCommand("difficulty peaceful")}>
                    Fredelig
                </button>
                <button onClick={() => sendCommand("difficulty easy")}>
                    Lett
                </button>
                <button onClick={() => sendCommand("difficulty normal")}>
                    Normal
                </button>
                <button onClick={() => sendCommand("difficulty hard")}>
                    Vanskelig
                </button>
            </div>
            <div className="time-buttons">
                <button onClick={() => sendCommand("time set day")}>
                    Morgen
                </button>
                <button onClick={() => sendCommand("time set noon")}>
                    Middag
                </button>
                <button onClick={() => sendCommand("time set night")}>
                    Kveld
                </button>
                <button onClick={() => sendCommand("time set midnight")}>
                    Midnatt
                </button>
            </div>
            <div className="difficulty">
                <h2>Current difficulty: {currentDifficulty}</h2>
            </div>
        </>
    );
}

export default App;
