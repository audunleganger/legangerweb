import { Router, Request, Response } from "express";
import pool from "../db";

const mealsRouter = Router();

mealsRouter.get("/", async (req: Request, res: Response) => {
    const { from, to } = req.query;
    try {
        const query = `
        SELECT * FROM meals
        WHERE date >= $1 AND date <= $2
        ORDER BY date ASC
        `;
        const result = await pool.query(query, [from, to]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching meals:", error);
        res.status(500).json({ error: "Failed to fetch meals" });
    }
});

export default mealsRouter;
