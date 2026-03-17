import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GoogleMap from '../components/GoogleMap';
import PropertyGallery from '../components/PropertyGallery';
import { getRoomById } from '../services/roomService';
import { Property } from '../types';

const RoomDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (id) {
      getRoomById(id).then((res) => {
        if (res.data) setProperty(res.data as Property);
      });
    }
  }, [id]);

  if (!property) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
      <PropertyGallery images={property.images} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-lg">Location: {property.location}</p>
          <p className="mt-2">Description: This is a lovely room located in the heart of the city. Comfortable, clean, and close to amenities.</p>
          <p className="mt-2">Owner: +255 712 345 678</p>
          <p className="text-primary font-bold mt-2">TZS {property.price.toLocaleString()}</p>
          <button className="mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition">
            Book Now
          </button>
        </div>
        <div>
          <GoogleMap markers={[{ lat: property.lat, lng: property.lng }]} />
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
