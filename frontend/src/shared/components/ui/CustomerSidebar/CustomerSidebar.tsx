import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import { useLogout } from "../../../../features/auth/hooks/use-otp-varify";

interface CustomerSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  isOpen,
  onToggle,
  onClose,
}) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useLogout();

  const handleLogout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await logout.mutateAsync();
    clearAuth();
    navigate("/login");
  };

  const handleItemClick = () => {
    if (onClose && window.innerWidth < 993) {
      onClose();
    }
  };

  return (
    <aside className={`app-sidebar ${isOpen ? "show" : ""}`} id="app-sidebar">
      <div className="sidebar-brand flex items-center justify-between">
        <Link
          to="/"
          className="logo flex items-center gap-2"
          onClick={handleItemClick}
        >
          <i className="fas fa-layer-group text-primary"></i>
          <span>ReverseMarket</span>
        </Link>
        <button
          type="button"
          className="btn-icon ml-auto sidebar-inner-toggle"
          aria-label="Toggle Sidebar"
          onClick={onToggle}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="sidebar-menu-wrapper">
        <div className="menu-label">Navigation</div>
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <i className="fas fa-chart-pie"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/nearby-providers"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <i className="fas fa-map-marked-alt"></i>
              <span>Nearby Providers</span>
            </NavLink>
          </li>
          <li>
            <Link to="#" className="sidebar-item" onClick={handleItemClick}>
              <i className="fas fa-file-alt"></i>
              <span>My Requests</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-item" onClick={handleItemClick}>
              <i className="fas fa-calendar-check"></i>
              <span>Bookings</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-item" onClick={handleItemClick}>
              <i className="fas fa-comments"></i>
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-item" onClick={handleItemClick}>
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-item" onClick={handleItemClick}>
              <i className="fas fa-robot"></i>
              <span>AI Assistant</span>
              <span className="badge badge-primary ml-auto">AI</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="sidebar-item" onClick={handleItemClick}>
              <i className="fas fa-shopping-bag"></i>
              <span>Products</span>
              <span className="badge badge-success ml-auto">New</span>
            </Link>
          </li>
        </ul>

        <div className="menu-label mt-6">Preferences</div>
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <i className="fas fa-user-circle"></i>
              <span>Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
              onClick={handleItemClick}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </NavLink>
          </li>
          <li className="mt-4 pt-2 border-top">
            <button
              type="button"
              onClick={handleLogout}
              className="sidebar-item text-danger"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>{isAuthenticated ? "Logout" : "Login"}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
