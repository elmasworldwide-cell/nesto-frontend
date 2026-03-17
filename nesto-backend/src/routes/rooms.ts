import { Router, Response } from "express";
import { prisma } from "../index";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// GET all rooms
router.get("/", async (req, res: Response) => {
  try {
    const { search, city, minPrice, maxPrice } = req.query;

    const rooms = await prisma.room.findMany({
      where: {
        ...(city && { city: { contains: city as string, mode: "insensitive" } }),
        ...(search && {
          OR: [
            { title: { contains: search as string, mode: "insensitive" } },
            { location: { contains: search as string, mode: "insensitive" } },
            { city: { contains: search as string, mode: "insensitive" } },
          ],
        }),
        ...(minPrice && { price: { gte: Number(minPrice) } }),
        ...(maxPrice && { price: { lte: Number(maxPrice) } }),
      },
      include: {
        images: true,
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single room
router.get("/:id", async (req, res: Response) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        images: true,
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!room) return res.status(404).json({ error: "Chumba hakipatikani" });
    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE room (protected)
router.post("/", protect, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, location, city, latitude, longitude, images } = req.body;

    if (!title || !price || !location || !city) {
      return res.status(400).json({ error: "Jaza fields zote muhimu" });
    }

    const room = await prisma.room.create({
      data: {
        title,
        description,
        price: Number(price),
        location,
        city,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        ownerId: req.userId!,
        images: {
          create: images?.map((url: string) => ({ url })) ?? [],
        },
      },
      include: { images: true },
    });

    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE room (protected)
router.put("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const room = await prisma.room.findUnique({ where: { id: Number(req.params.id) } });
    if (!room) return res.status(404).json({ error: "Chumba hakipatikani" });
    if (room.ownerId !== req.userId) return res.status(403).json({ error: "Huna ruhusa" });

    const updated = await prisma.room.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: { images: true },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE room (protected)
router.delete("/:id", protect, async (req: AuthRequest, res: Response) => {
  try {
    const room = await prisma.room.findUnique({ where: { id: Number(req.params.id) } });
    if (!room) return res.status(404).json({ error: "Chumba hakipatikani" });
    if (room.ownerId !== req.userId) return res.status(403).json({ error: "Huna ruhusa" });

    await prisma.image.deleteMany({ where: { roomId: room.id } });
    await prisma.room.delete({ where: { id: Number(req.params.id) } });

    res.json({ message: "Chumba kimefutwa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
