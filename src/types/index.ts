export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'owner' | 'agent' | 'admin';
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  ownerId: string;
  lat?: number;
  lng?: number;
}

// Add more types for messages, bookings, etc.
