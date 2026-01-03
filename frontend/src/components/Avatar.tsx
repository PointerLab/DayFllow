import React from 'react';
import { RoleBadge } from './RoleBadge';

interface AvatarWithBadgeProps {
  src?: string;
  name: string;
  role: 'admin' | 'employee';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-28 h-28 text-2xl',
};

const badgeSizes = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
};

export const AvatarWithBadge: React.FC<AvatarWithBadgeProps> = ({
  src,
  name,
  role,
  size = 'md',
  showBadge = true,
  className = '',
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-deep-purple flex items-center justify-center text-primary-foreground font-semibold overflow-hidden`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showBadge && <RoleBadge role={role} size={badgeSizes[size]} />}
    </div>
  );
};

export default AvatarWithBadge;
