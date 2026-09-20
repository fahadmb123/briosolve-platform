// @ts-nocheck
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function CustomerLayout() {
    return (
        <div className="app-container">
            <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand">
                <a href="../home/home.html" className="logo">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </a>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar" title="Close Menu">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Navigation</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../home/home.html" className="sidebar-item">
                            <i className="fas fa-home"></i>
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="dashboard.html" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="../nearby-providers/nearby-providers.html" className="sidebar-item">
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Nearby Providers</span>
                            <span className="badge badge-primary ml-auto">12+</span>
                        </a>
                    </li>
                    <li>
                        <a href="../requests/requests.html" className="sidebar-item">
                            <i className="fas fa-file-alt"></i>
                            <span>My Requests</span>
                        </a>
                    </li>
                    <li>
                        <a href="../bookings/bookings.html" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                        </a>
                    </li>
                    <li>
                        <a href="../chat/chat.html" className="sidebar-item">
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                        </a>
                    </li>
                    <li>
                        <a href="../reviews/reviews.html" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </a>
                    </li>
                    <li>
                        <a href="../ai-assistant/ai-assistant.html" className="sidebar-item">
                            <i className="fas fa-robot"></i>
                            <span>AI Assistant</span>
                            <span className="badge badge-primary ml-auto">AI</span>
                        </a>
                    </li>
                    <li>
                        <a href="../products/products.html" className="sidebar-item">
                            <i className="fas fa-shopping-bag"></i>
                            <span>Products</span>
                            <span className="badge badge-success ml-auto">New</span>
                        </a>
                    </li>
                </ul>

                <div className="menu-label mt-6">Preferences</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../notifications/notifications.html" className="sidebar-item">
                            <i className="fas fa-bell"></i>
                            <span>Notifications</span>
                        </a>
                    </li>
                    <li>
                        <a href="../profile/profile.html" className="sidebar-item">
                            <i className="fas fa-user-circle"></i>
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
                        <a href="../login/login.html" className="sidebar-item text-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
            <main className="app-main">
                <header className="app-header">
                <div className="flex items-center gap-3">
                    <button id="sidebar-toggle" className="btn-icon" aria-label="Toggle Sidebar" title="Open Menu">
                        <i className="fas fa-bars"></i>
                    </button>
                    <a href="../home/home.html" className="logo">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <a href="../nearby-providers/nearby-providers.html" className="nav-item-link hide-mobile">Nearby Providers</a>
                    <a href="#how-it-works" className="nav-item-link hide-mobile">How It Works</a>
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                        <i className="fas fa-sun"></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <a href="../create-request/create-request.html" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus mr-1"></i> Post Request
                    </a>
                    <a href="../../provider/register/register.html" className="btn btn-outline btn-sm hide-mobile">
                        Become a Provider
                    </a>
                    <a href="../profile/profile.html" className="avatar avatar-sm ml-1" title="Profile">
                        <img src="https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366F1&color=fff" alt="Aarav" />
                    </a>
                </div>
            </header>
                <Outlet />
            </main>
        </div>
    );
}
