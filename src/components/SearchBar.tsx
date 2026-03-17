import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (location: string, price: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(location, price);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col md:flex-row gap-2">
      <input
        className="flex-grow px-4 py-2 border rounded focus:outline-none"
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        className="flex-grow px-4 py-2 border rounded focus:outline-none"
        type="text"
        placeholder="Max price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        type="submit"
        className="bg-accent text-white px-6 py-2 rounded hover:bg-accent/90 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
