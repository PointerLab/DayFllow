import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const location = useLocation();

  // Combine auth user with location state for immediate feedback after signup
  const user = location.state || authUser;
  const joiningDate = user?.date_of_joining
    ? new Date(`${user.date_of_joining}T00:00:00`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    : '--';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.login_id}</p>
          <p><strong>Email:</strong> {user.email || '--'}</p>
          <p><strong>Company:</strong> {user.company_name || '--'}</p>
          <p><strong>Login ID:</strong> {user.login_id || '--'}</p>
          <p><strong>Role:</strong> {user.role || '--'}</p>
          <p><strong>Department:</strong> {user.department || '--'}</p>
          <p><strong>Employment Type:</strong> {user.employment_type || '--'}</p>
          <p><strong>Date of Joining:</strong> {joiningDate}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default AdminProfile;
