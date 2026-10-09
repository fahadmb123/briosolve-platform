import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    label: string;
    icon?: string;
    onClick: () => void;
  };
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, description, actionButton }) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
      <div>
        <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>
          {title}
        </h1>
        <p className="text-secondary text-sm mb-0">{description}</p>
      </div>
      {actionButton && (
        <button className="btn btn-primary" onClick={actionButton.onClick}>
          {actionButton.icon && <i className={`${actionButton.icon} mr-2`}></i>}
          {actionButton.label}
        </button>
      )}
    </div>
  );
};
