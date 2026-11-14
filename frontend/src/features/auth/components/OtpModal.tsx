import OtpVerification from '../pages/OtpVerification/OtpVerification';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    email?: string;
}

export function OtpModal({ isOpen, onClose, onSuccess }: OtpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="pro-otp-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="pro-otp-modal-card">
                <button
                    type="button"
                    className="pro-otp-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <i className="fas fa-times"></i>
                </button>
                <OtpVerification isInline={true} onInlineSuccess={onSuccess} />
            </div>
        </div>
    );
}
