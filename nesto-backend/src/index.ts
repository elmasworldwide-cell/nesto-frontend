import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/rooms";

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "NESTO API inafanya kazi! 🏠" });
});

app.listen(PORT, () => {
  console.log(`✅ Server inaendesha kwenye port ${PORT}`);
});
