import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8000;

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.post("/api", (req, res) => {
    const { command } = req.body;
    console.log(`Received command: ${command}`);
    // Here you would add the logic to send the command to the Minecraft server
    res.send({ status: "Command received" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
