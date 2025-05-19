import { Rcon } from "rcon-client";

export async function sendRconCommand(command: string): Promise<string> {
    try {
        const rcon = await Rcon.connect({
            host: process.env.RCON_HOST || "minecraft",
            port: process.env.RCON_PORT
                ? parseInt(process.env.RCON_PORT)
                : 25575,
            password: process.env.RCON_PASSWORD || "secretpassword",
        });

        const response = await rcon.send(command);

        if (response.slice(0, 7) === "Unknown") {
            throw new Error("Unknown command");
        }
        await rcon.end();
        return response;
    } catch (error) {
        console.error("Rcon error:", error);
        return "Failed to send command";
    }
}
