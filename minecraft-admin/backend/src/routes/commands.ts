import { Router } from "express";
import { sendRconCommand } from "../rconClient";
import {
    parseDifficulty,
    parseGameMode,
    parseTime,
    parsePlayers,
    buildPlayerObjects,
} from "../rconUtils";

export default function commandsRouter(io: any): Router {
    const commandsRouter = Router();

    commandsRouter.get("/difficulty", async (_, res) => {
        try {
            const response = await sendRconCommand("difficulty");
            const difficulty = parseDifficulty(response);
            res.json({ difficulty });
        } catch (error) {
            console.error("Error getting difficulty:", error);
            res.status(500).json({ error: "Failed to get difficulty" });
        }
    });

    commandsRouter.post("/difficulty", async (req, res) => {
        const difficulty = req.body.difficulty;
        if (!difficulty) {
            return res.status(400).json({ error: "Difficulty is required" });
        }
        try {
            await sendRconCommand(`difficulty ${difficulty}`);
            io.emit("difficultyUpdate", difficulty);
            res.status(200).json({
                message: `Difficulty set to ${difficulty}`,
            });
        } catch (error) {
            console.error("Error setting difficulty:", error);
            res.status(500).json({ error: "Failed to set difficulty" });
        }
    });

    commandsRouter.get("/time", async (req, res) => {
        try {
            const rconResponse = await sendRconCommand("time query daytime");
            const time = parseTime(rconResponse);
            res.json({ time });
        } catch (error) {
            console.error("Error getting time:", error);
            return res.status(500).json({ error: `${error}` });
        }
    });

    commandsRouter.post("/time", async (req, res) => {
        const { time } = req.body.time;
        console.log(`Received time: ${time}`);
        if (!time) {
            return res.status(400).json({ error: "Time is required" });
        }
        try {
            const rconResponse = await sendRconCommand(`time set ${time}`);
            console.log(`Rcon response: ${rconResponse}`);
            res.json({ time });
        } catch (error) {
            return res.status(500).json({ error: `${error}` });
        }
    });

    commandsRouter.get("/gamemode", async (req, res) => {
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
            const currentGameMode = parseGameMode(rconResponse);
            res.json({ gamemode: currentGameMode });
        } catch (error) {
            console.error("Error getting gamemode:", error);
            return res.status(500).json({ error: `${error}` });
        }
    });

    commandsRouter.post("/gamemode", async (req, res) => {
        const playerName = req.body.playerName as string;
        const gamemode = req.body.gamemode as string;
        console.log(
            `Received playerName: ${playerName}, gamemode: ${gamemode}`
        );
        if (!playerName || !gamemode) {
            return res
                .status(400)
                .json({ error: "Player name and gamemode are required" });
        }
        try {
            const response = await sendRconCommand(
                `gamemode ${gamemode} ${playerName}`
            );
            console.log(`Rcon response: ${response}`);
            const currentPlayers = await sendRconCommand("list");
            const players = parsePlayers(currentPlayers);
            const playerObjects = await buildPlayerObjects(players);
            io.emit("playersUpdate", playerObjects);
            res.status(200).json({ message: response });
        } catch (error) {
            console.error("Error sending command:", error);
            return res.status(500).json({ error: `${error}` });
        }
    });

    return commandsRouter;
}
