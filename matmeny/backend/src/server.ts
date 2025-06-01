import express from "express";
import mealsRouter from "./routes/meals";
import usersRouter from "./routes/users";

const app = express();

// Middleware to handle CORS
// app
//     .use
// cors({
//     origin: "/", // Allow requests from this origin
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//     allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
// })
// ();
app.use(express.json());
app.use("/api/meals", mealsRouter);
app.use("/api/users", usersRouter);
console.log("Server is starting...");
app.listen(8000, () => {
    console.log("Server running");
});
