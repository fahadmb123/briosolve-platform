import { useState, useRef, useEffect, Suspense } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../shared/hooks/useSidebar';
import { useTheme } from '../shared/hooks/useTheme';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { useLogout } from '../features/auth/hooks/use-otp-varify';
import NotificationDropdown from '../features/notifications/components/NotificationDropdown';

export default function AdminLayout() {
    const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const user = useAuthStore((state) => state.user);
    const logout = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isProfileOpen]);

    const handleLogout = async () => {
        setIsProfileOpen(false);
        await logout.mutateAsync();
        clearAuth();
        navigate('/login');
    };

    return (
        <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`app-sidebar ${isSidebarOpen ? 'show' : ''}`} id="app-sidebar">
            <div className="sidebar-brand flex items-center justify-between">
                <NavLink to="/admin/dashboard" className="brand-logo-container flex items-center gap-2">
                    <img src="/briosolve-logo.svg" alt="Briosolve" className="brand-emblem-logo" style={{ width: '28px', height: '28px' }} />
                    <img src="/briosolve-text-logo.svg" alt="Briosolve" className="brand-text-logo" style={{ height: '22px' }} />
                </NavLink>
                <button className="btn-icon ml-auto sidebar-inner-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/admin/users" 
                            className={() => `sidebar-item ${location.pathname.startsWith('/admin/users') || location.pathname.startsWith('/admin/customers') || location.pathname.startsWith('/admin/providers') ? 'active' : ''}`}
                        >
                            <i className="fas fa-users"></i>
                            <span>Users</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/admin/requests" 
                            className={() => `sidebar-item ${location.pathname.startsWith('/admin/requests') || location.pathname.startsWith('/admin/verification') || location.pathname.startsWith('/admin/reactivations') ? 'active' : ''}`}
                        >
                            <i className="fas fa-clipboard-check"></i>
                            <span>Requests</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink 
                            to="/admin/categories" 
                            className={() => `sidebar-item ${location.pathname.startsWith('/admin/categories') || location.pathname.startsWith('/admin/services') ? 'active' : ''}`}
                        >
                            <svg className="sidebar-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="3" width="7" height="7" rx="2" />
                                <rect x="14" y="3" width="7" height="7" rx="2" />
                                <rect x="3" y="14" width="7" height="7" rx="2" />
                                <rect x="14" y="14" width="7" height="7" rx="2" />
                            </svg>
                            <span>Categories</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/service-requests" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-file-invoice"></i>
                            <span>Service Requests</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-calculator"></i>
                            <span>Quotations</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-gavel"></i>
                            <span>Investigations</span>
                            <span className="badge badge-danger ml-auto">4</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-star-half-alt"></i>
                            <span>Reviews</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Analytics</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-history"></i>
                            <span>Audit Logs</span>
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="sidebar-footer admin-sidebar-footer">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="admin-sidebar-signout-btn"
                    title="Sign Out"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
            <main className="app-main">
                <header className="app-header admin-app-header">
                <div className="flex items-center gap-4">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="breadcrumbs-trail tracking-widest text-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        ADMIN
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <NotificationDropdown role="ADMIN" viewAllLink="/admin/notifications" />

                    <div className="admin-nav-profile-wrapper" ref={profileDropdownRef}>
                        <button
                            type="button"
                            className={`admin-nav-profile-btn ${isProfileOpen ? 'active' : ''}`}
                            onClick={() => setIsProfileOpen((prev) => !prev)}
                            aria-expanded={isProfileOpen}
                            aria-haspopup="menu"
                        >
                            <div className="admin-profile-avatar">
                                <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                                <span className="admin-status-dot"></span>
                            </div>
                            <div className="admin-profile-btn-info hide-mobile">
                                <span className="admin-profile-btn-name">{user?.name || 'Administrator'}</span>
                                <span className="admin-profile-btn-role">Admin</span>
                            </div>
                            <i className={`fas fa-chevron-down admin-profile-chevron ${isProfileOpen ? 'rotate' : ''}`}></i>
                        </button>

                        {isProfileOpen && (
                            <div className="admin-profile-dropdown" role="menu">
                                <div className="admin-profile-dropdown-header">
                                    <div className="admin-profile-avatar-lg">
                                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <div className="admin-profile-dropdown-info">
                                        <div className="admin-profile-name">{user?.name || 'Administrator'}</div>
                                        <div className="admin-profile-email">{user?.email || 'admin@briosolve.com'}</div>
                                        <span className="admin-role-badge">SUPER ADMIN</span>
                                    </div>
                                </div>

                                <div className="admin-dropdown-divider"></div>

                                <NavLink
                                    to="/admin/dashboard"
                                    className="admin-dropdown-item"
                                    role="menuitem"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <i className="fas fa-chart-line"></i>
                                    <span>Dashboard</span>
                                </NavLink>

                                <button
                                    type="button"
                                    className="admin-dropdown-item"
                                    role="menuitem"
                                    onClick={() => {
                                        toggleTheme();
                                    }}
                                >
                                    <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                                    <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
                                </button>

                                <div className="admin-dropdown-divider"></div>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="admin-dropdown-item admin-dropdown-logout"
                                    role="menuitem"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
                <Suspense fallback={<div className="app-content flex items-center justify-center p-8"><span className="spinner"></span></div>}>
                    <Outlet />
                </Suspense>
            </main>
        </div>
    );
}
