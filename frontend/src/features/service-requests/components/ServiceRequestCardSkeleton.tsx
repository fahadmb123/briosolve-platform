import React from "react";
import "./ServiceRequestCardSkeleton.css";

interface ServiceRequestCardSkeletonProps {
  variant?: "customer" | "provider";
}

export const ServiceRequestCardSkeleton: React.FC<ServiceRequestCardSkeletonProps> = ({
  variant = "customer",
}) => {
  const isProvider = variant === "provider";
  const cardClass = isProvider
    ? "provreq-row-card sr-card-skeleton"
    : "myreq-row-card sr-card-skeleton";
  const headerClass = isProvider ? "provreq-card-header" : "myreq-card-header";
  const headerLeftClass = isProvider ? "provreq-header-left" : "myreq-header-left";
  const headerRightClass = isProvider ? "provreq-header-right" : "myreq-header-right";
  const bodyClass = isProvider ? "provreq-card-body" : "myreq-card-body";
  const footerClass = isProvider ? "provreq-card-footer" : "myreq-card-footer";
  const footerLeftClass = isProvider ? "provreq-footer-left" : "myreq-footer-left";
  const footerRightClass = isProvider ? "provreq-footer-right" : "myreq-footer-right";

  return (
    <div className={cardClass} aria-hidden="true">
      <div className={headerClass}>
        <div className={headerLeftClass}>
          <div className="sr-sk-shimmer sr-sk-avatar" />
          <div className="sr-sk-meta">
            <div className="sr-sk-shimmer sr-sk-crumb-main" />
            <div className="sr-sk-shimmer sr-sk-crumb-sub" />
          </div>
        </div>
        <div className={headerRightClass}>
          <div className="sr-sk-shimmer sr-sk-badge" />
        </div>
      </div>

      <div className={bodyClass}>
        <div className="sr-sk-shimmer sr-sk-title" />
        <div className="sr-sk-shimmer sr-sk-desc-1" />
        <div className="sr-sk-shimmer sr-sk-desc-2" />
        <div className="sr-sk-tags">
          <div className="sr-sk-shimmer sr-sk-tag sr-sk-tag-calendar" />
          <div className="sr-sk-shimmer sr-sk-tag sr-sk-tag-clock" />
          <div className="sr-sk-shimmer sr-sk-tag sr-sk-tag-location" />
          {isProvider ? (
            <>
              <div className="sr-sk-shimmer sr-sk-tag sr-sk-tag-distance" />
              <div className="sr-sk-shimmer sr-sk-tag sr-sk-tag-budget" />
            </>
          ) : (
            <div className="sr-sk-shimmer sr-sk-tag sr-sk-tag-quotes" />
          )}
        </div>
      </div>

      <div className={footerClass}>
        <div className={footerLeftClass}>
          <div className="sr-sk-shimmer sr-sk-photo-placeholder" />
        </div>
        <div className={footerRightClass}>
          {!isProvider ? (
            <>
              <div className="sr-sk-shimmer sr-sk-btn-link" />
              <div className="sr-sk-shimmer sr-sk-btn-danger" />
              <div className="sr-sk-shimmer sr-sk-btn-primary" />
            </>
          ) : (
            <>
              <div className="sr-sk-shimmer sr-sk-btn-link" />
              <div className="sr-sk-shimmer sr-sk-btn-primary" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
