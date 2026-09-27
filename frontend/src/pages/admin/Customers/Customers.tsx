// @ts-nocheck
import React from 'react';

import { Link } from 'react-router-dom';
export default function Customers() {
  return (
    <>
<div className="app-content">
                
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                    <div>
                        <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>Customer Management</h1>
                        <p className="text-secondary text-sm mb-0">Total platform accounts registered across Customer roles.</p>
                    </div>
                </div>

                
                <div className="admin-filter-bar">
                    <div className="admin-search-input">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="Search for email..." id="userSearchInput" />
                    </div>

                    <div className="admin-filters-group">


                        <select className="admin-select" id="statusFilter">
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="verified">Verified</option>
                        </select>

                        <button className="btn btn-secondary text-xs py-2" onClick={() => {}}>
                            <i className="fas fa-undo mr-1"></i>Reset
                        </button>
                    </div>
                </div>

                
                <div className="admin-table-card">
                    <div className="admin-table-header">
                        <div className="text-sm font-semibold text-text">Registered Accounts (Showing 1–10 of 14,820)</div>
                        <div className="text-xs text-muted"><i className="fas fa-shield-alt mr-1 text-primary"></i>Admin Action Logging Active</div>
                    </div>

                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Email Address</th>
                                    <th>Phone</th>
                                    <th>Joined Date</th>
                                    <th>Account Status</th>
                                    <th>Last Activity</th>
                                    <th className="text-right">Governance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="font-medium text-text">Aarav Sharma</div>
                                    </td>
                                    <td>aarav.sharma@example.com</td>
                                    <td>+91 98201 44521</td>
                                    <td>12 Oct 2025</td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>10 mins ago</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <div className="font-medium text-text">Neha Verma</div>
                                    </td>
                                    <td>neha.v@example.com</td>
                                    <td>+91 91234 56789</td>
                                    <td>Today</td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>2 mins ago</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>



                                <tr style={{"backgroundColor":"rgba(239, 68, 68, 0.03)"}}>
                                    <td>
                                        <div className="font-medium text-text">Kunal Singhania</div>
                                    </td>
                                    <td>kunal.singh@example.com</td>
                                    <td>+91 99881 22334</td>
                                    <td>14 Aug 2024</td>
                                    <td><span className="badge badge-danger-alert">Suspended</span></td>
                                    <td>2 days ago</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-success text-xs py-1 px-2" onClick={() => {}}>Activate</button>
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <div className="font-medium text-text">Rahul Nair</div>
                                    </td>
                                    <td>rahul.nair@example.com</td>
                                    <td>+91 98112 33445</td>
                                    <td>19 Mar 2024</td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>2 hours ago</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <div className="font-medium text-text">Priya Patel</div>
                                    </td>
                                    <td>priya.patel@example.com</td>
                                    <td>+91 98450 11223</td>
                                    <td>02 Jan 2025</td>
                                    <td><span className="badge badge-verified">Active</span></td>
                                    <td>Yesterday</td>
                                    <td className="text-right">
                                        <button className="btn btn-secondary text-xs py-1 px-2 mr-1" onClick={() => {}}>View</button>
                                        <button className="btn btn-danger text-xs py-1 px-2" onClick={() => {}}>Suspend</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    
                    <div className="admin-pagination">
                        <div>Showing <strong>1 to 10</strong> of 14,820 accounts</div>
                        <div className="pagination-controls">
                            <button className="page-btn" disabled><i className="fas fa-chevron-left"></i></button>
                            <button className="page-btn active">1</button>
                            <button className="page-btn" onClick={() => {}}>2</button>
                            <button className="page-btn" onClick={() => {}}>3</button>
                            <span className="px-1 text-muted">...</span>
                            <button className="page-btn" onClick={() => {}}>1482</button>
                            <button className="page-btn" onClick={() => {}}><i className="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        
    

    
    <div className="admin-modal-overlay" id="userDetailsModal">
        <div className="admin-modal">
            <div className="admin-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-id-card text-primary"></i>
                    <h3 className="h6 mb-0">Platform User Dossier</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="admin-modal-body">
                <div className="text-center mb-4">
                    <img id="modalUserAvatar" src="https://ui-avatars.com/api/?name=User&amp;background=6366F1&amp;color=fff" className="avatar avatar-lg mx-auto mb-2" alt="Avatar" />
                    <h4 className="h5 mb-0" id="modalUserName">User Name</h4>
                    <span className="user-meta-role" id="modalUserRole">Role</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Email</span>
                    <span className="text-text font-medium" id="modalUserEmail">email@example.com</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Phone</span>
                    <span className="text-text font-medium" id="modalUserPhone">+91 00000 00000</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Location</span>
                    <span className="text-text font-medium" id="modalUserLocation">Mumbai, India</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Registration Date</span>
                    <span className="text-text font-medium" id="modalUserJoined">Date</span>
                </div>
                <div className="modal-detail-row">
                    <span className="text-secondary">Account Status</span>
                    <span className="text-text font-medium" id="modalUserStatus">Active</span>
                </div>
            </div>
            <div className="admin-modal-footer">
                <button className="btn btn-secondary text-xs" onClick={() => {}}>Close</button>
            </div>
        </div>
    </div>

    
    <div className="admin-modal-overlay" id="suspendModal">
        <div className="admin-modal">
            <div className="admin-modal-header">
                <div className="flex items-center gap-2 text-danger">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h3 className="h6 mb-0 text-danger">Confirm Account Suspension</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="admin-modal-body">
                <p className="text-sm mb-3">Are you sure you want to suspend <strong id="suspendUserName">User</strong> (<span id="suspendUserId">#ID</span>)?</p>
                <div className="form-group mb-3">
                    <label className="form-label text-xs">Reason for Administrative Suspension (Logged to Audit Trail)</label>
                    <select className="form-control text-xs" id="suspendReason">
                        <option value="spam">Excessive spam inquiries or fraudulent bidding</option>
                        <option value="investigation">Unresolved contract investigation or policy violation</option>
                        <option value="safety">Customer safety report / verbal misconduct</option>
                        <option value="investigation">Temporary administrative freeze pending review</option>
                    </select>
                </div>
                <div className="p-3 bg-danger-light border rounded text-xs text-danger">
                    <i className="fas fa-info-circle mr-1"></i>Suspended users will immediately lose platform access until reinstated by an administrator.
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
