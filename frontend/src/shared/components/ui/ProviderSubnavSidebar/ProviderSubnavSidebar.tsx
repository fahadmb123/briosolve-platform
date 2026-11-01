import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./ProviderSubnavSidebar.css";

interface SubnavItem {
  label: string;
  to: string;
  icon: string;
}

const WORKSPACE_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "Dashboard",
    to: "/provider/dashboard",
    icon: "fas fa-chart-pie",
  },
  {
    label: "Service Requests",
    to: "/provider/dashboard#requests",
    icon: "fas fa-search-dollar",
  },
  {
    label: "Bookings",
    to: "/provider/dashboard#bookings",
    icon: "fas fa-calendar-check",
  },
  {
    label: "Messages",
    to: "/provider/dashboard#messages",
    icon: "fas fa-comments",
  },
];

const SETTINGS_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "Business Profile",
    to: "/provider/profile",
    icon: "fas fa-user-tie",
  },
  {
    label: "KYC Documents",
    to: "/provider/kyc",
    icon: "fas fa-id-card",
  },
  {
    label: "Account Settings",
    to: "/provider/settings",
    icon: "fas fa-cog",
  },
  {
    label: "Notification Alerts",
    to: "/provider/notifications",
    icon: "fas fa-bell",
  },
];

export const ProviderSubnavSidebar: React.FC = () => {
  const location = useLocation();

  const isSettingsSection =
    location.pathname.startsWith("/provider/settings") ||
    location.pathname.startsWith("/provider/profile") ||
    location.pathname.startsWith("/provider/kyc") ||
    location.pathname.startsWith("/provider/notifications") ||
    location.pathname.startsWith("/provider/verification");

  const isWorkspaceSection =
    location.pathname === "/provider/dashboard" ||
    location.pathname.startsWith("/provider/dashboard");

  const activeSubnavItems = isSettingsSection
    ? SETTINGS_SUBNAV_ITEMS
    : isWorkspaceSection
    ? WORKSPACE_SUBNAV_ITEMS
    : null;

  const activeSubnavTitle = isSettingsSection
    ? "Settings"
    : isWorkspaceSection
    ? "Workspace"
    : "";

  const activeSubnavIcon = isSettingsSection
    ? "fas fa-sliders-h"
    : "fas fa-th-large";

  if (!activeSubnavItems) return null;

  return (
    <aside className="prov-subnav-sidebar" aria-label="Secondary navigation">
      <div className="prov-subnav-sidebar-header">
        <div className="prov-subnav-sidebar-badge">
          <i className={activeSubnavIcon}></i>
          <span>{activeSubnavTitle}</span>
        </div>
      </div>

      <nav className="prov-subnav-sidebar-nav">
        {activeSubnavItems.map((item) => {
          const [toPath, toHash] = item.to.split("#");
          const isActive = toHash
            ? location.pathname === toPath && location.hash === `#${toHash}`
            : toPath.endsWith("/dashboard")
            ? location.pathname === toPath && (!location.hash || location.hash === "")
            : location.pathname === toPath;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`prov-subnav-sidebar-item ${isActive ? "active" : ""}`}
            >
              <div className="prov-subnav-sidebar-icon">
                <i className={item.icon}></i>
              </div>
              <span className="prov-subnav-sidebar-label">{item.label}</span>
              {isActive && <span className="prov-subnav-sidebar-pill" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

