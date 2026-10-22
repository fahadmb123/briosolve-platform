import './Notifications.css';

import { Link } from 'react-router-dom';
export default function Notifications() {
  return (
    <>
      
    <div className="app-content">
                
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                        <div>
                            <h1 className="h2 mb-1">Notifications & Activity Alerts</h1>
                            <p className="text-secondary text-sm">
                                Real-time updates on bids, job milestones, and messages.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="btn btn-secondary text-xs">
                                <i className="fas fa-check-double mr-1"></i> Mark All as Read
                            </button>
                            <Link to="/settings" className="btn btn-outline text-xs" title="Notification Settings">
                                <i className="fas fa-sliders-h mr-1"></i> Preferences
                            </Link>
                        </div>
                    </div>

                    
                    <div className="flex flex-col gap-6">
                        
                        <div className="card p-0 notif-group-card">
                            <div className="group-header p-3 px-4 border-bottom bg-surface-elevated font-semibold text-xs text-secondary uppercase tracking-wider">
                                Today
                            </div>

                            <div className="notif-list">
                                
                                <div className="notif-item unread flex items-start gap-4 p-4 border-bottom">
                                    <div className="notif-type-icon bg-warning-light text-warning">
                                        <i className="fas fa-file-invoice-dollar"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                New Quotation Received from <Link to="#" className="text-primary">Farhan Ansari</Link>
                                            </div>
                                            <span className="text-xs text-muted">20m ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            Apex Plumbing Solutions quoted <strong>₹3,200</strong> for "Bathroom Plumbing Repair & Pipe Leak Fix".
                                        </p>
                                        <div className="flex gap-2">
                                            <Link to="#" className="btn btn-primary btn-xs">View Quotation</Link>
                                            <Link to="#" className="btn btn-secondary btn-xs">Compare (7)</Link>
                                        </div>
                                    </div>
                                    <span className="unread-dot"></span>
                                </div>

                                
                                <div className="notif-item unread flex items-start gap-4 p-4 border-bottom">
                                    <div className="notif-type-icon bg-info-light text-info">
                                        <i className="fas fa-comment-dots"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                New Message from <Link to="#" className="text-primary">Farhan Ansari</Link>
                                            </div>
                                            <span className="text-xs text-muted">1h ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            "Pressure test is holding up nicely, no drips at all. Running hot and cold water..."
                                        </p>
                                        <Link to="#" className="btn btn-secondary btn-xs">Reply in Chat</Link>
                                    </div>
                                    <span className="unread-dot"></span>
                                </div>

                                
                                <div className="notif-item flex items-start gap-4 p-4">
                                    <div className="notif-type-icon bg-success-light text-success">
                                        <i className="fas fa-wrench"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                Service Started for Booking #BK-8891
                                            </div>
                                            <span className="text-xs text-muted">3h ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            Farhan Ansari arrived on premises and marked the job milestone as <strong>In Progress</strong>.
                                        </p>
                                        <Link to="#" className="btn btn-outline btn-xs">Track Progress</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="card p-0 notif-group-card">
                            <div className="group-header p-3 px-4 border-bottom bg-surface-elevated font-semibold text-xs text-secondary uppercase tracking-wider">
                                Yesterday
                            </div>

                            <div className="notif-list">
                                
                                <div className="notif-item flex items-start gap-4 p-4 border-bottom">
                                    <div className="notif-type-icon bg-primary-light text-primary">
                                        <i className="fas fa-calendar-check"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                Booking Scheduled with Rajesh Patil
                                            </div>
                                            <span className="text-xs text-muted">Yesterday, 6:00 PM</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            "Kitchen Water Purifier Installation" has been locked for Oct 14 at 10:30 AM.
                                        </p>
                                        <Link to="#" className="btn btn-outline btn-xs">View Schedule</Link>
                                    </div>
                                </div>

                                
                                <div className="notif-item flex items-start gap-4 p-4">
                                    <div className="notif-type-icon bg-warning-light text-warning">
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                How was your AC Servicing experience?
                                            </div>
                                            <span className="text-xs text-muted">Yesterday, 11:30 AM</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            Sunil Verma completed your AC foam jet service. Help the community by leaving a star rating.
                                        </p>
                                        <Link to="#" className="btn btn-secondary btn-xs">Leave Review</Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="card p-0 notif-group-card">
                            <div className="group-header p-3 px-4 border-bottom bg-surface-elevated font-semibold text-xs text-secondary uppercase tracking-wider">
                                Earlier this month
                            </div>

                            <div className="notif-list">
                                
                                <div className="notif-item flex items-start gap-4 p-4">
                                    <div className="notif-type-icon bg-surface-elevated text-secondary">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                Security Login Alert
                                            </div>
                                            <span className="text-xs text-muted">Oct 5, 2026</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-0">
                                            Your account was logged in from Chrome on Windows (Mumbai IP: 103.48.xx.xx).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        
    

    
    

    </>
  );
}
