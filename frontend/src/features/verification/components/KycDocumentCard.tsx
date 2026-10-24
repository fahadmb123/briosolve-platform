import { memo, useMemo, useCallback } from 'react';
import type { VerificationDocument, VerificationDocumentType } from '../types/kyc.types';

interface KycDocumentCardProps {
  documentType: VerificationDocumentType;
  title: string;
  description: string;
  icon: string;
  document?: VerificationDocument;
  docAllPending?:boolean;
  onRequestVerification: (type: VerificationDocumentType) => void;
  onViewRequest: (document: VerificationDocument) => void;
  onEditVerification?: (document: VerificationDocument) => void;
  onDeleteVerification?: (document: VerificationDocument) => void;
}

export const KycDocumentCard = memo(({
  documentType,
  title,
  description,
  icon,
  document,
  onRequestVerification,
  onViewRequest,
  onEditVerification,
  onDeleteVerification,
}: KycDocumentCardProps) => {
  const status = document?.status || 'NOT_SUBMITTED';
  const isRejected = status === 'REJECTED';
  const isPending = status === 'PENDING';
  const isApproved = status === 'APPROVED';
  const isNotSubmitted = status === 'NOT_SUBMITTED';
  

  const handleRequestClick = useCallback(() => {
    onRequestVerification(documentType);
  }, [onRequestVerification, documentType]);

  const handleViewClick = useCallback(() => {
    if (document) {
      onViewRequest(document);
    }
  }, [onViewRequest, document]);

  const handleEditClick = useCallback(() => {
    if (document && onEditVerification) {
      onEditVerification(document);
    } else {
      onRequestVerification(documentType);
    }
  }, [document, onEditVerification, onRequestVerification, documentType]);

  const handleDeleteClick = useCallback(() => {
    if (document && onDeleteVerification) {
      onDeleteVerification(document);
    }
  }, [document, onDeleteVerification]);

  const fileCount = useMemo(() => {
    return document?.files?.length || 0;
  }, [document?.files]);

  const statusPill = useMemo(() => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="kyc-status-pill approved">
            <i className="fas fa-check-circle"></i> Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="kyc-status-pill pending">
            <i className="fas fa-clock"></i> In Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="kyc-status-pill rejected">
            <i className="fas fa-times-circle"></i> Rejected
          </span>
        );
      default:
        return (
          <span className="kyc-status-pill not_submitted">
            <i className="fas fa-circle"></i> Not Submitted
          </span>
        );
    }
  }, [status]);

  return (
    <div className="kyc-card">
      <div>
        <div className="kyc-card-top">
          <div className="kyc-card-icon-wrapper">
            <i className={`fas ${icon}`}></i>
          </div>
          {statusPill}
        </div>

        <h3 className="kyc-card-title">{title}</h3>
        <p className="kyc-card-desc">{description}</p>

        {document && !isNotSubmitted && (
          <div className="kyc-meta-box">
            <div className="kyc-meta-row">
              <span className="kyc-meta-label">Document:</span>
              <span className="kyc-meta-value">{document.document_name}</span>
            </div>
            <div className="kyc-meta-row">
              <span className="kyc-meta-label">Files Attached:</span>
              <span className="kyc-meta-value">
                {fileCount} {fileCount === 1 ? 'file' : 'files'}
              </span>
            </div>
          </div>
        )}

        {isRejected && document?.rejection_reason && (
          <div className="kyc-rejection-preview-box">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <p className="kyc-rejection-preview-text font-semibold">Rejected:</p>
              <p className="kyc-rejection-preview-text line-clamp-2">
                {document.rejection_reason}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="kyc-card-actions">
        {isNotSubmitted && (
          <button
            type="button"
            className="btn btn-primary w-full py-2.5 text-sm rounded-lg flex items-center justify-center gap-2"
            onClick={handleRequestClick}
          >
            <i className="fas fa-file-upload"></i> Request Verification
          </button>
        )}

        {isPending && document && (
          <div className="flex gap-2 w-full">
            <button
              type="button"
              className="btn btn-secondary flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-1.5"
              onClick={handleViewClick}
            >
              <i className="fas fa-eye"></i> Details
            </button>
            {onEditVerification && (
              <button
                type="button"
                className="btn btn-outline flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-1.5"
                onClick={handleEditClick}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
            )}
          </div>
        )}

        {isApproved && document && (
          <div className="flex gap-2 w-full">
            <button
              type="button"
              className="btn btn-secondary flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-1.5"
              onClick={handleViewClick}
            >
              <i className="fas fa-eye"></i> View
            </button>
            {onDeleteVerification && (
              <button
                type="button"
                className="btn btn-danger flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-1.5"
                onClick={handleDeleteClick}
              >
                <i className="fas fa-trash-alt"></i> Delete
              </button>
            )}
          </div>
        )}

        {isRejected && (
          <div className="flex gap-2 w-full">
            <button
              type="button"
              className="btn btn-secondary flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-1"
              onClick={handleViewClick}
            >
              <i className="fas fa-info-circle"></i> Reason
            </button>
            <button
              type="button"
              className="btn btn-danger flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-1 font-semibold"
              onClick={handleEditClick}
            >
              <i className="fas fa-redo-alt"></i> Edit / Re-upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

KycDocumentCard.displayName = 'KycDocumentCard';
