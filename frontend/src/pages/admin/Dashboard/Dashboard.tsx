import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <>
        <div className="app-content">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div>
                    <h1 className="h3 mb-1">Administrative Overview</h1>
                    <p className="text-secondary text-xs mb-0">Platform health, marketplace metrics, and pending governance actions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/admin/verification" className="btn btn-warning text-xs">
                        <i className="fas fa-user-check mr-1"></i>18 Verifications Pending
                    </Link>
                    <Link to="#" className="btn btn-danger text-xs">
                        <i className="fas fa-gavel mr-1"></i>4 Open Investigations
                    </Link>
                </div>
            </div>

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
            </div>

            <div className="dashboard-layout-grid">
                <div>
                    <div className="card p-5 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="h5 mb-0"><i className="fas fa-bolt text-warning mr-2"></i>Recent Platform Activity</h2>
                            <Link to="#" className="text-xs text-primary font-medium">View Full Audit Log <i className="fas fa-arrow-right ml-1"></i></Link>
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

                    <div className="card p-5">
                        <h2 className="h5 mb-3"><i className="fas fa-server text-info mr-2"></i>Platform Operational Health</h2>
                        <div className="health-grid">
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

                <div>
                    <div className="card p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="h5 mb-0"><i className="fas fa-clock text-warning mr-2"></i>Pending Actions Queue</h2>
                            <span className="badge badge-warning">29 Total</span>
                        </div>

                        <p className="text-xs text-secondary mb-4">Operational tasks requiring administrator intervention and review.</p>

                        <div className="pending-action-card">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-warning text-xs">Verification</span>
                                    <span className="text-xs font-semibold text-text">Farhan Ansari</span>
                                </div>
                                <div className="text-xs text-secondary mt-1">Master Electrician • 2 documents</div>
                            </div>
                            <Link to="/admin/verification" className="btn btn-secondary text-xs">Review</Link>
                        </div>

                        <div className="pending-action-card">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-warning text-xs">Verification</span>
                                    <span className="text-xs font-semibold text-text">Pooja Sharma</span>
                                </div>
                                <div className="text-xs text-secondary mt-1">HVAC Technician • 3 documents</div>
                            </div>
                            <Link to="/admin/verification" className="btn btn-secondary text-xs">Review</Link>
                        </div>

                        <div className="pending-action-card">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-danger text-xs">Investigation #INV-401</span>
                                    <span className="text-xs font-semibold text-text">Rahul vs Suresh</span>
                                </div>
                                <div className="text-xs text-secondary mt-1">AC Gas Refill Warranty Breach</div>
                            </div>
                            <Link to="#" className="btn btn-secondary text-xs">Investigate</Link>
                        </div>

                        <div className="pending-action-card">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-danger text-xs">Reported Review</span>
                                    <span className="text-xs font-semibold text-text">Review #REV-3912</span>
                                </div>
                                <div className="text-xs text-secondary mt-1">Aggressive claim regarding delay</div>
                            </div>
                            <Link to="#" className="btn btn-secondary text-xs">Moderate</Link>
                        </div>

                        <div className="pending-action-card">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-neutral text-xs">Flagged Account</span>
                                    <span className="text-xs font-semibold text-text">User #USR-8419</span>
                                </div>
                                <div className="text-xs text-secondary mt-1">Rapid quote spam detected</div>
                            </div>
                            <Link to="/admin/users" className="btn btn-secondary text-xs">Inspect</Link>
                        </div>

                        <div className="mt-4 pt-3 border-top text-center">
                            <Link to="#" className="text-xs text-muted hover:text-text">
                                <i className="fas fa-shield-alt mr-1"></i>Security Audit Log Status: Active
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}
