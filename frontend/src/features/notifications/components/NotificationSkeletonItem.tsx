import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const NotificationSkeletonItem: React.FC = () => {
  return (
    <div className="notif-item" style={{ pointerEvents: "none" }} aria-hidden="true">
      <div className="notif-type-icon" style={{ background: "transparent" }}>
        <Skeleton circle width={40} height={40} />
      </div>
      <div className="notif-content-col" style={{ width: "100%" }}>
        <div className="notif-headline">
          <Skeleton width={160} height={18} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
        </div>
        <Skeleton width="80%" height={14} borderRadius={4} style={{ marginTop: 6 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Skeleton width={70} height={24} borderRadius={9999} />
          <Skeleton width={90} height={24} borderRadius={9999} />
        </div>
      </div>
    </div>
  );
};
