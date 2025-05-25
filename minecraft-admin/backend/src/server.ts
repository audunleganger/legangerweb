import express from "express";
import http from "http";
import { Server } from "socket.io";
import { login, authMiddleware } from "./auth";
import { sendRconCommand } from "./rconClient";
import commandsRouter from "./routes/commands";
import {
    parseDifficulty,
    parseTime,
    parsePlayers,
    buildPlayerObjects,
} from "./rconUtils";
import { Player } from "./types/player";
import { setupSocket } from "./socket";

const RCON_HOST = process.env.RCON_HOST || "minecraft";
const RCON_PORT = process.env.RCON_PORT
    ? parseInt(process.env.RCON_PORT)
    : 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD || "secretpassword";

const app = express();
app.use(express.json());
const PORT = 8000;

// Game status variables
const gameState: {
    currentPlayers: Player[];
    worldName: string;
    currentDifficulty: string;
    currentTime: string;
} = {
    currentPlayers: [],
    worldName: "unknown",
    currentDifficulty: "unknown",
    currentTime: "unknown",
};

// HTTP server and socket.io server
const server = http.createServer(app);
const io = new Server(server, {
    // cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"],
    // },
});

setupSocket(io, gameState);

// TEMP
let lastPlayers: Player[] = [];
setInterval(async () => {
    try {
        const response = await sendRconCommand("list");
        const playerNames = parsePlayers(response);
        const players = await buildPlayerObjects(playerNames);
        if (JSON.stringify(players) !== JSON.stringify(lastPlayers)) {
            lastPlayers = players;
            gameState.currentPlayers = players;
            io.emit("playersUpdate", players);
            console.log(`Updated players: ${players}`);
        }
    } catch (error) {
        console.error("Error updating players:", error);
    }
}, 2500);

console.log("hello world");

// TEMP END
app.get("/", (req, res) => {
    res.send("Backend is running");
});
app.post("/api/login", login);
app.use("/api", authMiddleware, commandsRouter(io));

app.post("/api", async (req, res) => {
    const { command } = req.body;
    console.log(`Received command: ${command}`);
    if (!command) {
        return res.status(400).json({ error: "Command is required" });
    }
    sendRconCommand(command)
        .then((response) => {
            console.log(`Rcon response: ${response}`);
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
