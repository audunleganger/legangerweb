import express from "express";
import http from "http";
import { Server } from "socket.io";
import { sendRconCommand } from "./rconClient";
import { send } from "process";

const app = express();
app.use(express.json());
const PORT = 8000;

// HTTP server and socket.io server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const RCON_HOST = process.env.RCON_HOST || "minecraft";
const RCON_PORT = process.env.RCON_PORT
    ? parseInt(process.env.RCON_PORT)
    : 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD || "secretpassword";

let currentDifficulty = "unkown";
sendRconCommand("difficulty").then((response) => {
    console.log(`Rcon response: ${response}`);
    currentDifficulty = response.split(" ")[3].toLowerCase();
    console.log("emitting difficulty");
    io.emit("difficulty", currentDifficulty);
});

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.get("/api/difficulty", (req, res) => {
    res.json({ difficulty: currentDifficulty });
});

app.post("/api/difficulty", async (req, res) => {
    const { difficulty } = req.body.difficulty;
    console.log(`Received difficulty: ${difficulty}`);
    if (!difficulty) {
        return res.status(400).json({ error: "Difficulty is required" });
    }
    sendRconCommand(`difficulty ${difficulty}`)
        .then((response) => {
            console.log(`Rcon response: ${response}`);
            currentDifficulty = response.split(" ")[6].toLowerCase();
            console.log("emitting difficulty change");
            io.emit("difficulty", currentDifficulty);
            return res.status(200).json({ message: response });
        })
        .catch((error) => {
            console.error("Error sending command:", error);
            return res.status(500).json({ error: `${error}` });
        });
});

app.post("/api/time", async (req, res) => {
    const { time } = req.body.time;
    console.log(`Received time: ${time}`);
    if (!time) {
        return res.status(400).json({ error: "Time is required" });
    }
    sendRconCommand(`time set ${time}`)
        .then((response) => {
            console.log(`Rcon response: ${response}`);
            return res.status(200).json({ message: response });
        })
        .catch((error) => {
            console.error("Error sending command:", error);
            return res.status(500).json({ error: `${error}` });
        });
});

app.get("/api/gamemode", async (req, res) => {
    const playerName = req.query.playerName as string;
    console.log(`Received playerName: ${playerName}`);
    if (!playerName) {
        return res.status(400).json({ error: "Player name is required" });
    }
    try {
        const rconResponse = await sendRconCommand(
            `data get entity ${playerName} playerGameType`
        );
        console.log(`Rcon response: ${rconResponse}`);
        const gameModeIndex = rconResponse.split(": ")[1];
        let currentGameMode = "";
        console.log(`Game mode index: ${gameModeIndex}`);
        switch (gameModeIndex) {
            case "0":
                currentGameMode = "survival";
                break;
            case "1":
                currentGameMode = "creative";
                break;
            case "2":
                currentGameMode = "adventure";
                break;
            case "3":
                currentGameMode = "spectator";
                break;
        }
        res.json({ gamemode: currentGameMode });
    } catch (error) {
        console.error("Error getting gamemode:", error);
        return res.status(500).json({ error: `${error}` });
    }
});

app.post("/api/gamemode", async (req, res) => {
    const playerName = req.body.playerName.playerName;
    const gamemode = req.body.gamemode.gamemode;
    console.log(`Received playerName: ${playerName}, gamemode: ${gamemode}`);
    if (!playerName || !gamemode) {
        return res
            .status(400)
            .json({ error: "Player name and gamemode are required" });
    }
    sendRconCommand(`gamemode ${gamemode} ${playerName}`)
        .then((response) => {
            console.log(`Rcon response: ${response}`);
            return res.status(200).json({ message: response });
        })
        .catch((error) => {
            console.error("Error sending command:", error);
            return res.status(500).json({ error: `${error}` });
        });
});

app.post("/api", async (req, res) => {
    const { command } = req.body;
    console.log(`Received command: ${command}`);
    if (!command) {
        return res.status(400).json({ error: "Command is required" });
    }
    sendRconCommand(command)
        .then((response) => {
            console.log(`Rcon response: ${response}`);
            if (response.startsWith("The difficulty has been set to")) {
                currentDifficulty = response.split(" ")[6].toLowerCase();
                console.log("emitting difficulty change");
                io.emit("difficulty", currentDifficulty);
            }
            return res.status(200).json({ response });
        })
        .catch((error) => {
            console.error("Error sending command:", error);
            return res.status(500).json({ error: `${error}` });
        });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
