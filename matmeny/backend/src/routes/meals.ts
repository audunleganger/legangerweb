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

mealsRouter.post("/", async (req: Request, res: Response) => {
    const { date, meal_name } = req.body;
    try {
        const query = `
            INSERT INTO meals (date, meal_name)
            VALUES ($1, $2)
            ON CONFLICT (date) DO UPDATE SET meal_name = EXCLUDED.meal_name
            RETURNING *;
        `;
        const result = await pool.query(query, [date, meal_name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating meal:", error);
        res.status(500).json({ error: "Failed to create meal" });
    }
});

mealsRouter.put("/:date", async (req: Request, res: Response): Promise<any> => {
    const { date } = req.params;
    const { meal_name } = req.body;
    try {
        const query = `
            UPDATE meals
            SET meal_name = $1
            WHERE date = $2
            RETURNING *;
        `;
        const result = await pool.query(query, [meal_name, date]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Meal not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error updating meal:", error);
        res.status(500).json({ error: "Failed to update meal" });
    }
});

export default mealsRouter;
