import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../shared/hooks/useSidebar';
import { useTheme } from '../../shared/hooks/useTheme';
import { useAuthStore } from '../../shared/stores/auth/auth.store';
import { useLogout } from '../../features/authentication/public/model/use-otp-varify';

export default function CustomerLayout() {
    const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isAuthenticated = useAuthStore((state)=>state.isAuthenticated)
    const logout = useLogout()


    const handleLogout = async () => {
        await logout.mutateAsync()
        clearAuth();
        navigate('/login');
    }

    if (location.pathname.endsWith('/register') || location.pathname.endsWith('/register/')) {
        return <Outlet />;
    }

    return (
        <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`app-sidebar ${isSidebarOpen ? 'show' : ''}`} id="app-sidebar">
            <div className="sidebar-brand flex items-center justify-between">
                <Link to="/" className="logo flex items-center gap-2">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </Link>
                <button className="btn-icon ml-auto sidebar-inner-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Navigation</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-home"></i>
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Nearby Providers</span>
                            <span className="badge badge-primary ml-auto">12+</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-file-alt"></i>
                            <span>My Requests</span>
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
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-robot"></i>
                            <span>AI Assistant</span>
                            <span className="badge badge-primary ml-auto">AI</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-shopping-bag"></i>
                            <span>Products</span>
                            <span className="badge badge-success ml-auto">New</span>
                        </Link>
                    </li>
                </ul>

                <div className="menu-label mt-6">Preferences</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/notifications" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-bell"></i>
                            <span>Notifications</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-user-circle"></i>
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </NavLink>
                    </li>
                    <li className="mt-4 pt-2 border-top">
                        <button onClick={handleLogout} className="sidebar-item text-danger" style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
                            <i className="fas fa-sign-out-alt"></i>
                            <span><span>{isAuthenticated ? "Logout" : "Login"}</span></span>
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
                    <Link to="/" className="logo">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>
                </div>

                <div className="navbar-center hide-mobile">
                    <Link to="/admin/providers" className="nav-item-link">Nearby Providers</Link>
                    <Link to="#" className="nav-item-link">How It Works</Link>
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
                    <Link to="/profile" className="avatar avatar-sm ml-2" title="Profile">
                        <img src="https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366F1&color=fff&rounded=true" alt="Aarav" />
                    </Link>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
