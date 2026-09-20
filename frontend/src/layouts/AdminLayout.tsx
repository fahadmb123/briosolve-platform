// @ts-nocheck
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="app-container">
            <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <a href="dashboard.html" className="logo">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </a>
                <span className="badge-admin">Admin</span>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Platform Governance</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="dashboard.html" className="sidebar-item">
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="../users/users.html" className="sidebar-item">
                            <i className="fas fa-users"></i>
                            <span>Users</span>
                        </a>
                    </li>
                    <li>
                        <a href="../providers/providers.html" className="sidebar-item">
                            <i className="fas fa-user-tie"></i>
                            <span>Providers</span>
                        </a>
                    </li>
                    <li>
                        <a href="../investigators/investigators.html" className="sidebar-item">
                            <i className="fas fa-user-secret"></i>
                            <span>Investigators</span>
                        </a>
                    </li>
                    <li>
                        <a href="../verification/verification.html" className="sidebar-item">
                            <i className="fas fa-user-check"></i>
                            <span>Verification</span>
                            <span className="badge badge-warning ml-auto">18</span>
                        </a>
                    </li>
                    </ul>

                <div className="menu-label mt-6">Catalog</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../categories/categories.html" className="sidebar-item">
                            <i className="fas fa-th-large"></i>
                            <span>Categories</span>
                        </a>
                    </li>
                    <li>
                        <a href="../services/services.html" className="sidebar-item">
                            <i className="fas fa-concierge-bell"></i>
                            <span>Services</span>
                        </a>
                    </li>
                    <li>
                        <a href="../products/products.html" className="sidebar-item">
                            <i className="fas fa-box-open"></i>
                            <span>Products</span>
                        </a>
                    </li>
                    <li>
                        <a href="../products/categories.html" className="sidebar-item">
                            <i className="fas fa-tags"></i>
                            <span>Product Categories</span>
                        </a>
                    </li>
                    <li>
                        <a href="../products/orders.html" className="sidebar-item">
                            <i className="fas fa-shopping-cart"></i>
                            <span>Product Orders</span>
                        </a>
                    </li>
                </ul>

                <div className="menu-label mt-6">Marketplace Operations</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../requests/requests.html" className="sidebar-item">
                            <i className="fas fa-file-invoice"></i>
                            <span>Service Requests</span>
                        </a>
                    </li>
                    <li>
                        <a href="../quotations/quotations.html" className="sidebar-item">
                            <i className="fas fa-calculator"></i>
                            <span>Quotations</span>
                        </a>
                    </li>
                    <li>
                        <a href="../bookings/bookings.html" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                        </a>
                    </li>
                    <li>
                        <a href="../investigations/investigations.html" className="sidebar-item">
                            <i className="fas fa-gavel"></i>
                            <span>Investigations</span>
                            <span className="badge badge-danger ml-auto">4</span>
                        </a>
                    </li>
                    <li>
                        <a href="../reviews/reviews.html" className="sidebar-item">
                            <i className="fas fa-star-half-alt"></i>
                            <span>Reviews</span>
                        </a>
                    </li>
                </ul>

                <div className="menu-label mt-6">System &amp; Intelligence</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../analytics/analytics.html" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Analytics</span>
                        </a>
                    </li>
                    <li>
                        <a href="../audit-logs/audit-logs.html" className="sidebar-item">
                            <i className="fas fa-history"></i>
                            <span>Audit Logs</span>
                        </a>
                    </li>
                    <li className="mt-4 pt-2 border-top">
                        <a href="../login/admin-login.html" className="sidebar-item text-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
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
