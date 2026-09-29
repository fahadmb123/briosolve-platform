// @ts-nocheck
import React from 'react';

export default function Profile() {
  return (
    <>
<div className="app-content">
                <form id="profile-form">
                    <div className="grid grid-cols-1 lg-grid-cols-3 gap-6">
                        
                        
                        <div className="lg-col-span-2 flex flex-col gap-6">
                            
                            <div className="card p-6">
                                <h2 className="h5 mb-4 border-bottom pb-2">Basic Information</h2>
                                
                                <div className="flex items-center gap-4 mb-5">
                                    <img src="https://ui-avatars.com/api/?name=IN&amp;background=EF4444&amp;color=fff" id="profile-avatar" className="avatar avatar-lg rounded-circle" alt="Profile" />
                                    <button type="button" className="btn btn-outline btn-sm">Change Photo</button>
                                </div>

                                <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label text-xs">Full Name</label>
                                        <input type="text" id="prof-name" className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-xs">Email Address</label>
                                        <input type="email" id="prof-email" className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-xs">Phone Number</label>
                                        <input type="tel" id="prof-phone" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h2 className="h5 mb-4 border-bottom pb-2">Professional Information</h2>
                                <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                                    <div className="form-group md-col-span-2">
                                        <label className="form-label text-xs">Expertise / Service Categories (comma separated)</label>
                                        <input type="text" id="prof-expertise" className="form-control" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-xs">Years of Experience</label>
                                        <input type="number" id="prof-experience" className="form-control" min="0" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-xs">Service Area</label>
                                        <input type="text" id="prof-service-area" className="form-control" />
                                    </div>
                                    <div className="form-group md-col-span-2">
                                        <label className="form-label text-xs">Additional Notes / Qualifications</label>
                                        <textarea id="prof-notes" className="form-control" rows="3"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h2 className="h5 mb-4 border-bottom pb-2">Working Schedule</h2>
                                <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                                    <div className="form-group md-col-span-2">
                                        <label className="form-label text-xs">Working Days (comma separated)</label>
                                        <input type="text" id="prof-days" className="form-control" placeholder="e.g. Monday, Tuesday" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-xs">Working Hours From</label>
                                        <input type="time" id="prof-time-from" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label text-xs">Working Hours Until</label>
                                        <input type="time" id="prof-time-until" className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="btn btn-primary"><i className="fas fa-save mr-1"></i> Save Changes</button>
                            </div>
                        </div>

                        
                        <div className="flex flex-col gap-6">
                            <div className="card p-5 border-danger bg-danger-light">
                                <h3 className="h6 mb-3 uppercase tracking-wider text-xs text-danger border-bottom pb-2 border-danger">Account Status</h3>
                                <div className="mb-4">
                                    <label className="form-label text-xs mb-1">Administrative Status</label>
                                    <div><span className="badge badge-success text-sm" id="prof-account-status">ACTIVE</span></div>
                                    <p className="text-xs text-danger mt-2"><i className="fas fa-info-circle mr-1"></i> Only Admin can change this status.</p>
                                </div>
                            </div>

                            <div className="card p-5">
                                <h3 className="h6 mb-3 uppercase tracking-wider text-xs text-secondary border-bottom pb-2">Availability</h3>
                                <div className="form-group mb-0">
                                    <label className="form-label text-xs">Current Availability</label>
                                    <select className="form-control" id="prof-availability">
                                        <option value="AVAILABLE">Available for Assignment</option>
                                        <option value="UNAVAILABLE">Unavailable / Busy</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        
    

    
    </>
  );
}
