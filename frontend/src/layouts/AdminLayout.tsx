import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useSidebar } from '../shared/hooks/useSidebar';
import { useTheme } from '../shared/hooks/useTheme';
import { useLogout } from '../modules/auth/hooks/mutations/use-otp-varify';
import { useAuthStore } from '../store/auth/auth.store';

export default function AdminLayout() {
    const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const logout = useLogout()
    const navigate = useNavigate()
    const handleLogout = async () => {
        await logout.mutateAsync()
        clearAuth();
        navigate('/login');
    }

    return (
        <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <aside className={`app-sidebar ${isSidebarOpen ? 'show' : ''}`} id="app-sidebar">
            <div className="sidebar-brand flex items-center justify-between">
                <NavLink to="/admin/dashboard" className="logo flex items-center gap-2">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </NavLink>
                <button className="btn-icon ml-auto sidebar-inner-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Platform Governance</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/admin/dashboard" end className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/customers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-users"></i>
                            <span>Customers</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/providers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-user-tie"></i>
                            <span>Providers</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink to="/admin/verification" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-user-check"></i>
                            <span>Verification</span>
                            <span className="badge badge-warning ml-auto">18</span>
                        </NavLink>
                    </li>
                    </ul>

                <div className="menu-label mt-6">Catalog</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/admin/categories" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-th-large"></i>
                            <span>Categories</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/services" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-concierge-bell"></i>
                            <span>Services</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-box-open"></i>
                            <span>Products</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-tags"></i>
                            <span>Product Categories</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Product Orders</span>
                        </Link>
                    </li>
                </ul>

                <div className="menu-label mt-6">Marketplace Operations</div>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-file-invoice"></i>
                            <span>Service Requests</span>
                        </Link>
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
                </ul>

                <div className="menu-label mt-6">System &amp; Intelligence</div>
                <ul className="sidebar-menu">
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
                    <li className="mt-4 pt-2 border-top">
                        <NavLink to="/login" className="sidebar-item text-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
            <main className="app-main">
                <header className="app-header admin-app-header">
                <div className="flex items-center gap-4">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="flex items-center gap-3">
                        <i className="fas fa-layer-group text-primary text-2xl"></i>
                        <div className="breadcrumbs-trail tracking-widest text-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                            ADMIN
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count">6</span>
                        </button>
                    </div>
                    <button onClick={handleLogout} className="btn btn-primary btn-sm hide-mobile">
                        Logout
                    </button>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
