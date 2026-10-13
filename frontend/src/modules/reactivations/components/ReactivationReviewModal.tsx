import React from 'react';
import { AdminModal } from '../../admin/components/AdminModal';
import type { ReactivationRequestItem } from '../types/reactivation.types';

interface ReactivationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ReactivationRequestItem | null;
  isLoading?: boolean;
  onApprove?: (request: ReactivationRequestItem) => void;
  onReject?: (request: ReactivationRequestItem) => void;
}

export const ReactivationReviewModal: React.FC<ReactivationReviewModalProps> = ({
  isOpen,
  onClose,
  request,
  isLoading,
  onApprove,
  onReject,
}) => {
  if (!request) return null;

  const isPending = request.status === 'PENDING';

  const handleApprove = () => {
    if (onApprove) {
      onApprove(request);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(request);
    }
  };

  const footer = (
    <div className="flex justify-between items-center w-full">
      <button
        type="button"
        className="btn btn-secondary text-xs"
        onClick={onClose}
      >
        Close
      </button>

      {isPending && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-danger text-xs"
            disabled={isLoading}
            onClick={handleReject}
          >
            <i className="fas fa-times-circle mr-1"></i>
            <span>Reject Appeal</span>
          </button>
          <button
            type="button"
            className="btn btn-primary text-xs"
            disabled={isLoading}
            onClick={handleApprove}
          >
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-check-circle'} mr-1`}></i>
            <span>{isLoading ? 'Activating...' : 'Approve & Reactivate'}</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Appeal Details &amp; Adjudication"
      icon="fas fa-user-shield"
      footer={footer}
    >
      <div className="space-y-4">
        {/* User Profile Card */}
        <div className="p-3 bg-surface-elevated border border-border rounded flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-border">
              {request.user.profile_image ? (
                <img src={request.user.profile_image} alt={request.user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{request.user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-sm text-text">{request.user.name}</div>
              <div className="text-xs text-secondary">{request.user.email}</div>
            </div>
          </div>
          <span className={`badge ${request.user.role === 'PROVIDER' ? 'badge-primary' : 'badge-secondary'} text-xs uppercase px-2 py-0.5 rounded font-medium`}>
            {request.user.role}
          </span>
        </div>

        {/* Current Appeal Status Banner */}
        <div className="flex items-center justify-between p-2.5 bg-surface border border-border rounded text-xs">
          <span className="text-secondary">Appeal Status:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded ${
              request.status === 'APPROVED'
                ? 'bg-success/15 text-success'
                : request.status === 'REJECTED'
                ? 'bg-danger/15 text-danger'
                : 'bg-warning/15 text-warning'
            }`}
          >
            {request.status}
          </span>
        </div>

        {/* Original Suspension Information */}
        <div className="p-3 bg-danger/5 border border-danger/20 rounded">
          <div className="text-xs font-semibold uppercase text-danger mb-1 flex items-center gap-1.5">
            <i className="fas fa-ban"></i>
            <span>Original Suspension Reason</span>
          </div>
          <p className="text-xs text-text mb-1">
            {request.block?.reason || 'Account administratively restricted for policy review.'}
          </p>
          {request.block?.blocked_at && (
            <span className="text-[11px] text-muted">
              Suspended on {new Date(request.block.blocked_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* User Appeal / Reactivation Reason */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded">
          <div className="text-xs font-semibold uppercase text-primary mb-1 flex items-center gap-1.5">
            <i className="fas fa-comment-alt"></i>
            <span>Submitted Reactivation Reason</span>
          </div>
          <p className="text-xs text-text whitespace-pre-wrap leading-relaxed">
            {request.reason}
          </p>
          <span className="text-[11px] text-muted block mt-2">
            Submitted on {new Date(request.created_at).toLocaleString()}
          </span>
        </div>

      </div>
    </AdminModal>
  );
};
