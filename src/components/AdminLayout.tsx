import React from 'react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="space-y-2">
          <Link to="/admin/users" className="block p-2 hover:bg-gray-200 rounded">
            Users
          </Link>
          <Link to="/admin/properties" className="block p-2 hover:bg-gray-200 rounded">
            Properties
          </Link>
          <Link to="/admin/agents" className="block p-2 hover:bg-gray-200 rounded">
            Agents
          </Link>
          <Link to="/admin/analytics" className="block p-2 hover:bg-gray-200 rounded">
            Analytics
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default AdminLayout;