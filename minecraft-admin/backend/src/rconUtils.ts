import { sendRconCommand } from "./rconClient";

export function parseDifficulty(response: string): string {
    const parts = response.split(" ");
    if (
        parts.length < 4 ||
        parts.length > 5 ||
        !response.startsWith("The difficulty is ")
    ) {
        throw new Error("Invalid response format: " + response);
    }
    return parts[3].toLowerCase();
}

export function parseTime(response: string): string {
    const parts = response.split(" ");
    if (parts.length < 4 || !response.startsWith("The time is ")) {
        throw new Error("Invalid response format: " + response);
    }
    return parts[3].toLowerCase();
}

export function parseGameMode(response: string): string {
    const gameTypeIndex = parseInt(response.slice(-1));
    switch (gameTypeIndex) {
        case 0:
            return "survival";
        case 1:
            return "creative";
        case 2:
            return "adventure";
        case 3:
            return "spectator";
        default:
            throw new Error("Unknown game mode index: " + gameTypeIndex);
    }
}

export function parsePlayers(response: string): string[] {
    const namesString = response.split(":")[1];
    const names = namesString.split(",").map((name) => name.trim());
    return names.filter((name) => name !== ""); // Filter out empty names
}

export async function buildPlayerObjects(
    playerNames: string[]
): Promise<{ name: string; gameMode: string }[]> {
    return Promise.all(
        playerNames.map(async (name) => {
            const playerGameModeResponse = await sendRconCommand(
                `data get entity ${name} playerGameType`
            );
            return {
                name: name,
                gameMode: parseGameMode(playerGameModeResponse),
            };
        })
    );
}
