import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();

  // Combine auth user with location state for immediate feedback after signup
  const user = location.state || authUser;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.username && <p><strong>Username:</strong> {user.username}</p>}
          {user.role && <p><strong>Role:</strong> {user.role}</p>}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default AdminProfile;