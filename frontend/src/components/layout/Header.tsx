import React, { useState } from 'react';
import { AvatarWithBadge } from '../Avatar';
import { StatusBadge } from '../StatusBadge';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  breadcrumb: string;
  subtitle?: string;
}

type AttendanceState = 'check-in' | 'check-out';

export const Header: React.FC<HeaderProps> = ({ breadcrumb, subtitle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attendanceState, setAttendanceState] = useState<AttendanceState>('check-in');
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.login_id ||
    'User';

  const handleToggleAttendance = () => {
    setAttendanceState((prev) => (prev === 'check-in' ? 'check-out' : 'check-in'));
  };

  const getProfileLink = () => {
    return isAdmin ? '/profile/admin' : '/profile/employee';
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-soft">
      {/* Breadcrumb */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">{breadcrumb}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Attendance Status Toggle */}
        <button 
          onClick={handleToggleAttendance}
          className="transition-transform hover:scale-105"
        >
          <StatusBadge status={attendanceState} />
        </button>

        <NotificationBell />

        {/* User Avatar */}
        <button 
          onClick={() => navigate(getProfileLink())}
          className="transition-transform hover:scale-105"
        >
          <AvatarWithBadge
            name={displayName}
            role={isAdmin ? 'admin' : 'employee'}
            size="md"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
