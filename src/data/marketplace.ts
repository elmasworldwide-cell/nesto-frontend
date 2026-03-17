export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Wooden Bed Frame',
    price: 200000,
    imageUrl: 'https://source.unsplash.com/random/400x300?bed',
  },
  {
    id: '2',
    title: 'Dining Table Set',
    price: 350000,
    imageUrl: 'https://source.unsplash.com/random/400x300?table',
  },
  {
    id: '3',
    title: 'Sofa',
    price: 150000,
    imageUrl: 'https://source.unsplash.com/random/400x300?sofa',
  },
];
