import { Property } from '../types';

export const rooms: Property[] = [
  {
    id: '1',
    title: 'Cozy room in Dar es Salaam',
    description: 'Comfortable room near the beach',
    price: 50000,
    location: 'Dar es Salaam',
    images: ['https://source.unsplash.com/random/800x600?room'],
    ownerId: 'owner1',
    lat: -6.7924,
    lng: 39.2083,
  },
  {
    id: '2',
    title: 'Spacious apartment in Arusha',
    description: 'Great view of Kilimanjaro',
    price: 120000,
    location: 'Arusha',
    images: ['https://source.unsplash.com/random/800x600?apartment'],
    ownerId: 'owner2',
    lat: -3.3869,
    lng: 36.6829,
  },
  {
    id: '3',
    title: 'Modern studio in Mwanza',
    description: 'Close to the lake',
    price: 80000,
    location: 'Mwanza',
    images: ['https://source.unsplash.com/random/800x600?studio'],
    ownerId: 'owner3',
    lat: -2.5164,
    lng: 32.9083,
  },
];
