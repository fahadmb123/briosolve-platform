import { memo, useMemo, useCallback } from 'react';
import type { VerificationDocument, VerificationDocumentType } from '../types/kyc.types';

interface KycDetailsModalProps {
  document: VerificationDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestNew: (type: VerificationDocumentType) => void;
  onPreviewImage: (url: string, title?: string) => void;
  onEdit?: (document: VerificationDocument) => void;
}

export const KycDetailsModal = memo(({
  document,
  isOpen,
  onClose,
  onRequestNew,
  onPreviewImage,
  onEdit,
}: KycDetailsModalProps) => {
  const isRejected = document?.status === 'REJECTED';
  const isPending = document?.status === 'PENDING';
  const isApproved = document?.status === 'APPROVED';

  const handleResubmit = useCallback(() => {
    if (document) {
      onClose();
      if (onEdit) {
        onEdit(document);
      } else {
        onRequestNew(document.document_type);
      }
    }
  }, [document, onClose, onEdit, onRequestNew]);

  const handleEditClick = useCallback(() => {
    if (document && onEdit) {
      onClose();
      onEdit(document);
    }
  }, [document, onClose, onEdit]);

  const statusBadge = useMemo(() => {
    if (isApproved) {
      return (
        <span className="kyc-status-pill approved">
          <i className="fas fa-check-circle"></i> Approved &amp; Verified
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="kyc-status-pill pending">
          <i className="fas fa-clock"></i> Verification Pending
        </span>
      );
    }
    if (isRejected) {
      return (
        <span className="kyc-status-pill rejected">
          <i className="fas fa-times-circle"></i> Rejected
        </span>
      );
    }
    return (
      <span className="kyc-status-pill not_submitted">
        <i className="fas fa-circle-notch"></i> Not Submitted
      </span>
    );
  }, [isApproved, isPending, isRejected]);

  const formattedCreatedAt = useMemo(() => {
    if (!document?.created_at) return 'N/A';
    try {
      return new Date(document.created_at).toLocaleString();
    } catch {
      return String(document.created_at);
    }
  }, [document?.created_at]);

  const formattedUpdatedAt = useMemo(() => {
    if (!document?.updated_at) return 'N/A';
    try {
      return new Date(document.updated_at).toLocaleString();
    } catch {
      return String(document.updated_at);
    }
  }, [document?.updated_at]);

  if (!isOpen || !document) return null;

  const files = document.files || [];

  return (
    <div className="kyc-modal-overlay" onClick={onClose}>
      <div className="kyc-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="kyc-modal-header">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="kyc-modal-header-title">
                {document.document_type === 'IDENTITY' ? 'Identity Verification Request' : 'Additional Certificate Request'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {statusBadge}
            </div>
          </div>
          <button className="kyc-modal-close-btn" onClick={onClose} aria-label="Close details modal">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="kyc-modal-body">
          {isRejected && (
            <div className="kyc-rejection-callout">
              <div className="kyc-rejection-callout-header">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Rejection Reason:</span>
              </div>
              <p className="kyc-rejection-callout-body">
                {document.rejection_reason || 'Document does not meet verification guidelines. Please upload a clear and valid copy.'}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-red-200">
                <span className="kyc-rejection-callout-tip">
                  <i className="fas fa-info-circle"></i> Ensure all 4 corners and text are clearly visible.
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger py-1 px-3 rounded-lg text-xs font-semibold"
                  onClick={handleResubmit}
                >
                  <i className="fas fa-redo-alt mr-1"></i> Re-submit Document
                </button>
              </div>
            </div>
          )}

          <div className="kyc-meta-box">
            <div className="kyc-meta-row">
              <span className="kyc-meta-label">Document Name:</span>
              <span className="kyc-meta-value">{document.document_name}</span>
            </div>
            <div className="kyc-meta-row">
              <span className="kyc-meta-label">Verification Category:</span>
              <span className="kyc-meta-value">
                {document.document_type === 'IDENTITY' ? 'Identity Verification' : 'Additional Certificate'}
              </span>
            </div>
            <div className="kyc-meta-row">
              <span className="kyc-meta-label">Submitted On:</span>
              <span className="kyc-meta-value">{formattedCreatedAt}</span>
            </div>
            <div className="kyc-meta-row">
              <span className="kyc-meta-label">Last Status Update:</span>
              <span className="kyc-meta-value">{formattedUpdatedAt}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-text uppercase tracking-wide">
                Uploaded Images &amp; Files ({files.length})
              </h4>
              <span className="text-xs text-secondary">Click image to enlarge</span>
            </div>

            {files.length === 0 ? (
              <p className="text-sm text-secondary">No files uploaded yet.</p>
            ) : (
              <div className="kyc-images-grid">
                {files.map((file, idx) => {
                  const fileName = file.file_name || file.file_url.split('/').pop()?.split('?')[0] || `Document ${idx + 1}`;
                  const isPdf = fileName.toLowerCase().endsWith('.pdf') || file.file_url.toLowerCase().endsWith('.pdf');
                  return (
                    <div
                      key={file.id || idx}
                      className="kyc-image-card"
                      onClick={() => {
                        if (!isPdf) {
                          onPreviewImage(file.file_url, fileName);
                        } else {
                          window.open(file.file_url, '_blank');
                        }
                      }}
                      title={isPdf ? 'Click to open PDF' : 'Click to preview full size'}
                    >
                      {isPdf ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center" style={{ background: 'var(--surface-hover)' }}>
                          <i className="fas fa-file-pdf text-red-500 text-3xl mb-1"></i>
                          <span className="text-xs text-text font-medium truncate w-full">{fileName}</span>
                        </div>
                      ) : (
                        <>
                          <img src={file.file_url} alt={fileName} />
                          <div className="kyc-image-overlay">
                            <i className="fas fa-search-plus"></i>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="kyc-modal-footer flex items-center justify-between">
          <button
            type="button"
            className="btn btn-secondary py-2 px-4 rounded-lg text-sm"
            onClick={onClose}
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              className="btn btn-primary py-2 px-4 rounded-lg text-sm flex items-center gap-1.5"
              onClick={handleEditClick}
            >
              <i className="fas fa-edit"></i> Edit Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

KycDetailsModal.displayName = 'KycDetailsModal';
