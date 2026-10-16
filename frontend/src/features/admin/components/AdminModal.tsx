import React from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, icon, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay active">
      <div className="admin-modal max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="admin-modal-header shrink-0">
          <div className="flex items-center gap-2">
            {icon && <i className={`${icon} text-primary`}></i>}
            <h3 className="h6 mb-0">{title}</h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="admin-modal-body overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="admin-modal-footer shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
