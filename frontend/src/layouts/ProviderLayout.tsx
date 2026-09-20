// @ts-nocheck
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function ProviderLayout() {
    return (
        <div className="app-container">
            <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <a href="dashboard.html" className="logo">
                    <i className="fas fa-tools text-primary"></i>
                    <span>ReverseMarket <small className="text-xs text-primary font-bold ml-1">PRO</small></span>
                </a>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Provider Workspace</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="dashboard.html" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="../requests/requests.html" className="sidebar-item">
                            <i className="fas fa-search-dollar"></i>
                            <span>Service Requests</span>
                            <span className="badge badge-primary ml-auto">8 New</span>
                        </a>
                    </li>
                    <li>
                        <a href="../quotations/quotations.html" className="sidebar-item">
                            <i className="fas fa-file-invoice-dollar"></i>
                            <span>My Quotations</span>
                            <span className="badge badge-warning ml-auto">4</span>
                        </a>
                    </li>
                    <li>
                        <a href="../bookings/bookings.html" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                            <span className="badge badge-info ml-auto">3</span>
                        </a>
                    </li>
                    <li>
                        <a href="../chat/chat.html" className="sidebar-item">
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                            <span className="badge badge-danger ml-auto">2</span>
                        </a>
                    </li>
                    <li>
                        <a href="../reviews/reviews.html" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </a>
                    </li>
                </ul>

                <div className="menu-label mt-6">Professional Profile</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../verification/verification.html" className="sidebar-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>Verification</span>
                            <span className="badge badge-success ml-auto"><i className="fas fa-check"></i></span>
                        </a>
                    </li>
                    <li>
                        <a href="../profile/profile.html" className="sidebar-item">
                            <i className="fas fa-user-tie"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="../settings/settings.html" className="sidebar-item">
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                    <li className="mt-4 pt-2 border-top">
                        <a href="../../user/email-verification/email-verification.html?context=switch_role" className="sidebar-item text-primary font-medium" id="customer-mode-switch">
                            <i className="fas fa-exchange-alt"></i>
                            <span>Switch to User</span>
                        </a>
                    </li>
                    <li>
                        <a href="../../user/login/login.html" className="sidebar-item text-danger">
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
                    <a href="../profile/profile.html" className="avatar avatar-sm ml-1" title="Arjun Menon (Verified Master Tech)">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&amp;auto=format&amp;fit=crop&amp;q=80" alt="Arjun Menon" />
                    </a>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
