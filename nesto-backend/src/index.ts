
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// 🔹 Routes
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/rooms";
import adminRoutes from "./routes/admin";

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes); // 🔥 HII NDIYO UMEONGEZA

// 🔹 Root
app.get("/", (_req, res) => {
  res.json({ message: "LOKESTA API inafanya kazi! 🚀" });
});

// 🔹 404 Handler (optional but good)
app.use((req, res) => {
  res.status(404).json({ message: "Route haipo" });
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`✅ Server inaendesha kwenye port ${PORT}`);
});