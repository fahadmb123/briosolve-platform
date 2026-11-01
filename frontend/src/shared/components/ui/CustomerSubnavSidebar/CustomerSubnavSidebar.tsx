import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import "./CustomerSubnavSidebar.css";

interface SubnavItem {
  label: string;
  to: string;
  icon: string;
}

const WORKSPACE_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: "fas fa-chart-pie",
  },
  {
    label: "Find Providers",
    to: "/nearby-providers",
    icon: "fas fa-search-location",
  },
  {
    label: "Request Service",
    to: "/request-service",
    icon: "fas fa-plus-circle",
  },
];

const SETTINGS_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "Profile",
    to: "/profile",
    icon: "fas fa-user",
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: "fas fa-bell",
  },
];

export const CustomerSubnavSidebar: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const verifications = useAuthStore((state) => state.verifications);
  const isVerified = isAuthenticated && verifications !== null && Object.values(verifications).every(Boolean);

  const isSettingsSection =
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/notifications");

  const isWorkspaceSection =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/nearby-providers") ||
    location.pathname.startsWith("/request-service");

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
    location.pathname === "/settings" ||
    location.pathname.startsWith("/settings");

  if (!activeSubnavItems) return null;

  return (
    <aside className="cust-subnav-sidebar" aria-label="Secondary navigation">
      <div className="cust-subnav-sidebar-header">
        <div className="cust-subnav-sidebar-badge">
          <i className={activeSubnavIcon}></i>
          <span>{activeSubnavTitle}</span>
        </div>
      </div>

      <nav className="cust-subnav-sidebar-nav">
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
              className={`cust-subnav-sidebar-item ${isActive ? "active" : ""}`}
            >
              <div className="cust-subnav-sidebar-icon">
                <i className={item.icon}></i>
              </div>
              <span className="cust-subnav-sidebar-label">{item.label}</span>
              {isActive && <span className="cust-subnav-sidebar-pill" />}
            </Link>
          );
        })}
      </nav>

      <div className="cust-subnav-sidebar-footer">
        <Link
          to="/settings"
          className={`cust-subnav-sidebar-item ${isAccountSettingsActive ? "active" : ""}`}
        >
          <div className="cust-subnav-sidebar-icon">
            <i className="fas fa-cog"></i>
          </div>
          <span className="cust-subnav-sidebar-label">Account Settings</span>
          {!isVerified && (
            <span className="cust-subnav-warning-badge" title="Verification required">
              <i className="fas fa-exclamation"></i>
            </span>
          )}
          {isAccountSettingsActive && <span className="cust-subnav-sidebar-pill" />}
        </Link>
      </div>
    </aside>
  );
};
