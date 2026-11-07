import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'verified' | 'pending' | 'danger-alert';

export interface StatusBadgeProps {
  status?: string;
  variant?: BadgeVariant;
  label?: string;
  icon?: string;
  className?: string;
}

const statusVariantMap: Record<string, { variant: BadgeVariant; label: string; icon?: string }> = {
  ACTIVE: { variant: 'verified', label: 'Active', icon: 'fas fa-check-circle' },
  BLOCKED: { variant: 'danger-alert', label: 'Suspended', icon: 'fas fa-ban' },
  SUSPENDED: { variant: 'danger-alert', label: 'Suspended', icon: 'fas fa-ban' },
  PENDING: { variant: 'pending', label: 'Pending', icon: 'fas fa-clock' },
  APPROVED: { variant: 'verified', label: 'Approved', icon: 'fas fa-check-circle' },
  REJECTED: { variant: 'danger-alert', label: 'Rejected', icon: 'fas fa-times-circle' },
  VERIFIED: { variant: 'verified', label: 'Verified', icon: 'fas fa-check-circle' },
  IN_REVIEW: { variant: 'pending', label: 'In Review', icon: 'fas fa-clock' },
  NOT_SUBMITTED: { variant: 'secondary', label: 'Not Submitted', icon: 'fas fa-circle' },
  COMPLETED: { variant: 'success', label: 'Completed', icon: 'fas fa-check' },
  CANCELLED: { variant: 'danger', label: 'Cancelled', icon: 'fas fa-times' },
  OPEN: { variant: 'info', label: 'Open', icon: 'fas fa-folder-open' },
  ASSIGNED: { variant: 'info', label: 'Assigned', icon: 'fas fa-user-check' },
  IN_PROGRESS: { variant: 'warning', label: 'In Progress', icon: 'fas fa-spinner' }
};

const variantClassMap: Record<BadgeVariant, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  secondary: 'badge-secondary',
  verified: 'badge-verified',
  pending: 'badge-pending',
  'danger-alert': 'badge-danger-alert'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  label,
  icon,
  className = ''
}) => {
  const normalizedStatus = status ? status.toUpperCase().trim() : '';
  const defaultConfig = normalizedStatus ? statusVariantMap[normalizedStatus] : undefined;

  const resolvedVariant = variant || defaultConfig?.variant || 'secondary';
  const resolvedLabel = label || defaultConfig?.label || status || '';
  const resolvedIcon = icon !== undefined ? icon : defaultConfig?.icon;
  const badgeClass = variantClassMap[resolvedVariant] || `badge-${resolvedVariant}`;

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {resolvedIcon && <i className={`${resolvedIcon} mr-1`}></i>}
      {resolvedLabel}
    </span>
  );
};

