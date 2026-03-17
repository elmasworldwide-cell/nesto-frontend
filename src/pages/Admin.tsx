import React from 'react';
import AdminLayout from '../components/AdminLayout';

const Admin: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p>Manage users, properties and view analytics.</p>
      </div>
    </AdminLayout>
  );
};

export default Admin;