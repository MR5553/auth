import "dotenv/config";
import { app } from "./app";
import { Request, Response } from "express";
import { db } from "./db/db.config";
db();

const { PORT } = process.env;

app.get("/", (_req: Request, res: Response) => {
    res.json({ success: true })
});

app.listen(PORT, () => {
    console.log(`server is runnig at http://localhost:${PORT}`);
});