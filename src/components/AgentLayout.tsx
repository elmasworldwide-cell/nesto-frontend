import React from 'react';
import { Link } from 'react-router-dom';

interface AgentLayoutProps {
  children: React.ReactNode;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="space-y-2">
          <Link to="/agent/verify" className="block p-2 hover:bg-gray-200 rounded">
            Verify Properties
          </Link>
          <Link to="/agent/register" className="block p-2 hover:bg-gray-200 rounded">
            Register Rooms
          </Link>
          <Link to="/agent/landlords" className="block p-2 hover:bg-gray-200 rounded">
            Manage Landlords
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default AgentLayout;