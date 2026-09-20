import './Dashboard.css';

export default function Dashboard() {
  return (
    <>
      
    <div className="app-content">
                
                <div className="welcome-header flex justify-between items-center flex-wrap gap-4 mb-8">
                    <div>
                        <h1 className="h2 mb-1">Welcome back, Aarav 👋</h1>
                        <p className="text-secondary text-sm">
                            You have <span className="text-primary font-semibold">7 new quotations</span> waiting for your review across 2 active requests.
                        </p>
                    </div>
                    <a href="../create-request/create-request.html" className="btn btn-primary btn-lg cta-pulse-btn">
                        <i className="fas fa-plus-circle"></i>
                        <span>Post a Service Request</span>
                    </a>
                </div>

                
                <div className="dashboard-stats-grid mb-8">
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-primary-light text-primary">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="stat-body">
                            <div className="stat-value">3</div>
                            <div className="stat-title">Active Requests</div>
                            <div className="stat-meta text-success"><i className="fas fa-arrow-up"></i> 1 posted today</div>
                        </div>
                    </div>

                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-warning-light text-warning">
                            <i className="fas fa-file-invoice-dollar"></i>
                        </div>
                        <div className="stat-body">
                            <div className="stat-value">7</div>
                            <div className="stat-title">Quotations Received</div>
                            <div className="stat-meta text-primary"><i className="fas fa-balance-scale"></i> Ready to compare</div>
                        </div>
                    </div>

                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-info-light text-info">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="stat-body">
                            <div className="stat-value">1</div>
                            <div className="stat-title">Upcoming Booking</div>
                            <div className="stat-meta text-secondary"><i className="fas fa-clock"></i> Tomorrow, 10:30 AM</div>
                        </div>
                    </div>

                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-success-light text-success">
                            <i className="fas fa-check-circle"></i>
                        </div>
                        <div className="stat-body">
                            <div className="stat-value">14</div>
                            <div className="stat-title">Completed Services</div>
                            <div className="stat-meta text-muted">₹42,800 Total value</div>
                        </div>
                    </div>
                </div>

                
                <div className="dashboard-main-grid">
                    
                    <div className="grid-left flex flex-col gap-6">
                        
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <div>
                                    <h2 className="h5 mb-0">Active Service Requests</h2>
                                    <p className="text-xs text-secondary mb-0">Track quotes received from competing providers</p>
                                </div>
                                <a href="../requests/requests.html" className="btn btn-text text-xs">
                                    View All <i className="fas fa-chevron-right ml-1"></i>
                                </a>
                            </div>

                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Requirement</th>
                                            <th>Category</th>
                                            <th>Budget Range</th>
                                            <th>Quotations</th>
                                            <th>Status</th>
                                            <th className="text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a href="../request-details/request-details.html" className="font-semibold text-text hover-primary">
                                                    Bathroom Plumbing & Pipe Leak Repair
                                                </a>
                                                <div className="text-xs text-secondary mt-1">
                                                    <i className="fas fa-map-marker-alt"></i> Andheri West, Mumbai • Needed by Oct 15
                                                </div>
                                            </td>
                                            <td><span className="badge badge-secondary">Plumbing</span></td>
                                            <td className="font-medium">₹1,500 - ₹2,500</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="badge badge-warning font-semibold">4 Bids</span>
                                                    <span className="text-xs text-secondary">from ₹1,400</span>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-warning">Receiving Bids</span></td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a href="../quotations/quotations.html" className="btn btn-secondary text-xs py-1">
                                                        View Quotes (4)
                                                    </a>
                                                    <a href="../comparison/comparison.html" className="btn btn-primary text-xs py-1">
                                                        Compare
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="../request-details/request-details.html" className="font-semibold text-text hover-primary">
                                                    Split AC Master Cleaning & Gas Refill
                                                </a>
                                                <div className="text-xs text-secondary mt-1">
                                                    <i className="fas fa-map-marker-alt"></i> Bandra, Mumbai • Needed by Oct 18
                                                </div>
                                            </td>
                                            <td><span className="badge badge-secondary">AC Repair</span></td>
                                            <td className="font-medium">₹1,800 - ₹2,200</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="badge badge-warning font-semibold">3 Bids</span>
                                                    <span className="text-xs text-secondary">from ₹1,750</span>
                                                </div>
                                            </td>
                                            <td><span className="badge badge-warning">Receiving Bids</span></td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <a href="../quotations/quotations.html" className="btn btn-secondary text-xs py-1">
                                                        View Quotes (3)
                                                    </a>
                                                    <a href="../comparison/comparison.html" className="btn btn-primary text-xs py-1">
                                                        Compare
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <a href="../request-details/request-details.html" className="font-semibold text-text hover-primary">
                                                    Full 2BHK Deep House Sanitization
                                                </a>
                                                <div className="text-xs text-secondary mt-1">
                                                    <i className="fas fa-map-marker-alt"></i> Juhu, Mumbai • Needed by Oct 24
                                                </div>
                                            </td>
                                            <td><span className="badge badge-secondary">Cleaning</span></td>
                                            <td className="font-medium">₹4,000 - ₹5,500</td>
                                            <td>
                                                <span className="text-xs text-muted">Awaiting initial bids</span>
                                            </td>
                                            <td><span className="badge badge-primary">Published</span></td>
                                            <td className="text-right">
                                                <a href="../request-details/request-details.html" className="btn btn-secondary text-xs py-1">
                                                    View Details
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        
                        <div className="card">
                            <div className="card-header flex justify-between items-center">
                                <div>
                                    <h2 className="h5 mb-0">Upcoming Bookings</h2>
                                    <p className="text-xs text-secondary mb-0">Services confirmed and scheduled with providers</p>
                                </div>
                                <a href="../bookings/bookings.html" className="btn btn-text text-xs">
                                    All Bookings <i className="fas fa-chevron-right ml-1"></i>
                                </a>
                            </div>

                            <div className="card-body">
                                <div className="booking-card-item p-4 bg-surface-elevated rounded border flex justify-between items-center flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="date-badge-box text-center">
                                            <div className="date-month text-xs text-uppercase font-semibold text-primary">OCT</div>
                                            <div className="date-day font-bold text-lg">14</div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="h6 mb-0">Kitchen Water Purifier Installation</h3>
                                                <span className="badge badge-info">Confirmed</span>
                                            </div>
                                            <div className="text-xs text-secondary mb-2">
                                                Scheduled Time: <strong>10:30 AM - 11:30 AM</strong> • Booking ID: #BK-9204
                                            </div>

                                            
                                            <div className="flex items-center gap-2">
                                                <img src="https://ui-avatars.com/api/?name=Rajesh+Patil&background=334155&color=fff" alt="Rajesh Patil" className="avatar avatar-sm" />
                                                <span className="text-xs font-semibold">Rajesh Patil</span>
                                                <span className="badge badge-success text-xs py-0 px-2"><i className="fas fa-check-circle mr-1"></i> Verified</span>
                                                <span className="text-xs text-warning"><i className="fas fa-star"></i> 4.9 (184 jobs)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-xs text-secondary">Total Agreed</div>
                                            <div className="font-bold text-base text-text">₹1,200</div>
                                        </div>
                                        <a href="../chat/chat.html" className="btn btn-secondary btn-sm" aria-label="Chat with Provider">
                                            <i className="fas fa-comment-dots"></i> Chat
                                        </a>
                                        <a href="../booking-details/booking-details.html" className="btn btn-outline btn-sm">
                                            Manage
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="grid-right flex flex-col gap-6">
                        
                        <div className="card">
                            <div className="card-header">
                                <h2 className="h5 mb-0">Recent Activity</h2>
                            </div>
                            <div className="card-body p-0">
                                <ul className="activity-feed">
                                    <li className="activity-feed-item">
                                        <div className="feed-icon bg-warning-light text-warning">
                                            <i className="fas fa-file-invoice-dollar"></i>
                                        </div>
                                        <div className="feed-content">
                                            <div className="feed-title">
                                                <strong>Apex Plumbing Solutions</strong> submitted a quote of <strong>₹1,600</strong>
                                            </div>
                                            <div className="feed-meta text-xs text-secondary">
                                                For: Bathroom Plumbing Repair • 20 mins ago
                                            </div>
                                        </div>
                                    </li>

                                    <li className="activity-feed-item">
                                        <div className="feed-icon bg-info-light text-info">
                                            <i className="fas fa-comments"></i>
                                        </div>
                                        <div className="feed-content">
                                            <div className="feed-title">
                                                New message from <strong>Rajesh Patil</strong>
                                            </div>
                                            <div className="feed-preview text-xs text-muted">
                                                "I have picked up the RO filter spares. See you tomorrow at 10:30."
                                            </div>
                                            <div className="feed-meta text-xs text-secondary mt-1">
                                                1 hour ago
                                            </div>
                                        </div>
                                    </li>

                                    <li className="activity-feed-item">
                                        <div className="feed-icon bg-success-light text-success">
                                            <i className="fas fa-check-double"></i>
                                        </div>
                                        <div className="feed-content">
                                            <div className="feed-title">
                                                Booking <strong>#BK-9204</strong> Confirmed
                                            </div>
                                            <div className="feed-meta text-xs text-secondary">
                                                Provider accepted your schedule • 3 hours ago
                                            </div>
                                        </div>
                                    </li>

                                    <li className="activity-feed-item">
                                        <div className="feed-icon bg-primary-light text-primary">
                                            <i className="fas fa-paper-plane"></i>
                                        </div>
                                        <div className="feed-content">
                                            <div className="feed-title">
                                                New Request Published
                                            </div>
                                            <div className="feed-meta text-xs text-secondary">
                                                Split AC Master Cleaning • 5 hours ago
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        
                        <div className="card p-5 border-primary">
                            <div className="flex items-start gap-3">
                                <div className="tip-icon text-primary"><i className="fas fa-lightbulb"></i></div>
                                <div>
                                    <h3 className="h6 mb-1 text-primary">Marketplace Tip</h3>
                                    <p className="text-xs text-secondary mb-3">
                                        Comparing quotations? Don't just look at the price. Check provider completion ratings, warranty offered on parts, and past customer reviews.
                                    </p>
                                    <a href="../comparison/comparison.html" className="btn btn-outline text-xs py-1">
                                        Open Provider Comparison Tool
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    

    
    

    </>
  );
}
