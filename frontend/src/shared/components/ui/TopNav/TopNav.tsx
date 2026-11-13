import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import { useLogout } from "../../../../features/auth/hooks/use-otp-varify";
import { useTheme } from "../../../hooks/useTheme";
import NotificationDropdown from "../../../../features/notifications/components/NotificationDropdown";
import type { UserRole } from "../../../../features/notifications/types/notification.types";
import "./TopNav.css";
import { useUnreadChatCount } from "../../../../features/chat";

let lastKnownTopNavPill: { left: number; width: number } | null = null;

export const TopNav: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const unreadMessagesCount = useUnreadChatCount();
  const verifications = useAuthStore(state=>state.verifications)
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useLogout();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);
  const linksNavRef = useRef<HTMLElement>(null);
  const isInitialCrossMount = useRef<boolean>(lastKnownTopNavPill !== null);
  const [pillHasMounted, setPillHasMounted] = useState<boolean>(() => lastKnownTopNavPill !== null);
  const [activePillStyle, setActivePillStyle] = useState<{ left: number; width: number; opacity: number }>(() => {
    if (lastKnownTopNavPill) {
      return { left: lastKnownTopNavPill.left, width: lastKnownTopNavPill.width, opacity: 1 };
    }
    return { left: 0, width: 0, opacity: 0 };
  });

  useEffect(() => {
    setPillHasMounted(true);
  }, []);

  useLayoutEffect(() => {
    let rafId: number | null = null;

    const updatePill = () => {
      if (!linksNavRef.current) return;
      const activeEl = linksNavRef.current.querySelector<HTMLElement>(".topnav-link.active");
      if (activeEl) {
        const navRect = linksNavRef.current.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        const targetLeft = elRect.left - navRect.left;
        const targetWidth = elRect.width;

        if (isInitialCrossMount.current) {
          isInitialCrossMount.current = false;
          rafId = requestAnimationFrame(() => {
            setActivePillStyle({
              left: targetLeft,
              width: targetWidth,
              opacity: 1,
            });
            lastKnownTopNavPill = { left: targetLeft, width: targetWidth };
          });
        } else {
          setActivePillStyle({
            left: targetLeft,
            width: targetWidth,
            opacity: 1,
          });
          lastKnownTopNavPill = { left: targetLeft, width: targetWidth };
        }
      } else {
        setActivePillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    window.addEventListener("resize", updatePill);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePill);
    };
  }, [location.pathname]);

  const isCustomer = isAuthenticated && user?.role === "CUSTOMER";
  const isProvider = isAuthenticated && user?.role === "PROVIDER";
  const isAdmin = isAuthenticated && user?.role === "ADMIN";
  const isVerified = verifications !== null && Object.values(verifications).every(Boolean);
  const showVerificationWarning = Boolean(isAuthenticated && !isAdmin && !isVerified);
  const verificationRoute = isProvider ? "/provider/kyc" : "/settings";

  useEffect(() => {
    document.body.classList.toggle("has-verification-warning", showVerificationWarning);
    return () => {
      document.body.classList.remove("has-verification-warning");
    };
  }, [showVerificationWarning]);



  const resolvedRole = useMemo<UserRole>(() => {
    if (user?.role === "ADMIN") return "ADMIN";
    if (user?.role === "PROVIDER") return "PROVIDER";
    return "CUSTOMER";
  }, [user?.role]);

  const dashboardRoute = useMemo(() => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "PROVIDER") return "/provider/dashboard";
    return "/dashboard";
  }, [user]);

  const profileRoute = useMemo(() => {
    if (isProvider) return "/provider/profile";
    if (isAdmin) return "/admin/dashboard";
    return "/profile";
  }, [isProvider, isAdmin]);

  const settingsRoute = useMemo(() => {
    if (isProvider) return "/provider/settings";
    if (isAdmin) return "/admin/settings";
    return "/settings";
  }, [isProvider, isAdmin]);

  const notificationRoute = useMemo(() => {
    if (user?.role === "ADMIN") return "/admin/notifications";
    if (user?.role === "PROVIDER") return "/provider/notifications";
    return "/notifications";
  }, [user?.role]);

  const handleLogout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await logout.mutateAsync();
    clearAuth();
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }, []);

  const closeAllMenus = useCallback(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".topnav-dropdown-wrapper")) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    (()=>{
      closeAllMenus();
    })()
  }, [location.pathname, closeAllMenus]);

  return (
    <>
      <header className={`topnav-header`} ref={navRef}>
        <div className="topnav-container">
        <div className="topnav-left">
          <Link to="/" className="topnav-brand" onClick={closeAllMenus}>
            <img src="/briosolve-logo.svg" alt="Briosolve" className="topnav-brand-logo" />
            <img src="/briosolve-text-logo.svg" alt="Briosolve" className="topnav-brand-text-logo" />
          </Link>

          <nav className="topnav-links" aria-label="Primary Navigation" ref={linksNavRef}>
            <div
              className={`topnav-active-pill ${pillHasMounted ? "is-animated" : ""}`}
              style={{
                transform: `translateX(${activePillStyle.left}px)`,
                width: `${activePillStyle.width}px`,
                opacity: activePillStyle.opacity,
              }}
              aria-hidden="true"
            />
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `topnav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>

            {isCustomer ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `topnav-link ${isActive ? "active" : ""}`
                  }
                >
                  Dashboard
                </NavLink>

                <div
                  className="topnav-dropdown-wrapper"
                  onMouseEnter={() => setOpenDropdown("workspace")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <NavLink
                    to="/nearby-providers"
                    className={() =>
                      `topnav-link topnav-dropdown-trigger ${
                        location.pathname.startsWith("/nearby-providers") ||
                        location.pathname.startsWith("/messages") ||
                        location.pathname.startsWith("/chat") ||
                        location.pathname.startsWith("/profile") ||
                        location.pathname.startsWith("/notifications") ||
                        location.pathname.startsWith("/settings")
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={() => {
                      setOpenDropdown(null);
                    }}
                    aria-expanded={openDropdown === "workspace"}
                    aria-haspopup="menu"
                  >
                    <span>Workspace</span>
                    <i
                      className={`fas fa-chevron-down topnav-caret ${
                        openDropdown === "workspace" ? "rotate" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown("workspace");
                      }}
                    ></i>
                  </NavLink>

                  {openDropdown === "workspace" && (
                    <div className="topnav-dropdown-menu" role="menu">
                      <div className="topnav-dropdown-section-title">Workspace</div>
                      <Link
                        to="/nearby-providers"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Find Providers</span>
                        <i className="fas fa-search-location"></i>
                      </Link>
                      <Link
                        to="/messages"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Messages</span>
                        {unreadMessagesCount > 0 && (
                          <span className="prov-mono-badge">
                            {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/profile"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Profile</span>
                        <i className="fas fa-user"></i>
                      </Link>
                      <Link
                        to="/notifications"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Notifications</span>
                        <i className="fas fa-bell"></i>
                      </Link>
                    </div>
                  )}
                </div>

                <div
                  className="topnav-dropdown-wrapper"
                  onMouseEnter={() => setOpenDropdown("more")}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <NavLink
                    to="/my-requests"
                    className={({ isActive }) =>
                      `topnav-link topnav-dropdown-trigger ${
                        isActive ||
                        location.pathname.startsWith("/my-requests") ||
                        location.pathname.startsWith("/request-service") ||
                        location.pathname.startsWith("/bookings") ||
                        location.pathname.startsWith("/reviews")
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={() => {
                      setOpenDropdown(null);
                    }}
                    aria-expanded={openDropdown === "more"}
                    aria-haspopup="menu"
                  >
                    <span>More</span>
                    <i
                      className={`fas fa-chevron-down topnav-caret ${
                        openDropdown === "more" ? "rotate" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown("more");
                      }}
                    ></i>
                  </NavLink>

                  {openDropdown === "more" && (
                    <div className="topnav-dropdown-menu" role="menu">
                      <div className="topnav-dropdown-section-title">Activity</div>
                      <Link
                        to="/request-service"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Request Service</span>
                        <i className="fas fa-plus-circle"></i>
                      </Link>
                      <Link
                        to="/my-requests"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>My Requests</span>
                        <i className="fas fa-file-alt"></i>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Bookings</span>
                        <i className="fas fa-calendar-check"></i>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Reviews</span>
                        <i className="fas fa-star"></i>
                      </Link>

                      <div className="topnav-dropdown-divider"></div>
                      <div className="topnav-dropdown-section-title">Features</div>
                      <Link
                        to="/dashboard"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>AI Assistant</span>
                        <span className="topnav-mono-badge">AI</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Products</span>
                        <span className="topnav-mono-badge">NEW</span>
                      </Link>
                      <Link
                        to="/#how-it-works"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>How It Works</span>
                        <i className="fas fa-info-circle"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : isAuthenticated ? (
              <NavLink
                to={dashboardRoute}
                className={({ isActive }) =>
                  `topnav-link ${isActive ? "active" : ""}`
                }
              >
                Dashboard
              </NavLink>
            ) : null}
          </nav>
        </div>

        <div className="topnav-right">
          {isAuthenticated ? (
            <>
              <Link
                to="/messages"
                className="topnav-icon-btn topnav-msg-nav-btn"
                title="Messages"
                aria-label="Messages"
              >
                <i className="fas fa-comments"></i>
                {unreadMessagesCount > 0 && (
                  <span className="topnav-msg-badge">
                    {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                  </span>
                )}
              </Link>

              <NotificationDropdown
                role={resolvedRole}
                viewAllLink={notificationRoute}
              />

              <div className="topnav-dropdown-wrapper">
                <button
                  type="button"
                  className={`topnav-user-btn ${
                    openDropdown === "account" ? "active" : ""
                  }`}
                  onClick={() => toggleDropdown("account")}
                  aria-expanded={openDropdown === "account"}
                >
                  <span className="topnav-user-avatar">
                    {profile?.profile_image ? (
                      <img
                        src={`${
                          profile.profile_image.startsWith("http")
                            ? ""
                            : import.meta.env.VITE_API_URL || "http://localhost:5000"
                        }${profile.profile_image}`}
                        alt={user?.name || "User"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User",
                          )}&background=000&color=fff&rounded=false`;
                        }}
                      />
                    ) : (
                      <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </span>
                  <span className="topnav-user-name hide-mobile">
                    {user?.name || "Account"}
                  </span>
                  <i
                    className={`fas fa-chevron-down topnav-caret ${
                      openDropdown === "account" ? "rotate" : ""
                    }`}
                  ></i>
                </button>

                {openDropdown === "account" && (
                  <div
                    className="topnav-dropdown-menu topnav-dropdown-menu-right"
                    role="menu"
                  >
                    <div className="topnav-dropdown-header">
                      <div className="topnav-header-title">{user?.name}</div>
                      <div className="topnav-header-sub">{user?.email}</div>
                      <div className="prov-header-meta">
                        {isVerified ? (
                          <span className="prov-mono-badge">
                            {isProvider ? "Verified Provider" : "Verified Customer"}
                          </span>
                        ) : (
                          <span className="prov-mono-badge">Not Verified</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={profileRoute}
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Profile</span>
                      <i className="fas fa-user"></i>
                    </Link>
                    {isProvider && (
                      <Link
                        to="/provider/kyc"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>KYC Verification</span>
                        <i className="fas fa-shield-alt"></i>
                      </Link>
                    )}
                    <NavLink
                      to={notificationRoute}
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Notifications</span>
                      <i className="fas fa-bell"></i>
                    </NavLink>
                    <Link
                      to={settingsRoute}
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span className="flex items-center gap-2">
                        Settings
                        {!isVerified && (
                          <span className="topnav-warning-badge" title="Verification required">
                            <i className="fas fa-exclamation"></i>
                          </span>
                        )}
                      </span>
                      <i className="fas fa-cog"></i>
                    </Link>
                    {isCustomer && (
                      <Link
                        to="/settings"
                        state={{activeView :'become-provider'}}
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Become a Provider</span>
                        <i className="fas fa-briefcase"></i>
                      </Link>
                    )}
                    <button
                      type="button"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={toggleTheme}
                    >
                      <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                      <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
                    </button>
                    <div className="topnav-dropdown-divider"></div>
                    <button
                      type="button"
                      className="topnav-dropdown-item topnav-dropdown-logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <span>Log Out</span>
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                )}
              </div>

              {isCustomer && (
                <Link to="/request-service" className="topnav-cta-btn hide-mobile">
                  <i className="fas fa-plus"></i>
                  <span>Post Request</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="topnav-text-link">
                Sign In
              </Link>
              <Link to="/register" className="topnav-cta-btn">
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            className="topnav-mobile-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>
    </header>

      {showVerificationWarning && (
        <div className="app-verification-warning-banner" role="alert">
          <div className="app-verification-warning-content">
            <i className="fas fa-exclamation-triangle app-verification-warning-icon"></i>
            <span className="app-verification-warning-text">
              Profile verification incomplete. Complete your verifications to unlock full marketplace access.
            </span>
            <Link to={verificationRoute} className="app-verification-warning-link">
              Complete Verification
            </Link>
          </div>
        </div>
      )}

      

      {mobileMenuOpen && (
        <>
          <div className="topnav-mobile-backdrop" onClick={closeAllMenus}></div>
          <div className="topnav-mobile-menu">
            {isAuthenticated ? (
              <div className="topnav-mobile-user-card">
                <span className="topnav-mobile-user-avatar">
                  {profile?.profile_image ? (
                    <img
                      src={`${
                        profile.profile_image.startsWith("http")
                          ? ""
                          : import.meta.env.VITE_API_URL || "http://localhost:5000"
                      }${profile.profile_image}`}
                      alt={user?.name || "User"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.name || "User",
                        )}&background=000&color=fff&rounded=false`;
                      }}
                    />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                </span>
                <div className="topnav-mobile-user-info">
                  <div className="topnav-mobile-user-name">{user?.name || "Customer"}</div>
                  <div className="topnav-mobile-user-email">{user?.email}</div>
                  <div className="topnav-mobile-user-badge">
                    {isVerified ? (
                      <span className="prov-mono-badge">
                        {isProvider ? "Verified Provider" : "Verified Customer"}
                      </span>
                    ) : (
                      <span className="prov-mono-badge">Not Verified</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="topnav-mobile-close-btn"
                  onClick={closeAllMenus}
                  aria-label="Close menu"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="topnav-mobile-guest-card">
                <div className="topnav-mobile-guest-title">Welcome to Briosolve</div>
                <div className="topnav-mobile-guest-sub">Connect with verified local specialists</div>
                <div className="flex gap-2 mt-2">
                  <Link to="/login" className="btn btn-primary btn-sm flex-1 justify-center" onClick={closeAllMenus}>Sign In</Link>
                  <Link to="/register" className="btn btn-secondary btn-sm flex-1 justify-center" onClick={closeAllMenus}>Register</Link>
                </div>
              </div>
            )}

            <div className="topnav-mobile-section">
              <div className="topnav-mobile-label">Navigation</div>
              <NavLink
                to="/"
                end
                className="topnav-mobile-item"
                onClick={closeAllMenus}
              >
                Home
              </NavLink>

              {isCustomer ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `topnav-mobile-item ${isActive ? "active" : ""}`
                    }
                    onClick={closeAllMenus}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink
                    to="/nearby-providers"
                    className={() =>
                      `topnav-mobile-item ${
                        location.pathname.startsWith("/nearby-providers") ||
                        location.pathname.startsWith("/messages") ||
                        location.pathname.startsWith("/chat") ||
                        location.pathname.startsWith("/profile") ||
                        location.pathname.startsWith("/notifications") ||
                        location.pathname.startsWith("/settings")
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={closeAllMenus}
                  >
                    Workspace
                  </NavLink>

                  <NavLink
                    to="/my-requests"
                    className={() =>
                      `topnav-mobile-item ${
                        location.pathname.startsWith("/my-requests") ||
                        location.pathname.startsWith("/request-service") ||
                        location.pathname.startsWith("/bookings") ||
                        location.pathname.startsWith("/reviews")
                          ? "active"
                          : ""
                      }`
                    }
                    onClick={closeAllMenus}
                  >
                    More
                  </NavLink>
                </>
              ) : isAuthenticated ? (
                <NavLink
                  to={dashboardRoute}
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Dashboard
                </NavLink>
              ) : null}
            </div>

            {isCustomer && (
              <>
                <div className="topnav-mobile-section">
                  <div className="topnav-mobile-label">Activity</div>
                  <Link
                    to="/request-service"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Request Service
                  </Link>
                  <Link
                    to="/my-requests"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    My Requests
                  </Link>
                  <Link
                    to="/dashboard"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Bookings
                  </Link>
                  <Link
                    to="/dashboard"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Reviews
                  </Link>
                </div>

                <div className="topnav-mobile-section">
                  <div className="topnav-mobile-label">Features</div>
                  <Link
                    to="/dashboard"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    AI Assistant
                  </Link>
                  <Link
                    to="/dashboard"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Products
                  </Link>
                  <Link
                    to="/#how-it-works"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    How It Works
                  </Link>
                </div>
              </>
            )}

            <div className="topnav-mobile-section">
              <div className="topnav-mobile-label">Account</div>
              {isAuthenticated ? (
                <>
                  <Link
                    to={profileRoute}
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Profile
                  </Link>
                  {isProvider && (
                    <Link
                      to="/provider/kyc"
                      className="topnav-mobile-item"
                      onClick={closeAllMenus}
                    >
                      KYC Verification
                    </Link>
                  )}
                  <Link
                    to={notificationRoute}
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Notifications
                  </Link>
                  <Link
                    to={settingsRoute}
                    className="topnav-mobile-item flex items-center justify-between"
                    onClick={closeAllMenus}
                  >
                    <span>Settings</span>
                    {!isVerified && (
                      <span className="topnav-warning-badge" title="Verification required">
                        <i className="fas fa-exclamation"></i>
                      </span>
                    )}
                  </Link>
                  {isCustomer && (
                    <Link
                      to="/provider/register"
                      className="topnav-mobile-item"
                      onClick={closeAllMenus}
                    >
                      Become a Provider
                    </Link>
                  )}
                  <button
                    type="button"
                    className="topnav-mobile-item flex items-center justify-between"
                    onClick={toggleTheme}
                  >
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                    <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
                  </button>
                  <button
                    type="button"
                    className="topnav-mobile-item topnav-mobile-logout"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      <nav className="topnav-bottom-bar" aria-label="Mobile Bottom Navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `topnav-bottom-item ${isActive ? "active" : ""}`}
          onClick={closeAllMenus}
        >
          <i className="fas fa-home"></i>
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/nearby-providers"
          className={({ isActive }) => `topnav-bottom-item ${isActive ? "active" : ""}`}
          onClick={closeAllMenus}
        >
          <i className="fas fa-search-location"></i>
          <span>Providers</span>
        </NavLink>

        <NavLink
          to="/request-service"
          className={({ isActive }) => `topnav-bottom-item topnav-bottom-item-center ${isActive ? "active" : ""}`}
          onClick={closeAllMenus}
        >
          <div className="topnav-bottom-center-icon">
            <i className="fas fa-plus"></i>
          </div>
          <span>Request</span>
        </NavLink>

        {isCustomer ? (
          <NavLink
            to="/my-requests"
            className={({ isActive }) => `topnav-bottom-item ${isActive ? "active" : ""}`}
            onClick={closeAllMenus}
          >
            <i className="fas fa-file-invoice"></i>
            <span>Requests</span>
          </NavLink>
        ) : (
          <NavLink
            to={isAuthenticated ? dashboardRoute : "/login"}
            className={({ isActive }) => `topnav-bottom-item ${isActive ? "active" : ""}`}
            onClick={closeAllMenus}
          >
            <i className={isAuthenticated ? "fas fa-chart-line" : "fas fa-user"}></i>
            <span>{isAuthenticated ? "Dashboard" : "Sign In"}</span>
          </NavLink>
        )}

        <button
          type="button"
          className={`topnav-bottom-item ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation drawer"
        >
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};

export const CustomerNavbar = TopNav;

