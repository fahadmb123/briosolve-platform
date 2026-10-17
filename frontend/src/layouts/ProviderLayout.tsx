import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../shared/hooks/useSidebar';
import { useTheme } from '../shared/hooks/useTheme';
import { useAuthStore } from '../store/auth/auth.store';
import { useLogout } from '../features/auth/hooks/mutations/use-otp-varify';
import type { ProviderProfile } from '../shared/types/Dtos';
import '../shared/styles/pro-badge.css';

export default function ProviderLayout() {
    const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const profile = useAuthStore((state) => state.profile) as ProviderProfile | null;
    const logout = useLogout();

    const handleLogout = async () => {
        if (!isAuthenticated) return navigate('/login');
        await logout.mutateAsync();
        clearAuth();
        navigate('/login');
    };

    if (location.pathname.endsWith('/register') || location.pathname.endsWith('/register/')) {
        return <Outlet />;
    }

    return (
        <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`app-sidebar ${isSidebarOpen ? 'show' : ''}`} id="app-sidebar">
            <div className="sidebar-brand flex items-center justify-between">
                <Link to="/provider/dashboard" className="logo flex items-center gap-2">
                    <i className="fas fa-tools text-primary text-xl"></i>
                    <span className="font-black text-lg" style={{ display: 'flex', alignItems: 'center' }}>
                        ReverseMarket 
                        <span className="pro-logo-badge ml-2">PRO</span>
                    </span>
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
                        <NavLink to="/provider/kyc" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-shield-alt"></i>
                            <span>KYC</span>
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
                        <button onClick={handleLogout} className="sidebar-item text-danger" style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span>{isAuthenticated ? "Logout" : "Login"}</span>
                        </button>
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
                    
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <button onClick={handleLogout} className="btn btn-primary btn-sm hide-mobile">
                       
                        <span>{isAuthenticated ? "Logout" : "Login"}</span>
                    </button>
                    <Link to="/provider/profile" className="avatar avatar-sm ml-2" title={`${user?.name || profile?.business_name || "Provider"} (Verified Pro)`}>
                        <img
                            src={profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff&rounded=true`}
                            alt={user?.name || "Provider"}
                            style={{borderRadius: '50%'}}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff&rounded=true`;
                            }}
                        />
                    </Link>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
