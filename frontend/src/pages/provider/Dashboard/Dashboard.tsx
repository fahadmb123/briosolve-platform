// @ts-nocheck
import React from 'react';

import { Link } from 'react-router-dom';
export default function Dashboard() {
  return (
    <>
<div className="app-content">
                
                <div className="pro-welcome-banner">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-primary text-xs">Level 3 Pro • Master Technician</span>
                            <span className="text-xs text-secondary"><i className="fas fa-map-marker-alt mr-1"></i> Kodungallur, Thrissur (Within 20 km)</span>
                        </div>
                        <h1 className="h2 mb-1">Good morning, Arjun</h1>
                        <p className="text-secondary text-sm mb-0">
                            Find new service requests and grow your business with zero platform commission.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="#" className="btn btn-primary">
                            <i className="fas fa-search-dollar mr-1"></i> Browse Service Requests
                        </Link>
                        <Link to="/provider/verification" className="btn btn-outline text-xs">
                            <i className="fas fa-shield-alt mr-1"></i> Verified Status
                        </Link>
                    </div>
                </div>

                
                <div className="card p-4 mb-6 flex justify-between items-center flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="icon-circle bg-primary-light text-primary" style={{"width":"40px","height":"40px","borderRadius":"50%","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"1.1rem"}}>
                            <i className="fas fa-compass"></i>
                        </div>
                        <div>
                            <div className="text-xs text-secondary uppercase font-semibold">Service Area</div>
                            <div className="text-sm font-bold text-text">📍 Kodungallur, Thrissur</div>
                            <div className="text-xs text-secondary">Within <strong>20 km</strong> radius • Active on-call dispatch</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link to="/provider/settings" className="btn btn-secondary btn-xs">
                            <i className="fas fa-sliders-h mr-1"></i> Manage Service Area
                        </Link>
                    </div>
                </div>

                
                <div className="pro-stats-grid">
                    
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-primary-light text-primary">
                            <i className="fas fa-search-dollar"></i>
                        </div>
                        <div className="stat-value">8</div>
                        <div className="stat-title">New Requests</div>
                        <div className="stat-meta text-primary"><i className="fas fa-bolt mr-1"></i> In your radius</div>
                    </div>

                    
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-warning-light text-warning">
                            <i className="fas fa-file-invoice-dollar"></i>
                        </div>
                        <div className="stat-value">4</div>
                        <div className="stat-title">Active Quotations</div>
                        <div className="stat-meta text-warning"><i className="fas fa-clock mr-1"></i> Under review</div>
                    </div>

                    
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-info-light text-info">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="stat-value">3</div>
                        <div className="stat-title">Accepted Bookings</div>
                        <div className="stat-meta text-info"><i className="fas fa-calendar-day mr-1"></i> Next: Tomorrow</div>
                    </div>

                    
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-success-light text-success">
                            <i className="fas fa-check-double"></i>
                        </div>
                        <div className="stat-value">142</div>
                        <div className="stat-title">Completed Services</div>
                        <div className="stat-meta text-success"><i className="fas fa-check-circle mr-1"></i> 99.4% on time</div>
                    </div>

                    
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-warning-light text-warning">
                            <i className="fas fa-star"></i>
                        </div>
                        <div className="stat-value">4.92 ★</div>
                        <div className="stat-title">Average Rating</div>
                        <div className="stat-meta text-success"><i className="fas fa-thumbs-up mr-1"></i> 186 reviews</div>
                    </div>

                    
                    <div className="card stat-widget">
                        <div className="stat-icon-wrapper bg-primary-light text-primary">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <div className="stat-value">₹3,84,500</div>
                        <div className="stat-title">Marketplace Volume</div>
                        <div className="stat-meta text-muted">All-time jobs won</div>
                    </div>
                </div>

                
                <div className="dashboard-grid-container">
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="h5 mb-0">New Opportunities Matching Your Skills</h2>
                                <p className="text-xs text-secondary mb-0">Plumbing &amp; AC repair requests posted recently in your radius</p>
                            </div>
                            <Link to="#" className="btn btn-outline text-xs">
                                View All (8) <i className="fas fa-arrow-right ml-1"></i>
                            </Link>
                        </div>

                        
                        <div className="opportunity-card match-lead">
                            <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                                <div>
                                    <div className="opportunity-badge-row">
                                        <span className="badge badge-primary text-xs">98% Skill Match</span>
                                        <span className="badge badge-warning text-xs"><i className="fas fa-clock mr-1"></i> 4 Bids Received</span>
                                        <span className="text-xs text-muted">ID: #REQ-84920 • Posted 2 hrs ago</span>
                                    </div>
                                    <h3 className="h6 mb-1">
                                        <Link to="#" className="text-text hover-primary">
                                            Bathroom Plumbing Repair &amp; Concealed Pipe Leak Fix
                                        </Link>
                                    </h3>
                                    <div className="text-xs text-secondary flex items-center gap-4 flex-wrap">
                                        <span><i className="fas fa-faucet text-primary mr-1"></i> Plumbing</span>
                                        <span><i className="fas fa-map-marker-alt text-primary mr-1"></i> Andheri West (1.8 km away)</span>
                                        <span><i className="fas fa-hourglass-half text-warning mr-1"></i> Deadline: Within 48 Hours</span>
                                    </div>
                                </div>
                                <div className="lead-price-box">
                                    <div className="text-xs text-secondary uppercase font-semibold">Client Budget</div>
                                    <div className="lead-budget">₹3,000 – ₹5,000</div>
                                </div>
                            </div>
                            <p className="text-xs text-secondary mb-3 leading-relaxed">
                                Continuous dripping from under-counter bathroom sink joint. Requires replacement of worn washers, Teflon sealing, and 30-min pressure test.
                            </p>
                            <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-top">
                                <span className="text-xs text-muted"><i className="fas fa-user-check text-success mr-1"></i> Verified Homeowner (Pooja S.)</span>
                                <div className="flex items-center gap-2">
                                    <Link to="#" className="btn btn-outline text-xs">
                                        View Details
                                    </Link>
                                    <Link to="#" className="btn btn-primary text-xs">
                                        <i className="fas fa-paper-plane mr-1"></i> Submit Quotation
                                    </Link>
                                </div>
                            </div>
                        </div>

                        
                        <div className="opportunity-card urgent-lead">
                            <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                                <div>
                                    <div className="opportunity-badge-row">
                                        <span className="badge badge-danger text-xs">Urgent Need</span>
                                        <span className="badge badge-secondary text-xs"><i className="fas fa-clock mr-1"></i> 2 Bids Received</span>
                                        <span className="text-xs text-muted">ID: #REQ-84915 • Posted 4 hrs ago</span>
                                    </div>
                                    <h3 className="h6 mb-1">
                                        <Link to="#" className="text-text hover-primary">
                                            Split AC Master Foam Jet Cleaning &amp; Gas Pressure Refill
                                        </Link>
                                    </h3>
                                    <div className="text-xs text-secondary flex items-center gap-4 flex-wrap">
                                        <span><i className="fas fa-snowflake text-primary mr-1"></i> AC Repair</span>
                                        <span><i className="fas fa-map-marker-alt text-primary mr-1"></i> Bandra West (4.2 km away)</span>
                                        <span><i className="fas fa-hourglass-half text-danger mr-1"></i> Needed Today</span>
                                    </div>
                                </div>
                                <div className="lead-price-box">
                                    <div className="text-xs text-secondary uppercase font-semibold">Client Budget</div>
                                    <div className="lead-budget">₹1,800 – ₹2,500</div>
                                </div>
                            </div>
                            <p className="text-xs text-secondary mb-3 leading-relaxed">
                                1.5 Ton Inverter AC cooling is weak. Deep coil jet cleaning, filter sanitization, and R32 pressure top-up requested.
                            </p>
                            <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-top">
                                <span className="text-xs text-muted"><i className="fas fa-user-check text-success mr-1"></i> Verified Homeowner (Rahul N.)</span>
                                <div className="flex items-center gap-2">
                                    <Link to="#" className="btn btn-outline text-xs">
                                        View Details
                                    </Link>
                                    <Link to="#" className="btn btn-primary text-xs">
                                        <i className="fas fa-paper-plane mr-1"></i> Submit Quotation
                                    </Link>
                                </div>
                            </div>
                        </div>

                        
                        <div className="opportunity-card">
                            <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                                <div>
                                    <div className="opportunity-badge-row">
                                        <span className="badge badge-info text-xs">Commercial Lead</span>
                                        <span className="badge badge-secondary text-xs">3 Bids Received</span>
                                        <span className="text-xs text-muted">ID: #REQ-84880 • Posted today</span>
                                    </div>
                                    <h3 className="h6 mb-1">
                                        <Link to="#" className="text-text hover-primary">
                                            Commercial Kitchen Grease Trap Overhaul &amp; CPVC Piping
                                        </Link>
                                    </h3>
                                    <div className="text-xs text-secondary flex items-center gap-4 flex-wrap">
                                        <span><i className="fas fa-faucet text-primary mr-1"></i> Commercial Plumbing</span>
                                        <span><i className="fas fa-map-marker-alt text-primary mr-1"></i> Juhu (2.5 km away)</span>
                                        <span><i className="fas fa-hourglass-half text-warning mr-1"></i> Deadline: 3 Days</span>
                                    </div>
                                </div>
                                <div className="lead-price-box">
                                    <div className="text-xs text-secondary uppercase font-semibold">Client Budget</div>
                                    <div className="lead-budget">₹6,000 – ₹9,000</div>
                                </div>
                            </div>
                            <p className="text-xs text-secondary mb-3 leading-relaxed">
                                Restaurant kitchen drainage backflow. Requires heavy-duty grease separator dismantling, solvent sealing, and new 2-inch pipe manifold.
                            </p>
                            <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-top">
                                <span className="text-xs text-muted"><i className="fas fa-building text-primary mr-1"></i> Business Client (Spice Garden Cafe)</span>
                                <div className="flex items-center gap-2">
                                    <Link to="#" className="btn btn-outline text-xs">
                                        View Details
                                    </Link>
                                    <Link to="#" className="btn btn-primary text-xs">
                                        <i className="fas fa-paper-plane mr-1"></i> Submit Quotation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="flex flex-col gap-4">
                        
                        <div className="card p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="h6 mb-0">Recent Activity</h3>
                                <span className="text-xs text-muted">Real-time alerts</span>
                            </div>

                            <div className="activity-feed-list">
                                
                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-success-light text-success">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">
                                            Quotation Accepted! Client Pooja S. accepted your ₹3,200 bid for <strong>#REQ-84920</strong>.
                                        </div>
                                        <div className="activity-time">12 minutes ago</div>
                                    </div>
                                </div>

                                
                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-primary-light text-primary">
                                        <i className="fas fa-comment-dots"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">
                                            New Message from Vikram M.: <em>"Can you arrive tomorrow at 10 AM?"</em>
                                        </div>
                                        <div className="activity-time">45 minutes ago</div>
                                    </div>
                                </div>

                                
                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-info-light text-info">
                                        <i className="fas fa-calendar-check"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">
                                            Booking Confirmed: AC Gas Refill for Sneha R. (BKG-7719).
                                        </div>
                                        <div className="activity-time">3 hours ago</div>
                                    </div>
                                </div>

                                
                                <div className="activity-feed-item">
                                    <div className="activity-icon-badge bg-warning-light text-warning">
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-title">
                                            New 5-Star Review received from Ananya K.: <em>"Fixed the leak within 2 hours, very professional!"</em>
                                        </div>
                                        <div className="activity-time">Yesterday, 4:30 PM</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="card p-5" style={{"background":"linear-gradient(135deg, var(--surface) 0%, rgba(99, 102, 241, 0.05) 100%)"}}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="avatar avatar-sm bg-success-light text-success">
                                    <i className="fas fa-shield-check text-lg"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-text mb-0">Level 3 Verified Pro</h4>
                                    <div className="text-xs text-secondary">Aadhaar + Trade License Active</div>
                                </div>
                            </div>
                            <p className="text-xs text-secondary mb-3">
                                Your verified profile is recommended to clients in 98% of relevant searches in Mumbai.
                            </p>
                            <Link to="/provider/verification" className="btn btn-outline text-xs w-full text-center">
                                Manage Verification Badges
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        
    

    
    </>
  );
}
