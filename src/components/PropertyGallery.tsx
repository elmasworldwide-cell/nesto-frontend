import React from 'react';

interface PropertyGalleryProps {
  images: string[];
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {images.map((src, idx) => (
        <img key={idx} src={src} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded" />
      ))}
    </div>
  );
};

export default PropertyGallery;