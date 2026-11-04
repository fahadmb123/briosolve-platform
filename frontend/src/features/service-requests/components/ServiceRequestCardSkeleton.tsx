import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ServiceRequestCardSkeletonProps {
  variant?: "customer" | "provider";
}

export const ServiceRequestCardSkeleton: React.FC<ServiceRequestCardSkeletonProps> = ({
  variant = "customer",
}) => {
  const isProvider = variant === "provider";
  const cardClass = isProvider ? "provreq-clean-card" : "myreq-clean-card";
  const topRowClass = isProvider ? "provreq-card-top-row" : "myreq-card-top-row";
  const bodyClass = isProvider ? "provreq-card-body" : "myreq-card-content";
  const metaClass = isProvider ? "provreq-meta-grid" : "myreq-meta-row";
  const bottomRowClass = isProvider ? "provreq-card-bottom-row" : "myreq-card-bottom-row";
  const actionsClass = isProvider ? "provreq-card-actions" : "myreq-card-actions";

  return (
    <div className={cardClass} aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className={topRowClass}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Skeleton width={16} height={16} borderRadius={4} />
          <Skeleton width={135} height={16} borderRadius={4} />
        </div>
        <Skeleton width={96} height={24} borderRadius={9999} />
      </div>

      <div className={bodyClass}>
        <Skeleton width="72%" height={22} borderRadius={4} style={{ marginBottom: 10 }} />
        <Skeleton count={2} height={14} borderRadius={4} style={{ marginBottom: 6 }} />

        <div className={metaClass} style={{ marginTop: 12 }}>
          <Skeleton width={115} height={26} borderRadius={6} />
          <Skeleton width={125} height={26} borderRadius={6} />
          <Skeleton width={110} height={26} borderRadius={6} />
          <Skeleton width={95} height={26} borderRadius={6} />
        </div>
      </div>

      <div className={bottomRowClass} style={{ marginTop: 16 }}>
        <Skeleton width={120} height={16} borderRadius={4} />
        <div className={actionsClass}>
          <Skeleton width={80} height={32} borderRadius={7} />
          <Skeleton width={105} height={32} borderRadius={7} />
        </div>
      </div>
    </div>
  );
};

