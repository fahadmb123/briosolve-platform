// @ts-nocheck
import React from 'react';

export default function Dashboard() {
  return (
    <>
<div className="app-container">
        {/*  Investigator Sidebar Navigation  */}
        <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <a href="dashboard.html" className="logo">
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
                        <a href="dashboard.html" className="sidebar-item active">
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
                        <a href="../settings/settings.html" className="sidebar-item">
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
                {/*  Stats Row  */}
                <div className="grid grid-cols-1 md-grid-cols-3 gap-6 mb-8">
                    {/*  Stat 1  */}
                    <div className="card p-5 border-primary bg-primary-light">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Total Assigned</h3>
                            <div className="avatar avatar-sm bg-primary text-white"><i className="fas fa-tasks"></i></div>
                        </div>
                        <div className="text-3xl font-bold text-dark" id="stat-assigned">0</div>
                        <div className="text-xs text-primary font-medium mt-2">All-time assignments</div>
                    </div>
                    
                    {/*  Stat 2  */}
                    <div className="card p-5 border-danger bg-danger-light">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-danger uppercase tracking-wider">Pending Investigations</h3>
                            <div className="avatar avatar-sm bg-danger text-white"><i className="fas fa-exclamation-triangle"></i></div>
                        </div>
                        <div className="text-3xl font-bold text-dark" id="stat-pending">0</div>
                        <div className="text-xs text-danger font-medium mt-2">Requires immediate action</div>
                    </div>

                    {/*  Stat 3  */}
                    <div className="card p-5 border-success">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-success uppercase tracking-wider">Completed</h3>
                            <div className="avatar avatar-sm bg-success text-white"><i className="fas fa-check-circle"></i></div>
                        </div>
                        <div className="text-3xl font-bold text-dark" id="stat-completed">0</div>
                        <div className="text-xs text-success mt-2">Successfully closed</div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="h5 mb-0">Action Required: Active Cases</h2>
                </div>

                {/*  Investigations List  */}
                <div id="investigations-list" className="flex flex-col gap-4">
                    <div id="empty-state" style={{"display":"none"}} className="card p-5 text-center text-secondary">
                        No assigned investigations currently.
                    </div>
                    
                    {/*  Investigation Card 1  */}
                    <div className="card p-5 inv-card" data-inv-id="INV-9802">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3 border-bottom pb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="badge badge-danger text-xs font-bold uppercase tracking-wider">High Priority</span>
                                    <span className="text-xs text-secondary font-medium">#INV-9802</span>
                                    <span className="text-xs text-secondary">• Sep 22, 2026</span>
                                </div>
                                <h3 className="h6 mb-1">Investigation: Refusal to Pay Balance</h3>
                                <p className="text-sm text-dark mb-0"><i className="fas fa-map-marker-alt text-danger mr-1"></i> Lokhandwala, Andheri West, Mumbai</p>
                            </div>
                            <div className="text-right">
                                <a href="../investigation-details/investigation-details.html" className="btn btn-primary btn-sm">
                                    Investigate Case <i className="fas fa-arrow-right ml-1"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md-grid-cols-4 gap-4 text-sm mt-3">
                            <div>
                                <div className="text-xs text-secondary mb-1">Raised By</div>
                                <div className="font-bold">Provider</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Parties Involved</div>
                                <div className="text-dark">ABC Electronics &amp; Aarav S.</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Original Service</div>
                                <div className="text-dark">TV Display Problem Fix</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Time Elapsed</div>
                                <div className="text-danger font-medium"><i className="fas fa-clock mr-1"></i> 4 hours ago</div>
                            </div>
                        </div>
                    </div>

                    {/*  Investigation Card 2  */}
                    <div className="card p-5 inv-card" data-inv-id="INV-9801">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3 border-bottom pb-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="badge badge-warning text-xs font-bold uppercase tracking-wider">Warranty Claim</span>
                                    <span className="text-xs text-secondary font-medium">#INV-9801</span>
                                    <span className="text-xs text-secondary">• Sep 21, 2026</span>
                                </div>
                                <h3 className="h6 mb-1">Customer reports issue not resolved</h3>
                                <p className="text-sm text-dark mb-0"><i className="fas fa-map-marker-alt text-danger mr-1"></i> Juhu, Mumbai</p>
                            </div>
                            <div className="text-right">
                                <a href="../investigation-details/investigation-details.html" className="btn btn-outline btn-sm">
                                    View Details <i className="fas fa-arrow-right ml-1"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md-grid-cols-4 gap-4 text-sm mt-3">
                            <div>
                                <div className="text-xs text-secondary mb-1">Raised By</div>
                                <div className="font-bold">Customer</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Parties Involved</div>
                                <div className="text-dark">QuickPlumb &amp; Rohan K.</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Original Service</div>
                                <div className="text-dark">Pipe Leakage Repair</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Time Elapsed</div>
                                <div className="text-secondary font-medium"><i className="fas fa-clock mr-1"></i> 1 day ago</div>
                            </div>
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
