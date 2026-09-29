import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useSidebar } from '../shared/hooks/useSidebar';
import { useTheme } from '../shared/hooks/useTheme';

export default function ProviderLayout() {
    const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    if (location.pathname.endsWith('/register') || location.pathname.endsWith('/register/')) {
        return <Outlet />;
    }

    return (
        <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`app-sidebar ${isSidebarOpen ? 'show' : ''}`} id="app-sidebar">
            <div className="sidebar-brand flex items-center justify-between">
                <Link to="/provider/dashboard" className="logo flex items-center gap-2">
                    <i className="fas fa-tools text-primary"></i>
                    <span>ReverseMarket <small className="text-xs text-primary font-bold ml-1">PRO</small></span>
                </Link>
                <button className="btn-icon ml-auto sidebar-inner-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Provider Workspace</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/provider/dashboard" end className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-search-dollar"></i>
                            <span>Service Requests</span>
                            <span className="badge badge-primary ml-auto">8 New</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-file-invoice-dollar"></i>
                            <span>My Quotations</span>
                            <span className="badge badge-warning ml-auto">4</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                            <span className="badge badge-info ml-auto">3</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                            <span className="badge badge-danger ml-auto">2</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </Link>
                    </li>
                </ul>

                <div className="menu-label mt-6">Professional Profile</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/provider/verification" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-shield-alt"></i>
                            <span>Verification</span>
                            <span className="badge badge-success ml-auto"><i className="fas fa-check"></i></span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/provider/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-user-tie"></i>
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/provider/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </NavLink>
                    </li>
                    <li className="mt-4 pt-2 border-top">
                        <Link to="/provider/verification" className="sidebar-item text-primary font-medium" id="customer-mode-switch">
                            <i className="fas fa-exchange-alt"></i>
                            <span>Switch to User</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/login" className="sidebar-item text-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
            <main className="app-main">
                <header className="app-header">
                <div className="flex items-center gap-3">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar" title="Open Menu" onClick={handleSidebarToggle}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="breadcrumbs-trail text-xs text-secondary">
                        <span className="text-text font-medium">Provider Workspace</span>
                        <i className="fas fa-chevron-right text-muted mx-2"></i>
                        <span>Dashboard</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="badge badge-success text-xs py-1 px-2.5 flex items-center gap-1.5" title="You are receiving live customer requests in Andheri West">
                        <span className="pulse-dot-green"></span>
                        <span>Receiving Leads</span>
                    </span>
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <Link to="/login" className="btn btn-primary btn-sm hide-mobile">
                        <i className="fas fa-sign-out-alt mr-1"></i> Logout
                    </Link>
                    <Link to="/provider/profile" className="avatar avatar-sm ml-2" title="Arjun Menon (Verified Master Tech)">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&amp;auto=format&amp;fit=crop&amp;q=80" alt="Arjun Menon" style={{borderRadius: '50%'}} />
                    </Link>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
