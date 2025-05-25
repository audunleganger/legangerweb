import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
    getDifficulty,
    postDifficulty,
    getTime,
    postTime,
    getGameMode,
    postGameMode,
} from "./api";

type Player = {
    name: string;
    gameMode: string;
};

function App() {
    const [command, setCommand] = useState("");
    const [currentDifficulty, setCurrentDifficulty] = useState<string>("");
    const [worldName, setWorldName] = useState<string>("unknown");
    const [currentGameMode, setCurrentGameMode] = useState<string>("");
    const [playerName, setPlayerName] = useState<string>("AudunTheViking");
    const [time, setTime] = useState<string>("");
    const [currentPlayers, setCurrentPlayers] = useState<Player[]>([]);
    const [playerInWorld, setPlayerInWorld] = useState<Boolean>(false);

    useEffect(() => {
        // getDifficulty().then((difficulty) => {
        //     setCurrentDifficulty(difficulty);
        // });
        // getGameMode(playerName).then((gamemode) => {
        //     console.log("Current gamemode:", gamemode);
        //     setCurrentGameMode(gamemode);
        // });
        const socket = io({ path: "/socket.io" });
        socket.on("connection", (gameState) => {
            console.log("Connected to server via socket.io");
            setCurrentPlayers(gameState.currentPlayers);
            setWorldName(gameState.worldName);
            setCurrentDifficulty(gameState.currentDifficulty);
            setTime(gameState.currentTime);
        });

        socket.on("difficultyUpdate", (difficulty: string) => {
            console.log("Received difficulty update:", difficulty);
            setCurrentDifficulty(difficulty);
        });
        socket.on("playersUpdate", (players: Player[]) => {
            console.log("Received players update:", players);
            setCurrentPlayers(players);
            const player = players.find((p) => p.name === playerName);
            if (player) {
                setPlayerInWorld(true);
                setCurrentGameMode(player.gameMode);
            } else {
                setPlayerInWorld(false);
                setCurrentGameMode("unknown");
            }
        });
        // socket.on("gamemode", (gamemode: string) => {
        //     console.log("Received gamemode update:", gamemode);
        //     setCurrentGameMode(gamemode);
        // });
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
                <span>Connected: {playerInWorld ? "yes" : "no"}</span>
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
                    disabled={!playerInWorld || currentGameMode === "survival"}
                    onClick={async () => {
                        postGameMode(playerName, "survival");
                    }}
                >
                    Survival
                </button>
                <button
                    className="gamemode"
                    disabled={!playerInWorld || currentGameMode === "creative"}
                    onClick={async () => {
                        postGameMode(playerName, "creative");
                    }}
                >
                    Creative
                </button>
                <h2>Current gamemode: {currentGameMode}</h2>
            </div>
            <div className="time">
                <h2>Current time: {time}</h2>
                <button
                    onClick={async () => {
                        getTime().then((currentTime) => {
                            console.log("Current time:", currentTime);
                            setTime(currentTime);
                        });
                    }}
                >
                    Get Current Time
                </button>
            </div>
            <div className="players">
                <h2>Current players:</h2>
                <ul>
                    {currentPlayers.map((player, index) => (
                        <li key={index}>
                            {player.name} - {player.gameMode}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default App;
