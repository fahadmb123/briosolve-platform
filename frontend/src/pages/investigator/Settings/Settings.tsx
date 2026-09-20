// @ts-nocheck
import React from 'react';

export default function Settings() {
  return (
    <>
<div className="app-container">
        {/*  Investigator Sidebar Navigation  */}
        <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <a href="../dashboard/dashboard.html" className="logo">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </a>
                <span className="badge-danger text-xs px-2 py-1 rounded font-bold">Investigator</span>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Portal</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../dashboard/dashboard.html" className="sidebar-item">
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="../investigations/investigations.html" className="sidebar-item">
                            <i className="fas fa-gavel"></i>
                            <span>Investigations</span>
                        </a>
                    </li>
                    <li>
                        <a href="../profile/profile.html" className="sidebar-item">
                            <i className="fas fa-user-shield"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="settings.html" className="sidebar-item active">
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                </ul>
            </div>
            
            {/*  User Info (Bottom)  */}
            <div className="sidebar-user mt-auto border-top pt-4 mt-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="avatar avatar-sm bg-danger text-white font-bold">IN</div>
                    <div className="overflow-hidden">
                        <div className="text-sm font-bold text-truncate" id="sidebar-inv-name">Investigator Name</div>
                        <div className="text-xs text-secondary text-truncate" id="sidebar-inv-expertise">Expertise</div>
                    </div>
                </div>
                <button className="btn btn-outline btn-sm w-full mt-4 text-xs" onClick={() => {}}>
                    <i className="fas fa-sign-out-alt mr-1"></i> Sign Out
                </button>
            </div>
        </aside>

        {/*  Main Content Area  */}
        <main className="app-main">
            {/*  Header  */}
            <header className="app-header">
                <div className="flex items-center gap-3">
                    <button id="sidebar-toggle" className="btn-icon sidebar-toggle-btn" aria-label="Toggle Sidebar">
                        <i className="fas fa-bars"></i>
                    </button>
                    <h1 className="h4 mb-0">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="btn-icon text-secondary"><i className="fas fa-bell"></i></button>
                </div>
            </header>

            <div className="app-content">
                <div className="grid grid-cols-1 lg-grid-cols-2 gap-6">
                    
                    {/*  Change Password  */}
                    <div className="card p-6">
                        <h2 className="h5 mb-4 border-bottom pb-2">Change Password</h2>
                        <form id="password-form">
                            <div className="form-group">
                                <label className="form-label text-xs">Current Password</label>
                                <input type="password" id="current-pwd" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-xs">New Password</label>
                                <input type="password" id="new-pwd" className="form-control" required />
                            </div>
                            <div className="form-group mb-4">
                                <label className="form-label text-xs">Confirm New Password</label>
                                <input type="password" id="confirm-pwd" className="form-control" required />
                            </div>
                            <button type="submit" className="btn btn-primary">Update Password</button>
                        </form>
                    </div>

                    {/*  Preferences  */}
                    <div className="flex flex-col gap-6">
                        <div className="card p-6">
                            <h2 className="h5 mb-4 border-bottom pb-2">Notification Preferences</h2>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-dark font-medium">Email Notifications for New Assignments</span>
                                    <input type="checkbox" checked />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-dark font-medium">SMS Alerts for High Priority Cases</span>
                                    <input type="checkbox" checked />
                                </label>
                                <label className="flex items-center justify-between">
                                    <span className="text-sm text-dark font-medium">Weekly Performance Summary</span>
                                    <input type="checkbox" />
                                </label>
                            </div>
                        </div>

                        {/*  Logout Card  */}
                        <div className="card p-6 border-danger bg-danger-light">
                            <h2 className="h5 mb-2 text-danger">Account Access</h2>
                            <p className="text-sm text-secondary mb-4">You are currently logged into the Investigator Portal.</p>
                            <button className="btn btn-danger w-full" onClick={() => {}}>
                                <i className="fas fa-sign-out-alt mr-1"></i> Sign Out Completely
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>

    {/*  Main JavaScript  */}
    </>
  );
}
