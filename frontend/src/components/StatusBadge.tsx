import React from 'react';
import { Check, X, Clock, Plane } from 'lucide-react';

type StatusType =
  | 'check-in'
  | 'check-out'
  | 'present'
  | 'absent'
  | 'on-leave'
  | 'pending'
  | 'approved'
  | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; bgClass: string; textClass: string; icon?: React.ReactNode }> = {
  'check-in': {
    label: 'Check In',
    bgClass: 'bg-success',
    textClass: 'text-success-foreground',
    icon: <Check size={12} strokeWidth={2.5} />,
  },
  'check-out': {
    label: 'Check Out',
    bgClass: 'bg-warning',
    textClass: 'text-warning-foreground',
    icon: <X size={12} strokeWidth={2.5} />,
  },
  present: {
    label: 'Present',
    bgClass: 'bg-success',
    textClass: 'text-success-foreground',
    icon: <Check size={12} strokeWidth={2.5} />,
  },
  absent: {
    label: 'Absent',
    bgClass: 'bg-warning',
    textClass: 'text-warning-foreground',
    icon: <X size={12} strokeWidth={2.5} />,
  },
  'on-leave': {
    label: 'On Leave',
    bgClass: 'bg-info',
    textClass: 'text-info-foreground',
    icon: <Plane size={12} strokeWidth={2} />,
  },
  pending: {
    label: 'Pending',
    bgClass: 'bg-warning',
    textClass: 'text-warning-foreground',
    icon: <Clock size={12} strokeWidth={2} />,
  },
  approved: {
    label: 'Approved',
    bgClass: 'bg-success',
    textClass: 'text-success-foreground',
    icon: <Check size={12} strokeWidth={2.5} />,
  },
  rejected: {
    label: 'Rejected',
    bgClass: 'bg-error',
    textClass: 'text-error-foreground',
    icon: <X size={12} strokeWidth={2.5} />,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  showIcon = true,
  className = '' 
}) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass} ${className}`}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
