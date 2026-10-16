import { memo } from 'react';

interface KycImageViewerModalProps {
  imageUrl: string;
  imageTitle?: string;
  onClose: () => void;
}

export const KycImageViewerModal = memo(({
  imageUrl,
  imageTitle,
  onClose,
}: KycImageViewerModalProps) => {
  return (
    <div className="kyc-lightbox-overlay" onClick={onClose}>
      <div className="kyc-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="kyc-lightbox-close"
          onClick={onClose}
          aria-label="Close image preview"
        >
          <i className="fas fa-times"></i>
        </button>
        <img src={imageUrl} alt={imageTitle || 'Document preview'} className="kyc-lightbox-img" />
        {imageTitle && <div className="kyc-lightbox-caption">{imageTitle}</div>}
      </div>
    </div>
  );
});

KycImageViewerModal.displayName = 'KycImageViewerModal';
