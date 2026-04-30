import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/protect";
import { isAdmin } from "../middleware/isAdmin";

const prisma = new PrismaClient();
const router = Router();

// GET users
router.get("/users", protect, isAdmin, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// DELETE user
router.delete("/users/:id", protect, isAdmin, async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) },
  });
  res.json({ message: "User deleted" });
});

export default router;