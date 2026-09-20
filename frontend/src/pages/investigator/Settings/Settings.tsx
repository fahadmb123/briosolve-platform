// @ts-nocheck
import React from 'react';

export default function Settings() {
  return (
    <>
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
        
    

    {/*  Main JavaScript  */}
    </>
  );
}
