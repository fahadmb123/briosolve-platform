import React, { useEffect } from 'react';
import './ConfirmModal.css';

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModalComponent: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = false,
    isLoading = false,
    onConfirm,
    onCancel,
}) => {
    
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="h5 mb-2" style={{ fontWeight: 600 }}>{title}</h3>
                <p className="text-secondary text-sm mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button 
                        type="button" 
                        className="btn btn-sm" 
                        style={{ border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)' }}
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button 
                        type="button" 
                        className={`btn btn-sm ${isDanger ? 'border border-red-500 bg-red-500 text-white hover:bg-red-600' : 'btn-primary'}`} 
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-1.5">
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Processing...</span>
                            </span>
                        ) : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ConfirmModal = React.memo(ConfirmModalComponent);
