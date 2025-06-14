import express from "express";
import mealsRouter from "./routes/meals";
import authRouter from "./auth";

const app = express();

app.use(express.json());
app.use("/api/meals", mealsRouter);
app.use("/api/auth", authRouter);

console.log("Server is starting...");
app.listen(8000, () => {
    console.log("Server running");
});
