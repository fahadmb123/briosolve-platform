// @ts-nocheck
import React from 'react';

export default function Providers() {
  return (
    <>
<div className="app-content">
                
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="h3 mb-1">Service Provider Management</h1>
                        <p className="text-secondary text-xs mb-0">Track credentialed professionals, verified badges, service capacities, and reputation ratings.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a href="../verification/verification.html" className="btn btn-warning text-xs">
                            <i className="fas fa-user-check mr-1"></i>Review Pending Queue (18)
                        </a>
                    </div>
                </div>

                
                <div className="admin-filter-bar">
                    <div className="admin-search-input">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search by provider name, trade, license ID..." id="providerSearchInput" />
                    </div>

                    <div className="admin-filters-group">
                        <select className="admin-select" id="verifyFilter">
                            <option value="all">All Verification</option>
                            <option value="verified">Verified (2,890)</option>
                            <option value="pending">Pending (18)</option>
                            <option value="rejected">Rejected (84)</option>
                        </select>

                        <select className="admin-select" id="accountFilter">
                            <option value="all">All Account Status</option>
                            <option value="active">Active (3,382)</option>
                            <option value="suspended">Suspended (28)</option>
                        </select>

                        <button className="btn btn-secondary text-xs py-2" onClick={() => {}}>
                            <i className="fas fa-undo mr-1"></i>Reset
                        </button>
                    </div>
                </div>

                
                <div className="admin-table-card">
                    <div className="admin-table-header">
                        <div className="text-sm font-semibold text-text">3,410 Providers Listed (Showing 1–8)</div>
                        <div className="text-xs text-muted">2,890 Verified with Government KYC &amp; Trade Diploma</div>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Provider Specialist</th>
                                    <th>Service Categories</th>
                                    <th>Marketplace Rating</th>
                                    <th>Completed Jobs</th>
                                    <th>KYC &amp; Trade Verification</th>
                                    <th>Account Status</th>
                                    <th>Member Since</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Farhan+Ansari&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Farhan" />
                                            <div>
                                                <div className="font-medium text-text">Farhan Ansari</div>
                                                <div className="text-xs text-secondary">Apex Electrical &amp; Wiring</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">Electrical</span>
                                        <span className="trade-chip-sm">MCB Panels</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star"></i>
                                            <span>4.9</span>
                                            <span className="text-muted text-xs">(189)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">214 jobs</td>
                                    <td><span className="badge badge-verified"><i className="fas fa-check-circle mr-1"></i>Verified</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Jan 2025</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Rajesh+Patil&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Rajesh" />
                                            <div>
                                                <div className="font-medium text-text">Rajesh Patil</div>
                                                <div className="text-xs text-secondary">Master Flow Plumbing</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">Plumbing</span>
                                        <span className="trade-chip-sm">Sanitary</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star"></i>
                                            <span>4.95</span>
                                            <span className="text-muted text-xs">(312)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">340 jobs</td>
                                    <td><span className="badge badge-verified"><i className="fas fa-check-circle mr-1"></i>Verified</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Nov 2024</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Pooja+Sharma&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Pooja" />
                                            <div>
                                                <div className="font-medium text-text">Pooja Sharma</div>
                                                <div className="text-xs text-secondary">CoolBreeze HVAC Care</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">AC Repair</span>
                                        <span className="trade-chip-sm">Gas Refill</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star text-muted"></i>
                                            <span>New</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">12 jobs</td>
                                    <td><span className="badge badge-pending"><i className="fas fa-clock mr-1"></i>Pending</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Feb 2025</td>
                                    <td className="text-right">
                                        <a href="../verification/verification.html" className="btn btn-warning text-xs py-1 px-2 mr-1">Review Docs</a>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Arjun+Menon&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Arjun" />
                                            <div>
                                                <div className="font-medium text-text">Arjun Menon</div>
                                                <div className="text-xs text-secondary">Woodcraft Custom Furniture</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">Carpentry</span>
                                        <span className="trade-chip-sm">Cabinetry</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star"></i>
                                            <span>4.92</span>
                                            <span className="text-muted text-xs">(144)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">180 jobs</td>
                                    <td><span className="badge badge-verified"><i className="fas fa-check-circle mr-1"></i>Verified</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Jun 2024</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Suresh+Kumar&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Suresh" />
                                            <div>
                                                <div className="font-medium text-text">Suresh Kumar</div>
                                                <div className="text-xs text-secondary">All-Star Cooling Care</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">AC Service</span>
                                        <span className="trade-chip-sm">Compressor</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star"></i>
                                            <span>4.85</span>
                                            <span className="text-muted text-xs">(98)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">115 jobs</td>
                                    <td><span className="badge badge-verified"><i className="fas fa-check-circle mr-1"></i>Verified</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Nov 2023</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>

                                <tr style={{"backgroundColor":"rgba(239, 68, 68, 0.03)"}}>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Manish+Dubey&amp;background=EF4444&amp;color=fff" className="avatar avatar-sm" alt="Manish" />
                                            <div>
                                                <div className="font-medium text-text">Manish Dubey</div>
                                                <div className="text-xs text-danger">Quick Fix Electricals (Suspended)</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="trade-chip-sm">Electrical</span></td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star text-danger"></i>
                                            <span>3.2</span>
                                            <span className="text-muted text-xs">(19)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">21 jobs</td>
                                    <td><span className="badge badge-danger-alert"><i className="fas fa-times-circle mr-1"></i>Revoked</span></td>
                                    <td><span className="badge badge-danger-alert">Suspended</span></td>
                                    <td>Aug 2024</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-success text-xs py-1 px-2" onClick={() => {}}>Activate</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Ramesh+Chauhan&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Ramesh" />
                                            <div>
                                                <div className="font-medium text-text">Ramesh Chauhan</div>
                                                <div className="text-xs text-secondary">Metro Deep Cleaning Crew</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">Cleaning</span>
                                        <span className="trade-chip-sm">Sanitization</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star"></i>
                                            <span>4.95</span>
                                            <span className="text-muted text-xs">(210)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">260 jobs</td>
                                    <td><span className="badge badge-verified"><i className="fas fa-check-circle mr-1"></i>Verified</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>May 2024</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="provider-info-cell">
                                            <img src="https://ui-avatars.com/api/?name=Deepa+Nair&amp;background=6B7C98&amp;color=fff" className="avatar avatar-sm" alt="Deepa" />
                                            <div>
                                                <div className="font-medium text-text">Deepa Nair</div>
                                                <div className="text-xs text-secondary">Urban Green Pest Control</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="trade-chip-sm">Pest Control</span>
                                        <span className="trade-chip-sm">Termite</span>
                                    </td>
                                    <td>
                                        <div className="rating-stars-badge">
                                            <i className="fas fa-star"></i>
                                            <span>4.88</span>
                                            <span className="text-muted text-xs">(135)</span>
                                        </div>
                                    </td>
                                    <td className="font-medium">155 jobs</td>
                                    <td><span className="badge badge-verified"><i className="fas fa-check-circle mr-1"></i>Verified</span></td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Jul 2024</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    
                    <div className="admin-pagination">
                        <div>Showing <strong>1 to 8</strong> of 3,410 verified specialists</div>
                        <div className="pagination-controls">
                            <button className="page-btn" disabled><i className="fas fa-chevron-left"></i></button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn" onClick={() => {}}>2</button>
                            <button className="page-btn" onClick={() => {}}>3</button>
                            <span className="px-1 text-muted">...</span>
                            <button className="page-btn" onClick={() => {}}>341</button>
                            <button className="page-btn" onClick={() => {}}><i className="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        
    

    
    <div className="admin-modal-overlay" id="providerDetailsModal">
        <div className="admin-modal">
            <div className="admin-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-user-tie text-primary"></i>
                    <h3 className="h6 mb-0">Specialist Profile &amp; Credentials</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="admin-modal-body">
                <div className="text-center mb-4">
                    <img id="modalProvAvatar" src="https://ui-avatars.com/api/?name=Provider&amp;background=6B7C98&amp;color=fff" className="avatar avatar-lg mx-auto mb-2" alt="Avatar" />
                    <h4 className="h5 mb-0" id="modalProvName">Provider Name</h4>
                    <span className="text-xs text-secondary" id="modalProvBusiness">Business Name</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Rating</span>
                    <span className="text-text font-medium" id="modalProvRating">4.9/5</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Completed Volume</span>
                    <span className="text-text font-medium" id="modalProvJobs">200 Jobs</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">KYC &amp; Trade Verification</span>
                    <span className="text-text font-medium" id="modalProvVerify">Verified</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Direct Email</span>
                    <span className="text-text font-medium" id="modalProvEmail">email@example.com</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Phone</span>
                    <span className="text-text font-medium" id="modalProvPhone">+91 00000 00000</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Account Status</span>
                    <span className="text-text font-medium" id="modalProvStatus">Active</span>
                </div>
            </div>
            <div className="admin-modal-footer">
                <a href="../verification/verification.html" className="btn btn-secondary text-xs mr-auto">View Verification Dossier</a>
                <button className="btn btn-secondary text-xs" onClick={() => {}}>Close</button>
            </div>
        </div>
    </div>

    
    <div className="admin-modal-overlay" id="suspendModal">
        <div className="admin-modal">
            <div className="admin-modal-header">
                <div className="flex items-center gap-2 text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h3 className="h6 mb-0 text-danger">Confirm Provider Suspension</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="admin-modal-body">
                <p className="text-sm mb-3">Are you sure you want to suspend <strong id="suspendUserName">Provider</strong> (<span id="suspendUserId">#ID</span>)?</p>
                <div className="form-group mb-3">
                    <label className="form-label text-xs">Reason for Administrative Suspension</label>
                    <select className="form-control text-xs" id="suspendReason">
                        <option value="quality">Substandard service delivery / recurring customer investigations</option>
                        <option value="fraud">Fraudulent trade diploma / credential misrepresentation</option>
                        <option value="noshow">Unannounced cancellations and no-shows</option>
                        <option value="conduct">Unprofessional customer interactions</option>
                    </select>
                </div>
                <div className="p-3 bg-danger-light border rounded text-xs text-danger">
                    <i className="fas fa-info-circle mr-1"></i>Suspended providers will be immediately unlisted from "Nearby Providers" and blocked from submitting bids on open requests.
                </div>
            </div>
            <div className="admin-modal-footer">
                <button className="btn btn-secondary text-xs" onClick={() => {}}>Cancel</button>
                <button className="btn btn-danger text-xs" onClick={() => {}}>Confirm Suspension</button>
            </div>
        </div>
    </div>

    
    </>
  );
}
