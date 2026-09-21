// @ts-nocheck
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';

export default function AdminLayout() {
    const { isSidebarOpen, setIsSidebarOpen, isSidebarCollapsed, handleSidebarToggle } = useSidebar();

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
                        <NavLink to="/admin/users" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-users"></i>
                            <span>Users</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/providers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-user-tie"></i>
                            <span>Providers</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-user-secret"></i>
                            <span>Investigators</span>
                        </Link>
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
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-th-large"></i>
                            <span>Categories</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-concierge-bell"></i>
                            <span>Services</span>
                        </Link>
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
                <header className="app-header">
                <div className="flex items-center gap-4">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar" onClick={handleSidebarToggle}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="breadcrumbs-trail text-xs text-secondary">
                        <span className="text-text font-medium">Administration</span>
                        <i className="fas fa-chevron-right text-muted mx-2"></i>
                        <span>Operational Dashboard</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="badge badge-verified text-xs px-2 py-1"><i className="fas fa-circle text-xs mr-1" style={{"fontSize":"8px"}}></i>All Systems Operational</span>
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                        <i className="fas fa-sun"></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count">6</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 pl-2 border-left">
                        <img src="https://ui-avatars.com/api/?name=Vikram+Malhotra&amp;background=6366F1&amp;color=fff" alt="Admin Avatar" className="avatar avatar-sm" />
                        <div className="hidden sm:block text-left">
                            <div className="text-xs font-semibold text-text">Vikram Malhotra</div>
                            <div className="text-xs text-muted" style={{"fontSize":"10px"}}>Super Administrator</div>
                        </div>
                    </div>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
