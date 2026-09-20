// @ts-nocheck
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function InvestigatorLayout() {
    return (
        <div className="app-container">
            <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <Link to="/investigator/dashboard" className="logo">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </Link>
                <span className="badge-danger text-xs px-2 py-1 rounded font-bold">Investigator</span>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Portal</div>
                <ul className="sidebar-menu">
                    <li>
                        <Link to="/investigator/dashboard" className="sidebar-item">
                            <i className="fas fa-chart-line"></i>
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-gavel"></i>
                            <span>Investigations</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/investigator/profile" className="sidebar-item">
                            <i className="fas fa-user-shield"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/investigator/settings" className="sidebar-item">
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
            </div>
            
            
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
            <main className="app-main">
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
                <Outlet />
            </main>
        </div>
    );
}
