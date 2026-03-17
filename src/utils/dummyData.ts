// File: src/utils/dummyData.ts
export interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  lat: number;
  lng: number;
  type: string;
  description: string;
  owner: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export const dummyRooms: Room[] = [
  {
    id: '1',
    title: 'Cozy Room in Dar es Salaam',
    price: 50000,
    location: 'Dar es Salaam',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    lat: -6.7924,
    lng: 39.2083,
    type: 'Room',
    description: 'A comfortable room in the city center.',
    owner: 'John Doe',
    phone: '+255 712 345 678',
  },
  {
    id: '2',
    title: 'Modern Apartment in Arusha',
    price: 120000,
    location: 'Arusha',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
    lat: -3.3869,
    lng: 36.6828,
    type: 'Apartment',
    description: 'Spacious apartment with modern amenities.',
    owner: 'Jane Smith',
    phone: '+255 713 456 789',
  },
  {
    id: '3',
    title: 'House in Mwanza',
    price: 80000,
    location: 'Mwanza',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'],
    lat: -2.5164,
    lng: 32.9083,
    type: 'House',
    description: 'Beautiful house near the lake.',
    owner: 'Alice Johnson',
    phone: '+255 714 567 890',
  },
];

export const dummyUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+255 712 345 678' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+255 713 456 789' },
];

export const dummyMarketplace: MarketplaceItem[] = [
  { id: '1', title: 'Wooden Table', price: 50000, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', description: 'Sturdy wooden table.' },
  { id: '2', title: 'Chair Set', price: 30000, image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400', description: 'Comfortable chair set.' },
];

export const dummyVideos: Video[] = [
  { id: '1', title: 'Room Tour 1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400' },
  { id: '2', title: 'Apartment Walkthrough', url: 'https://www.w3schools.com/html/movie.mp4', thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' },
];