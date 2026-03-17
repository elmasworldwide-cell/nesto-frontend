import api from "./api";

export interface Room {
  id: number;
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  images: { id: number; url: string }[];
  owner: { id: number; name: string; email: string };
  ownerId: number;
  createdAt: string;
}

export interface CreateRoomData {
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}

// Get all rooms (with optional filters)
export const getRooms = async (params?: {
  search?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Room[]> => {
  const res = await api.get("/rooms", { params });
  return res.data;
};

// Get single room
export const getRoom = async (id: number): Promise<Room> => {
  const res = await api.get(`/rooms/${id}`);
  return res.data;
};

// Create room
export const createRoom = async (data: CreateRoomData): Promise<Room> => {
  const res = await api.post("/rooms", data);
  return res.data;
};

// Update room
export const updateRoom = async (id: number, data: Partial<CreateRoomData>): Promise<Room> => {
  const res = await api.put(`/rooms/${id}`, data);
  return res.data;
};

// Delete room
export const deleteRoom = async (id: number): Promise<void> => {
  await api.delete(`/rooms/${id}`);
};

// Format price from number to string
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} Tsh`;
};
