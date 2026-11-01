import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
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
    label: "Notification Alerts",
    to: "/provider/notifications",
    icon: "fas fa-bell",
  },
];

export const ProviderSubnavSidebar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const verifications = useAuthStore((state) => state.verifications);
  const isVerified = isAuthenticated && verifications !== null && Object.values(verifications).every(Boolean);

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

  const isAccountSettingsActive =
    location.pathname === "/provider/settings" ||
    location.pathname.startsWith("/provider/settings");

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

      <div className="prov-subnav-sidebar-footer">
        <Link
          to="/provider/settings"
          className={`prov-subnav-sidebar-item ${isAccountSettingsActive ? "active" : ""}`}
        >
          <div className="prov-subnav-sidebar-icon">
            <i className="fas fa-cog"></i>
          </div>
          <span className="prov-subnav-sidebar-label">Account Settings</span>
          {!isVerified && (
            <span className="prov-subnav-warning-badge" title="Verification required">
              <i className="fas fa-exclamation"></i>
            </span>
          )}
          {isAccountSettingsActive && <span className="prov-subnav-sidebar-pill" />}
        </Link>
      </div>
    </aside>
  );
};
