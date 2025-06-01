import { Router, Request, Response } from "express";

const usersRouter = Router();
usersRouter.get("/", (req: Request, res: Response) => {
    const { from, to } = req.query;
    // Simulate fetching users from a database
    const users = [{ id: 1, name: "Alice" }];

    res.json(users);
});

export default usersRouter;
