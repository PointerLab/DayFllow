import React from 'react';
import { Crown, Headphones } from 'lucide-react';

interface RoleBadgeProps {
  role: 'admin' | 'employee';
  size?: number;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ 
  role, 
  size = 14,
  className = '' 
}) => {
  return (
    <div className={`absolute -bottom-0.5 -right-0.5 bg-card rounded-full p-0.5 shadow-sm ${className}`}>
      {role === 'admin' ? (
        <Crown 
          size={size} 
          className="text-amber-500" 
          fill="currentColor"
          strokeWidth={1.5}
        />
      ) : (
        <Headphones 
          size={size} 
          className="text-primary" 
          strokeWidth={2}
        />
      )}
    </div>
  );
};

export default RoleBadge;
