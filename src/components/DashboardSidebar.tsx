import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardSidebarProps {
  children: React.ReactNode;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav className="space-y-2">
          <Link to="/dashboard/profile" className="block p-2 hover:bg-gray-200 rounded">
            Profile
          </Link>
          <Link to="/dashboard/bookings" className="block p-2 hover:bg-gray-200 rounded">
            My bookings
          </Link>
          <Link to="/dashboard/saved" className="block p-2 hover:bg-gray-200 rounded">
            Saved rooms
          </Link>
          <Link to="/dashboard/notifications" className="block p-2 hover:bg-gray-200 rounded">
            Notifications
          </Link>
          <Link to="/dashboard/messages" className="block p-2 hover:bg-gray-200 rounded">
            Messages
          </Link>
          <Link to="/dashboard/payments" className="block p-2 hover:bg-gray-200 rounded">
            Payments
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default DashboardSidebar;
