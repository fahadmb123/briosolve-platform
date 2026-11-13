import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import "./CustomerSubnavSidebar.css";
import { useUnreadChatCount } from "../../../../features/chat";

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
    label: "Messages",
    to: "/messages",
    icon: "fas fa-comments",
  },
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

const MORE_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "My Requests",
    to: "/my-requests",
    icon: "fas fa-clipboard-list",
  },
  {
    label: "Request Service",
    to: "/request-service",
    icon: "fas fa-plus-circle",
  },
  {
    label: "Bookings",
    to: "/dashboard#bookings",
    icon: "fas fa-calendar-check",
  },
  {
    label: "Reviews",
    to: "/dashboard#reviews",
    icon: "fas fa-star",
  },
];

export const CustomerSubnavSidebar: React.FC = () => {
  const location = useLocation();
  const unreadMessagesCount = useUnreadChatCount();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const verifications = useAuthStore((state) => state.verifications);
  const isVerified = isAuthenticated && verifications !== null && Object.values(verifications).every(Boolean);
  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const showVerificationWarning = Boolean(isAuthenticated && !isAdmin && !isVerified);

  const isMoreSection =
    location.pathname.startsWith("/my-requests") ||
    location.pathname.startsWith("/request-service") ||
    location.pathname.startsWith("/bookings") ||
    location.pathname.startsWith("/reviews");

  const isWorkspaceSection =
    !isMoreSection &&
    (location.pathname === "/dashboard" ||
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/nearby-providers") ||
      location.pathname.startsWith("/messages") ||
      location.pathname.startsWith("/chat") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/notifications") ||
      location.pathname.startsWith("/settings"));

  const activeSubnavItems = isMoreSection
    ? MORE_SUBNAV_ITEMS
    : isWorkspaceSection
      ? WORKSPACE_SUBNAV_ITEMS
      : null;

  const activeSubnavTitle = isMoreSection
    ? "More"
    : isWorkspaceSection
      ? "Workspace"
      : "";

  const activeSubnavIcon = isMoreSection
    ? "fas fa-layer-group"
    : "fas fa-th-large";

  const isAccountSettingsActive =
    location.pathname === "/settings" ||
    location.pathname.startsWith("/settings");

  const navRef = useRef<HTMLElement>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [notchStyle, setNotchStyle] = useState<{ top: number; height: number; opacity: number }>({
    top: 0,
    height: 48,
    opacity: 0,
  });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useLayoutEffect(() => {
    const updateNotch = () => {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector<HTMLElement>(".cust-subnav-sidebar-item.active");
      if (activeEl) {
        setNotchStyle({
          top: activeEl.offsetTop,
          height: activeEl.offsetHeight,
          opacity: 1,
        });
      } else {
        setNotchStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateNotch();
    window.addEventListener("resize", updateNotch);
    return () => window.removeEventListener("resize", updateNotch);
  }, [location.pathname, location.hash, activeSubnavItems]);

  if (!activeSubnavItems) return null;

  return (
    <aside className={`cust-subnav-sidebar ${showVerificationWarning ? "has-verification-warning" : ""}`} aria-label="Secondary navigation">
      <div className="cust-subnav-sidebar-header">
        <div className="cust-subnav-sidebar-badge">
          <i className={activeSubnavIcon}></i>
          <span>{activeSubnavTitle}</span>
        </div>
      </div>

      <nav className="cust-subnav-sidebar-nav" ref={navRef}>
        <div
          className={`cust-subnav-active-notch ${hasMounted ? "is-animated" : ""}`}
          style={{
            transform: `translateY(${notchStyle.top}px)`,
            height: `${notchStyle.height}px`,
            opacity: notchStyle.opacity,
          }}
          aria-hidden="true"
        />
        {activeSubnavItems.map((item) => {
          const [toPath, toHash] = item.to.split("#");
          const isActive = toHash
            ? location.pathname === toPath && location.hash === `#${toHash}`
            : toPath === "/dashboard"
              ? location.pathname === toPath && (!location.hash || location.hash === "")
              : location.pathname === toPath || location.pathname.startsWith(`${toPath}/`);

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
              {item.to.includes("messages") && unreadMessagesCount > 0 && (
                <span className="cust-subnav-unread-badge">
                  {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                </span>
              )}
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
