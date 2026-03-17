import React from 'react';
import { useForm } from 'react-hook-form';
import { addRoom } from '../services/roomService';
import { Property } from '../types';

interface RoomForm {
  title: string;
  price: string;
  location: string;
  description: string;
  phone: string;
  images: FileList;
}

const AddRoom: React.FC = () => {
  const { register, handleSubmit } = useForm<RoomForm>();

  const onSubmit = (data: RoomForm) => {
    // simple conversion to property object
    const newProperty: Property = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      price: parseFloat(data.price),
      location: data.location,
      images: [],
      ownerId: 'owner1',
    };
    addRoom(newProperty).then((res) => {
      console.log('room added', res.data);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add a New Room</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register('title', { required: true })}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (TZS)</label>
          <input
            type="number"
            {...register('price', { required: true })}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            {...register('location', { required: true })}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register('description')}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Upload Images</label>
          <input
            type="file"
            multiple
            {...register('images')}
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contact Phone</label>
          <input
            {...register('phone', { required: true })}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
