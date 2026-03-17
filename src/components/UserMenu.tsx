import React from 'react';
import { Link } from 'react-router-dom';

const UserMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <span className="w-8 h-8 bg-gray-300 rounded-full" />
        <span className="hidden md:inline">Account</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg">
          <Link
            to="/dashboard/profile"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/dashboard/bookings"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Bookings
          </Link>
          <button
            onClick={() => {
              /* logout logic placeholder */
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;