import React from "react";
import type { NotificationStatCard } from "../../../types/notification.types";

interface NotificationStatStripProps {
  stats: NotificationStatCard[];
}

export const NotificationStatStrip: React.FC<NotificationStatStripProps> = ({
  stats,
}) => {
  return (
    <div className="notif-stat-strip">
      {stats.map((stat) => (
        <div key={stat.id} className="notif-stat-card">
          <div
            className="notif-stat-icon"
            style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
          >
            <i className={`fas ${stat.icon}`}></i>
          </div>
          <div className="notif-stat-data">
            <div className="notif-stat-val">{stat.value}</div>
            <div className="notif-stat-lbl">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

