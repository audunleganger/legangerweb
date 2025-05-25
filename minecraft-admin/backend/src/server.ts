import express from "express";
import http from "http";
import { Server } from "socket.io";
import { sendRconCommand } from "./rconClient";
import { send } from "process";
import commandsRouter from "./routes/commands";
import {
    parseDifficulty,
    parseTime,
    parsePlayers,
    buildPlayerObjects,
} from "./rconUtils";
import { parse } from "path";

const RCON_HOST = process.env.RCON_HOST || "minecraft";
const RCON_PORT = process.env.RCON_PORT
    ? parseInt(process.env.RCON_PORT)
    : 25575;
const RCON_PASSWORD = process.env.RCON_PASSWORD || "secretpassword";

type Player = {
    name: string;
    gameMode: string;
};

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
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", async (socket) => {
    console.log("A client connected:", socket.id);

    try {
        const difficultyResponse = await sendRconCommand("difficulty");
        gameState.currentDifficulty = parseDifficulty(difficultyResponse);
    } catch (error) {
        console.error("Error parsing game state:", error);
    }
    try {
        const timeResponse = await sendRconCommand("time query daytime");
        gameState.currentTime = parseTime(timeResponse);
    } catch (error) {
        console.error("Error parsing game state:", error);
    }
    try {
        const playersResponse = await sendRconCommand("list");
        const playersNames = parsePlayers(playersResponse);
        const playerObjects = await buildPlayerObjects(playersNames);
        gameState.currentPlayers = playerObjects;
    } catch (error) {
        console.error("Error parsing players:", error);
    }
    socket.emit("connection", gameState);

    socket.on("getDifficulty", async () => {
        console.log("Client requested difficulty");
        const response = await sendRconCommand("difficulty");
        const difficulty = parseDifficulty(response);
        console.log(`Current difficulty: ${difficulty}`);
        socket.emit("difficultyUpdate", difficulty);
    });

    socket.on("getTime", async () => {
        console.log("Client requested time");
        const response = await sendRconCommand("time query daytime");
        const time = parseTime(response);
        console.log(`Current time: ${time}`);
        socket.emit("time", time);
    });

    socket.on("getGamemode", async (playerName) => {
        const response = await sendRconCommand(
            `data get entity ${playerName} playerGameType`
        );
        console.log(`Rcon response: ${response}`);
    });

    socket.on("getPlayers", async () => {
        console.log("Client requested players");
        const response = await sendRconCommand("list");
        const playerNames = parsePlayers(response);
        const players = await buildPlayerObjects(playerNames);
        gameState.currentPlayers = players;
        socket.emit("playersUpdate", players);
    });

    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
    });
});

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

// TEMP END

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.use("/api", commandsRouter(io));

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
