// File: src/components/AdminPanel.tsx
import React from 'react';
import { dummyUsers, dummyRooms } from '../utils/dummyData';

const AdminPanel: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Users ({dummyUsers.length})</h2>
          <ul>
            {dummyUsers.map((user) => (
              <li key={user.id} className="mb-2">
                {user.name} - {user.email}
                <button className="ml-2 text-red-500">Block</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Rooms ({dummyRooms.length})</h2>
          <ul>
            {dummyRooms.map((room) => (
              <li key={room.id} className="mb-2">
                {room.title} - TZS {room.price.toLocaleString()}
                <button className="ml-2 text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <p>Total Rooms: {dummyRooms.length}</p>
        <p>Total Users: {dummyUsers.length}</p>
      </div>
    </div>
  );
};

export default AdminPanel;