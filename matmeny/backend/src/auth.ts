import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "./db";
import type { Request, Response, NextFunction } from "express";

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || "dev_refresh_secret";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "90d";

// Middleware to protect routes
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        res.status(401).json({ error: "No authorization token provided" });
        return;
    }
    try {
        const payload = jwt.verify(auth.slice(7), JWT_SECRET);
        (req as any).user = payload;
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}

authRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password are required" });
    }
    const userResult = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    const userFromDb = userResult.rows[0];
    if (!userFromDb) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
    }
    const isPasswordValid = await bcrypt.compare(
        password,
        userFromDb.password_hash
    );
    if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
    }
    const accessToken = jwt.sign(
        { userId: userFromDb.id, username: userFromDb.username },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
        { userId: userFromDb.id, username: userFromDb.username },
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    res.json({
        accessToken,
        refreshToken,
    });
});

authRouter.post("/refresh", (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ error: "No refresh token provided" });
        return;
    }
    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
        const newAccessToken = jwt.sign(
            { userId: payload.userId, username: payload.username },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );
        res.json({ accessToken: newAccessToken });
    } catch {
        res.status(401).json({ error: "Invalid or expired refresh token" });
    }
});

export default authRouter;
