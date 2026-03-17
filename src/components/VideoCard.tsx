import React from 'react';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  onClick?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ thumbnail, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer"
    >
      <img src={thumbnail} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
    </div>
  );
};

export default VideoCard;
