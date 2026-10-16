
import OtpVerification from '../../../auth/pages/OtpVerification/OtpVerification';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    email: string;
}

export function OtpModal({ isOpen, onClose, onSuccess }: OtpModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ maxWidth: '400px', width: '100%', position: 'relative' }}>
                <OtpVerification isInline={true} onInlineSuccess={onSuccess} />
                <div className="text-center bg-surface pb-5" style={{ borderRadius: '0 0 1rem 1rem', marginTop: '-1rem' }}>
                    <button onClick={onClose} className="btn btn-text text-secondary text-sm">Cancel</button>
                </div>
            </div>
        </div>
    );
}
