import { rooms } from '../data/rooms';
import { Property } from '../types';

export const getRooms = () =>
  new Promise<{ data: Property[] }>((resolve) => {
    resolve({ data: rooms });
  });

export const getRoomById = (id: string) =>
  new Promise<{ data: Property | undefined }>((resolve) => {
    const room = rooms.find((r) => r.id === id);
    resolve({ data: room });
  });

export const addRoom = (data: Property) =>
  new Promise<{ data: Property }>((resolve) => {
    rooms.push(data);
    resolve({ data });
  });

export const updateRoom = (id: string, data: Partial<Property>) =>
  new Promise<{ data: Property | undefined }>((resolve) => {
    const idx = rooms.findIndex((r) => r.id === id);
    if (idx !== -1) {
      rooms[idx] = { ...rooms[idx], ...data } as Property;
      resolve({ data: rooms[idx] });
    } else {
      resolve({ data: undefined });
    }
  });

export const deleteRoom = (id: string) =>
  new Promise<void>((resolve) => {
    const idx = rooms.findIndex((r) => r.id === id);
    if (idx !== -1) rooms.splice(idx, 1);
    resolve();
  });
