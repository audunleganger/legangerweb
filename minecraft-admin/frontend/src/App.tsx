import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const getDifficulty = async (): Promise<string> => {
    const response = await fetch("/api/difficulty");
    const data = await response.json();
    return data.difficulty;
};

const postDifficulty = async (difficulty: string): Promise<string> => {
    const response = await fetch("/api/difficulty", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty: { difficulty } }),
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`Error: ${data.error}`);
        return "";
    }
    return data.message;
};

const postTime = async (time: string): Promise<string> => {
    const response = await fetch("/api/time", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ time: { time } }),
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`Error: ${data.error}`);
        return "";
    }
    return data.message;
};

const getGameMode = async (playerName: string): Promise<string> => {
    const response = await fetch(
        `/api/gamemode?playerName=${encodeURIComponent(playerName)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const data = await response.json();
    console.log("Game mode response:", data);
    if (!response.ok) {
        alert(`Error: ${data.error}`);
        return "";
    }
    return data.gamemode;
};

const postGameMode = async (
    playerName: string,
    gamemode: string
): Promise<string> => {
    const response = await fetch("/api/gamemode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            playerName: { playerName },
            gamemode: { gamemode },
        }),
    });
    const data = await response.json();
    if (!response.ok) {
        alert(`Error: ${data.error}`);
        return "";
    }
    return data.message;
};

function App() {
    const [command, setCommand] = useState("");
    const [currentDifficulty, setCurrentDifficulty] = useState<string>("");
    const [currentGameMode, setCurrentGameMode] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("AudunTheViking");

    useEffect(() => {
        getDifficulty().then((difficulty) => {
            setCurrentDifficulty(difficulty);
        });
        getGameMode(playerName).then((gamemode) => {
            console.log("Current gamemode:", gamemode);
            setCurrentGameMode(gamemode);
        });
        const socket = io({ path: "/socket.io" });
        socket.on("difficulty", (difficulty: string) => {
            console.log("Received difficulty update:", difficulty);
            setCurrentDifficulty(difficulty);
        });
        socket.on("gamemode", (gamemode: string) => {
            console.log("Received gamemode update:", gamemode);
            setCurrentGameMode(gamemode);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

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

    // const sendCommand = async (command: string) => {
    //     const response = await fetch("/api", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ command: `${command}` }),
    //     });
    //     const data = await response.json();
    //     if (!response.ok) {
    //         alert(`Error: ${data.error}`);
    //         return;
    //     }
    // };

    return (
        <>
            <h1>MC Admin panel</h1>
            <div className="card">
                <span style={{ paddingRight: "1em" }}>Player name</span>
                <input
                    type="text"
                    placeholder="Name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
            </div>
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
            <div className="time-buttons">
                <button onClick={() => postTime("day")}>Morgen</button>
                <button onClick={() => postTime("noon")}>Middag</button>
                <button onClick={() => postTime("night")}>Kveld</button>
                <button onClick={() => postTime("midnight")}>Midnatt</button>
            </div>
            <div className="difficulty-buttons">
                <button
                    disabled={currentDifficulty === "peaceful"}
                    onClick={() => postDifficulty("peaceful")}
                >
                    Fredelig
                </button>
                <button
                    disabled={currentDifficulty === "easy"}
                    onClick={() => postDifficulty("easy")}
                >
                    Lett
                </button>
                <button
                    disabled={currentDifficulty === "normal"}
                    onClick={() => postDifficulty("normal")}
                >
                    Normal
                </button>
                <button
                    disabled={currentDifficulty === "hard"}
                    onClick={() => postDifficulty("hard")}
                >
                    Vanskelig
                </button>
            </div>
            <div className="difficulty">
                <h2>Current difficulty: {currentDifficulty}</h2>
            </div>
            <div className="gamemode">
                <button
                    onClick={async () => {
                        postGameMode(playerName, "survival");
                    }}
                >
                    Survival
                </button>
                <button
                    className="gamemode"
                    onClick={async () => {
                        postGameMode(playerName, "creative");
                    }}
                >
                    Creative
                </button>
                <h2>Current gamemode: {currentGameMode}</h2>
            </div>
        </>
    );
}

export default App;
