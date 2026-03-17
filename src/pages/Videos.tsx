import React from 'react';
import VideoCard from '../components/VideoCard';

const sampleVideos = [
  { id: '1', thumbnail: 'https://source.unsplash.com/random/400x300?house', title: 'Spacious house tour' },
  { id: '2', thumbnail: 'https://source.unsplash.com/random/400x300?apartment', title: 'Modern apartment walkthrough' },
  { id: '3', thumbnail: 'https://source.unsplash.com/random/400x300?beach', title: 'Beachfront studio' },
];

const Videos: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Video Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleVideos.map((v) => (
          <VideoCard key={v.id} thumbnail={v.thumbnail} title={v.title} />
        ))}
      </div>
    </div>
  );
};

export default Videos;
