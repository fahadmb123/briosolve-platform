import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  maxWidth = 'max-w-lg',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="admin-modal-overlay active"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={`admin-modal ${maxWidth} w-full max-h-[90vh] flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="admin-modal-header shrink-0">
            <div className="flex items-center gap-2">
              {icon && <i className={`${icon} text-primary`}></i>}
              <h3 className="h6 mb-0">{title}</h3>
            </div>
            <button className="btn-icon" onClick={onClose} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
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

