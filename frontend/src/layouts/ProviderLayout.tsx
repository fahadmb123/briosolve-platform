// @ts-nocheck
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function ProviderLayout() {
    return (
        <div className="app-container">
            <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <Link to="/provider/dashboard" className="logo">
                    <i className="fas fa-tools text-primary"></i>
                    <span>ReverseMarket <small className="text-xs text-primary font-bold ml-1">PRO</small></span>
                </Link>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Provider Workspace</div>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/provider/dashboard" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </Link>
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
                        <Link to="/provider/verification" className="sidebar-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>Verification</span>
                            <span className="badge badge-success ml-auto"><i className="fas fa-check"></i></span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/provider/profile" className="sidebar-item">
                            <i className="fas fa-user-tie"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/provider/settings" className="sidebar-item">
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </Link>
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
                <div className="flex items-center gap-4">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar">
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
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                        <i className="fas fa-sun"></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <Link to="/provider/profile" className="avatar avatar-sm ml-1" title="Arjun Menon (Verified Master Tech)">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&amp;auto=format&amp;fit=crop&amp;q=80" alt="Arjun Menon" />
                    </Link>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
