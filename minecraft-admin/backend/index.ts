import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { sendRconCommand } from "./rconClient";
import { send } from "process";

const app = express();
app.use(cors());
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

app.get("/", (req, res) => {
    res.send("Backend is running");
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
