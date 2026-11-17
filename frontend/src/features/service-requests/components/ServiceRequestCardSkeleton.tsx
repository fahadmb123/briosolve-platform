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
  const cardClass = isProvider ? "provreq-row-card" : "myreq-row-card";

  return (
    <div className={cardClass} aria-hidden="true" style={{ pointerEvents: "none" }}>
      <Skeleton circle width={48} height={48} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
        <Skeleton width={180} height={13} borderRadius={4} />
        <Skeleton width="55%" height={20} borderRadius={4} />
        <Skeleton width="85%" height={14} borderRadius={4} />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.25rem" }}>
          <Skeleton width={115} height={16} borderRadius={4} />
          <Skeleton width={125} height={16} borderRadius={4} />
          <Skeleton width={150} height={16} borderRadius={4} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
        <Skeleton width={110} height={26} borderRadius={9999} />
        <Skeleton width={48} height={48} borderRadius={8} />
        <Skeleton width={110} height={34} borderRadius={9999} />
      </div>
    </div>
  );
};
