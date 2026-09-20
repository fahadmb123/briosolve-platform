// @ts-nocheck
import React from 'react';

export default function Dashboard() {
  return (
    <>
<div className="app-container">
        {/*  Admin Sidebar Navigation  */}
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
                        <a href="dashboard.html" className="sidebar-item active">
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

        {/*  Main Content  */}
        <main className="app-main">
            {/*  Topbar Navigation  */}
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

            <div className="app-content">
                {/*  Page Header Title  */}
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="h3 mb-1">Administrative Overview</h1>
                        <p className="text-secondary text-xs mb-0">Platform health, marketplace metrics, and pending governance actions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="../verification/verification.html" className="btn btn-warning text-xs">
                            <i className="fas fa-user-check mr-1"></i>18 Verifications Pending
                        </a>
                        <a href="../investigations/investigations.html" className="btn btn-danger text-xs">
                            <i className="fas fa-gavel mr-1"></i>4 Open Investigations
                        </a>
                    </div>
                </div>

                {/*  8 Dashboard Statistics Cards  */}
                <div className="admin-kpi-grid">
                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-primary-light text-primary">
                            <i className="fas fa-users"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">14,820</div>
                            <div className="admin-kpi-lbl">Total Users</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-info-light text-info">
                            <i className="fas fa-user-tie"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">3,410</div>
                            <div className="admin-kpi-lbl">Total Providers</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-success-light text-success">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">2,890</div>
                            <div className="admin-kpi-lbl">Verified Providers</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-warning-light text-warning">
                            <i className="fas fa-user-clock"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">18</div>
                            <div className="admin-kpi-lbl">Pending Verifications</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-primary-light text-primary">
                            <i className="fas fa-file-invoice"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">482</div>
                            <div className="admin-kpi-lbl">Active Requests</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-info-light text-info">
                            <i className="fas fa-calculator"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">2,140</div>
                            <div className="admin-kpi-lbl">Total Quotations</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-success-light text-success">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">315</div>
                            <div className="admin-kpi-lbl">Active Bookings</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-danger-light text-danger">
                            <i className="fas fa-gavel"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">4</div>
                            <div className="admin-kpi-lbl">Open Investigations</div>
                        </div>
                    </div>
                    
                    {/*  Product Marketplace KPIs  */}
                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-success-light text-success">
                            <i className="fas fa-box-open"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">142</div>
                            <div className="admin-kpi-lbl">Total Products</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-primary-light text-primary">
                            <i className="fas fa-tags"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">128</div>
                            <div className="admin-kpi-lbl">Active Products</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-danger-light text-danger">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">14</div>
                            <div className="admin-kpi-lbl">Out of Stock</div>
                        </div>
                    </div>

                    <div className="admin-kpi-card">
                        <div className="admin-kpi-icon bg-warning-light text-warning">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div>
                            <div className="admin-kpi-val">85</div>
                            <div className="admin-kpi-lbl">Product Orders</div>
                        </div>
                    </div>
                </div>

                {/*  Two-Column Operational Layout  */}
                <div className="dashboard-layout-grid">
                    {/*  Left: Recent Activity &amp; Platform Health  */}
                    <div>
                        {/*  Recent Activity Feed Card  */}
                        <div className="card p-5 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="h5 mb-0"><i className="fas fa-bolt text-warning mr-2"></i>Recent Platform Activity</h2>
                                <a href="../audit-logs/audit-logs.html" className="text-xs text-primary font-medium">View Full Audit Log <i className="fas fa-arrow-right ml-1"></i></a>
                            </div>

                            <div className="activity-feed-list">
                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-primary-light text-primary">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-text">New Customer Registered</span>
                                            <span className="text-xs text-muted">2 mins ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 mb-0"><strong>Neha Verma</strong> (neha.v@example.com) signed up from Bandra West, Mumbai.</p>
                                    </div>
                                </div>

                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-warning-light text-warning">
                                        <i className="fas fa-file-upload"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-text">Verification Dossier Submitted</span>
                                            <span className="text-xs text-muted">14 mins ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 mb-0"><strong>Farhan Ansari</strong> uploaded Govt ID &amp; Master Electrician Trade Diploma.</p>
                                    </div>
                                </div>

                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-info-light text-info">
                                        <i className="fas fa-plus-circle"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-text">New Service Request Published</span>
                                            <span className="text-xs text-muted">38 mins ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 mb-0"><strong>Full 2BHK Deep Sanitization</strong> posted by Aarav Sharma in Juhu (Budget ₹4,000–₹5,500).</p>
                                    </div>
                                </div>

                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-success-light text-success">
                                        <i className="fas fa-calculator"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-text">Quotation Submitted</span>
                                            <span className="text-xs text-muted">1 hour ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 mb-0"><strong>Rajesh Patil</strong> bid ₹1,800 on Bathroom Plumbing &amp; Pipe Leak Fix.</p>
                                    </div>
                                </div>

                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-danger-light text-danger">
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-text">Investigation Escalation Logged</span>
                                            <span className="text-xs text-muted">2 hours ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 mb-0">Booking #BK-8891 flagged for incomplete AC duct sealing by customer Rahul Nair.</p>
                                    </div>
                                </div>

                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-danger-light text-danger">
                                        <i className="fas fa-flag"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-text">Review Flagged for Inappropriate Tone</span>
                                            <span className="text-xs text-muted">3 hours ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mt-1 mb-0">Review #REV-3912 flagged by provider Suresh Kumar for moderation review.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Platform Health &amp; Summary  */}
                        <div className="card p-5">
                            <h2 className="h5 mb-3"><i className="fas fa-server text-info mr-2"></i>Platform Operational Health</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-surface-elevated rounded-md border">
                                    <div className="text-xs text-muted">API Latency</div>
                                    <div className="text-base font-bold text-success mt-1">42 ms (Optimal)</div>
                                    <div className="text-xs text-secondary mt-1">99.98% 30d Uptime</div>
                                </div>
                                <div className="p-3 bg-surface-elevated rounded-md border">
                                    <div className="text-xs text-muted">Active Sessions</div>
                                    <div className="text-base font-bold text-text mt-1">1,248 concurrent</div>
                                    <div className="text-xs text-secondary mt-1">Mumbai Edge Cluster</div>
                                </div>
                                <div className="p-3 bg-surface-elevated rounded-md border">
                                    <div className="text-xs text-muted">Audit Trail</div>
                                    <div className="text-base font-bold text-primary mt-1">Synchronized</div>
                                    <div className="text-xs text-secondary mt-1">Zero uncommitted writes</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Right Column: Pending Governance Actions  */}
                    <div>
                        <div className="card p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="h5 mb-0"><i className="fas fa-clock text-warning mr-2"></i>Pending Actions Queue</h2>
                                <span className="badge badge-warning">29 Total</span>
                            </div>

                            <p className="text-xs text-secondary mb-4">Operational tasks requiring administrator intervention and review.</p>

                            {/*  Action 1  */}
                            <div className="pending-action-card">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-warning text-xs">Verification</span>
                                        <span className="text-xs font-semibold text-text">Farhan Ansari</span>
                                    </div>
                                    <div className="text-xs text-secondary mt-1">Master Electrician • 2 documents</div>
                                </div>
                                <a href="../verification/verification.html" className="btn btn-secondary text-xs">Review</a>
                            </div>

                            {/*  Action 2  */}
                            <div className="pending-action-card">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-warning text-xs">Verification</span>
                                        <span className="text-xs font-semibold text-text">Pooja Sharma</span>
                                    </div>
                                    <div className="text-xs text-secondary mt-1">HVAC Technician • 3 documents</div>
                                </div>
                                <a href="../verification/verification.html" className="btn btn-secondary text-xs">Review</a>
                            </div>

                            {/*  Action 3  */}
                            <div className="pending-action-card">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-danger text-xs">Investigation #INV-401</span>
                                        <span className="text-xs font-semibold text-text">Rahul vs Suresh</span>
                                    </div>
                                    <div className="text-xs text-secondary mt-1">AC Gas Refill Warranty Breach</div>
                                </div>
                                <a href="../investigations/investigations.html" className="btn btn-secondary text-xs">Investigate</a>
                            </div>

                            {/*  Action 4  */}
                            <div className="pending-action-card">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-danger text-xs">Reported Review</span>
                                        <span className="text-xs font-semibold text-text">Review #REV-3912</span>
                                    </div>
                                    <div className="text-xs text-secondary mt-1">Aggressive claim regarding delay</div>
                                </div>
                                <a href="../reviews/reviews.html" className="btn btn-secondary text-xs">Moderate</a>
                            </div>

                            {/*  Action 5  */}
                            <div className="pending-action-card">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="badge badge-neutral text-xs">Flagged Account</span>
                                        <span className="text-xs font-semibold text-text">User #USR-8419</span>
                                    </div>
                                    <div className="text-xs text-secondary mt-1">Rapid quote spam detected</div>
                                </div>
                                <a href="../users/users.html" className="btn btn-secondary text-xs">Inspect</a>
                            </div>

                            <div className="mt-4 pt-3 border-top text-center">
                                <a href="../audit-logs/audit-logs.html" className="text-xs text-muted hover:text-text">
                                    <i className="fas fa-shield-alt mr-1"></i>Security Audit Log Status: Active
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    {/*  Main JS  */}
    </>
  );
}
