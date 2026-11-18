import React from "react";
import "./BookingCardSkeleton.css";

export const BookingCardSkeleton: React.FC = () => {
  return (
    <div className="bkcard-row-card bkcard-skeleton">
      <div className="bkcard-header">
        <div className="bkcard-header-left">
          <div className="bkcard-sk-shimmer bkcard-sk-avatar" />
          <div className="bkcard-sk-meta">
            <div className="bkcard-sk-shimmer bkcard-sk-line-sm" />
            <div className="bkcard-sk-shimmer bkcard-sk-line-xs" />
          </div>
        </div>
        <div className="bkcard-sk-shimmer bkcard-sk-badge" />
      </div>

      <div className="bkcard-body">
        <div className="bkcard-sk-shimmer bkcard-sk-line-md" />
        <div className="bkcard-sk-tags">
          <div className="bkcard-sk-shimmer bkcard-sk-tag" />
          <div className="bkcard-sk-shimmer bkcard-sk-tag" />
          <div className="bkcard-sk-shimmer bkcard-sk-tag" />
        </div>
      </div>

      <div className="bkcard-footer">
        <div className="bkcard-sk-shimmer bkcard-sk-price" />
        <div className="bkcard-sk-actions">
          <div className="bkcard-sk-shimmer bkcard-sk-btn" />
          <div className="bkcard-sk-shimmer bkcard-sk-btn" />
        </div>
      </div>
    </div>
  );
};
