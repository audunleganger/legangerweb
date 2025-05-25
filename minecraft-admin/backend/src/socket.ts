import { Server } from "socket.io";
import { sendRconCommand } from "./rconClient";
import {
    parseDifficulty,
    parsePlayers,
    parseTime,
    buildPlayerObjects,
} from "./rconUtils";
import { Player } from "./types/player";

export function setupSocket(
    io: Server,
    gameState: {
        currentPlayers: Player[];
        worldName: string;
        currentDifficulty: string;
        currentTime: string;
    }
) {
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

        socket.on("disconnect", () => {
            console.log("A client disconnected:", socket.id);
        });
    });
}
