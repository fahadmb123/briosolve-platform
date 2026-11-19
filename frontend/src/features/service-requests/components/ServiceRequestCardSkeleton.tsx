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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Skeleton circle width={44} height={44} />
          <Skeleton width={180} height={13} borderRadius={4} />
        </div>
        <Skeleton width={85} height={24} borderRadius={9999} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
        <Skeleton width="55%" height={20} borderRadius={4} />
        <Skeleton width="85%" height={14} borderRadius={4} />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
          <Skeleton width={120} height={16} borderRadius={4} />
          <Skeleton width={110} height={16} borderRadius={4} />
          <Skeleton width={140} height={16} borderRadius={4} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.85rem", borderTop: "1px solid #f1f5f9" }}>
        <Skeleton width={110} height={24} borderRadius={6} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Skeleton width={60} height={28} borderRadius={6} />
          <Skeleton width={110} height={34} borderRadius={9999} />
        </div>
      </div>
    </div>
  );
};
