import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Clock, Calendar, LogOut } from 'lucide-react';
import { AvatarWithBadge } from '../Avatar';
import { useAuth } from '@/contexts/AuthContext';
import dayflowLogo from '../../assets/dayflow-logo.png';

const navItems = [
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/attendance', icon: Clock, label: 'Attendance' },
  { to: '/leaves', icon: Calendar, label: 'Leaves' },
];

export const Sidebar: React.FC = () => {
  const { user, logout, companyLogo } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAttendanceLink = () => {
    return user?.role === 'admin' ? '/attendance/admin' : '/attendance/employee';
  };

  const getLeavesLink = () => {
    return user?.role === 'admin' ? '/leaves/admin' : '/leaves/employee';
  };

  const getProfileLink = () => {
    return user?.role === 'admin' ? '/profile/admin' : '/profile/employee';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        {companyLogo ? (
          <img 
            src={companyLogo} 
            alt="Company logo" 
            className="h-10 w-auto max-w-[160px] object-contain"
          />
        ) : (
          <img 
            src={dayflowLogo} 
            alt="Dayflow" 
            className="h-10 w-auto max-w-[160px] object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          let to = item.to;
          if (item.to === '/attendance') to = getAttendanceLink();
          if (item.to === '/leaves') to = getLeavesLink();

          return (
            <NavLink
              key={item.to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div 
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition-colors cursor-pointer"
          onClick={() => navigate(getProfileLink())}
        >
          <AvatarWithBadge
            name={user?.name || 'User'}
            role={user?.role || 'employee'}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">
              {user?.role || 'Employee'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
