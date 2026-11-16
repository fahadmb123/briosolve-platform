import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const NotificationDropdownSkeleton: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 4px" }} aria-hidden="true">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "8px" }}>
          <Skeleton circle width={32} height={32} />
          <div style={{ flex: 1 }}>
            <Skeleton width="60%" height={14} borderRadius={4} />
            <Skeleton width="90%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
};
