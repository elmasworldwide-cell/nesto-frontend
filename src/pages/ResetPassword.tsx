import React from 'react';

const ResetPassword: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-center text-2xl font-bold">Reset your password</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input type="email" required className="mt-1 w-full px-3 py-2 border rounded" />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-primary/90">
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
