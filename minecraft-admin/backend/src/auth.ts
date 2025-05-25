import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: any;
    }
}

const USERS: Record<string, string> = {
    "1234": "admin",
    "5678": "user",
};
const JWT_SECRET = process.env.JWT_SECRET || "secret_jwt_key";

export function login(req: Request, res: Response) {
    const { pin } = req.body as { pin?: string };
    const username = pin ? USERS[pin] : undefined;

    if (!pin || !USERS[pin]) {
        return res.status(401).json({ error: "Invalid PIN" });
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "4h" });
    return res.json({ token });
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });
    const token = authHeader.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
