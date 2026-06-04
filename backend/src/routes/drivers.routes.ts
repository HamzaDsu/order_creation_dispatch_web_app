import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", async (_req, res) => {
  await db.read();

  const drivers = db.data?.drivers || [];

  res.json(drivers);
});

export default router;