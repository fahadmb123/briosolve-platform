// @ts-nocheck
import React from 'react';

export default function Verification() {
  return (
    <>
<div className="app-container">
        {/*  Sidebar Navigation  */}
        <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <a href="../dashboard/dashboard.html" className="logo">
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
                        <a href="../dashboard/dashboard.html" className="sidebar-item">
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
                        <a href="verification.html" className="sidebar-item active">
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

        {/*  Main Content  */}
        <main className="app-main">
            {/*  Topbar Navigation  */}
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

            <div className="app-content">
                {/*  Verification Status Overview  */}
                <div className="verification-status-banner mb-6 p-4 rounded-lg flex items-center gap-4 bg-warning-light border border-warning" id="verification-banner">
                    <div className="status-icon bg-warning text-white rounded-full w-12 h-12 flex items-center justify-center text-xl flex-shrink-0">
                        <i className="fas fa-clock"></i>
                    </div>
                    <div>
                        <h2 className="h5 mb-1 text-warning-dark">KYC Verification Pending</h2>
                        <p className="text-sm text-secondary mb-0">Please upload the required documents below to unlock your verified provider badge.</p>
                    </div>
                </div>

                {/*  Document Upload Grid  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/*  Identity Document  */}
                    <div className="doc-upload-card bg-surface border rounded-xl p-5 text-center">
                        <div className="icon-circle bg-primary-light text-primary mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4">
                            <i className="fas fa-id-card"></i>
                        </div>
                        <h3 className="font-bold text-text mb-1">Identity Document</h3>
                        <p className="text-xs text-secondary mb-4">Aadhaar Card, PAN Card, or Passport (Front &amp; Back)</p>
                        
                        <div className="doc-dropzone-box cursor-pointer p-4 border-2 border-dashed border-primary rounded-lg bg-primary-light hover:bg-primary-hover transition" onClick={() => {}}>
                            <i className="fas fa-cloud-upload-alt text-xl text-primary mb-2"></i>
                            <div className="font-medium text-sm text-primary">Upload Document</div>
                        </div>
                    </div>

                    {/*  Business Proof  */}
                    <div className="doc-upload-card bg-surface border rounded-xl p-5 text-center">
                        <div className="icon-circle bg-primary-light text-primary mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4">
                            <i className="fas fa-file-contract"></i>
                        </div>
                        <h3 className="font-bold text-text mb-1">Business Proof</h3>
                        <p className="text-xs text-secondary mb-4">Trade License, GST Certificate, or Shop Act</p>
                        
                        <div className="doc-dropzone-box cursor-pointer p-4 border-2 border-dashed border-primary rounded-lg bg-primary-light hover:bg-primary-hover transition" onClick={() => {}}>
                            <i className="fas fa-cloud-upload-alt text-xl text-primary mb-2"></i>
                            <div className="font-medium text-sm text-primary">Upload Document</div>
                        </div>
                    </div>

                    {/*  Additional Document  */}
                    <div className="doc-upload-card bg-surface border rounded-xl p-5 text-center">
                        <div className="icon-circle bg-primary-light text-primary mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4">
                            <i className="fas fa-certificate"></i>
                        </div>
                        <h3 className="font-bold text-text mb-1">Additional Credential</h3>
                        <p className="text-xs text-secondary mb-4">Vocational Certificates, Safety Training, etc. (Optional)</p>
                        
                        <div className="doc-dropzone-box cursor-pointer p-4 border-2 border-dashed border-primary rounded-lg bg-primary-light hover:bg-primary-hover transition" onClick={() => {}}>
                            <i className="fas fa-cloud-upload-alt text-xl text-primary mb-2"></i>
                            <div className="font-medium text-sm text-primary">Upload Document</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-top">
                    <button className="btn btn-primary btn-lg" onClick={() => {}}>
                        <i className="fas fa-paper-plane mr-2"></i> Submit for Verification
                    </button>
                </div>

                
            </div>
        </main>
    </div>

    {/*  Main JavaScript  */}
    </>
  );
}
