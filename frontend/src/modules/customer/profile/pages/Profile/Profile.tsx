import './Profile.css';

export default function Profile() {
  return (
    <>
      
    <div className="app-content">
                
                <div className="flex justify-between items-end flex-wrap gap-4 mb-6">
                        <div>
                            <h1 className="h2 mb-1">My Account Profile</h1>
                            <p className="text-secondary text-sm">
                                Manage your personal info, primary service location, and verified contact details.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" className="btn btn-secondary text-xs">
                                <i className="fas fa-edit mr-1"></i> Edit Profile
                            </button>
                        </div>
                    </div>

                    
                    <div className="card p-6 profile-summary-card mb-6">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div className="flex items-center gap-5">
                                <div className="avatar-upload-box">
                                    <div className="avatar avatar-xl">
                                        <img src="https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366F1&color=fff" alt="Aarav Sharma" />
                                    </div>
                                    <button className="avatar-edit-badge" title="Change Photo">
                                        <i className="fas fa-camera"></i>
                                    </button>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="h4 mb-0">Aarav Sharma</h2>
                                        <span className="badge badge-success text-xs"><i className="fas fa-check-circle mr-1"></i> Email Verified</span>
                                    </div>
                                    <div className="text-xs text-secondary mb-2">Customer Member • Joined <strong>January 2025</strong></div>
                                    <div className="flex items-center gap-4 text-xs text-secondary">
                                        <span><i className="fas fa-file-alt text-primary mr-1"></i> <strong>14</strong> Requests Posted</span>
                                        <span><i className="fas fa-calendar-check text-success mr-1"></i> <strong>12</strong> Completed Bookings</span>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary btn-sm">
                                <i className="fas fa-save mr-1"></i> Save Changes
                            </button>
                        </div>
                    </div>

                    
                    <form action="#" className="flex flex-col gap-6">
                        
                        <div className="card p-6">
                            <h3 className="h5 mb-4 border-bottom pb-3">Personal Information</h3>
                            <div className="form-row-2 mb-4">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="prof-fname">First Name</label>
                                    <input type="text" id="prof-fname" className="form-control" value="Aarav" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="prof-lname">Last Name</label>
                                    <input type="text" id="prof-lname" className="form-control" value="Sharma" />
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label" htmlFor="prof-headline">About / Household Notes</label>
                                <textarea id="prof-headline" className="form-control" rows={2} placeholder="Brief note about your preferences or pets for visiting providers...">Homeowner in Lokhandwala, Andheri West. High priority on punctual service and transparent quotations.</textarea>
                            </div>
                        </div>

                        
                        <div className="card p-6">
                            <h3 className="h5 mb-4 border-bottom pb-3">Contact Details</h3>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="prof-email">Email Address</label>
                                    <div className="input-icon-wrapper">
                                        <i className="fas fa-envelope"></i>
                                        <input type="email" id="prof-email" className="form-control" value="aarav.sharma@example.com" />
                                    </div>
                                </div>
                                <div className="form-group" id="mobile-container">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="form-label mb-0" htmlFor="prof-phone">Mobile Number</label>
                                        <span id="phone-status-badge" className="badge badge-warning text-xs">Not Verified</span>
                                    </div>
                                    
                                    <div id="mobile-input-group" style={{ display: 'none' }}>
                                        <div className="input-icon-wrapper mb-3">
                                            <i className="fas fa-phone"></i>
                                            <input type="tel" id="prof-phone" className="form-control" placeholder="+91 XXXXXXXXXX" value="" />
                                        </div>
                                        
                                        <div id="mobile-verify-ui" className="bg-surface p-3 rounded border mb-2">
                                            <div id="mv-step-1">
                                                <p className="text-xs text-secondary mb-2">We will send an OTP to verify this number.</p>
                                                <button type="button" id="btn-send-otp" className="btn btn-primary btn-sm w-full" onClick={() => {  }}>Send OTP</button>
                                            </div>
                                            <div id="mv-step-2" style={{ display: 'none' }}>
                                                <label className="text-xs font-semibold mb-1 block">Enter OTP</label>
                                                <input type="text" id="mobile-otp" className="form-control form-control-sm mb-2" placeholder="e.g. 123456" maxLength={6} />
                                                <button type="button" id="btn-verify-otp" className="btn btn-success btn-sm w-full" onClick={() => {  }}>Verify Mobile</button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="mobile-display-group">
                                        <div className="text-sm font-medium mb-3" id="verified-number-display">None</div>
                                        <button type="button" id="btn-start-verify" className="btn btn-outline btn-sm w-full" onClick={() => {  }}>
                                            Add & Verify Mobile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-3 border-bottom pb-3">
                                <div>
                                    <h3 className="h5 mb-0">Default Location</h3>
                                    <p className="text-xs text-secondary mb-0">Your primary residence address used for convenient auto-fill.</p>
                                </div>
                                <span className="badge badge-verified"><i className="fas fa-home mr-1"></i>Primary Home</span>
                            </div>

                            
                            <div className="p-3 bg-surface-elevated border rounded text-xs text-secondary mb-4 flex items-center gap-2">
                                <i className="fas fa-info-circle text-primary"></i>
                                <span><strong>Note:</strong> Updating this default profile location sets your standard account address. It will not overwrite or alter existing service request locations.</span>
                            </div>

                            <div className="selected-location-box mb-4">
                                <div className="selected-loc-info">
                                    <i className="fas fa-map-marker-alt selected-loc-icon text-primary text-xl"></i>
                                    <div>
                                        <div className="selected-loc-name text-base font-bold" id="profile-loc-name">Kodungallur, Thrissur</div>
                                        <div className="selected-loc-sub text-xs" id="profile-loc-sub">Kerala, India (10.2201° N, 76.2002° E)</div>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-primary btn-sm" onClick={() => {  }}>
                                    <i className="fas fa-edit mr-1"></i> Change Location
                                </button>
                            </div>

                            
                            <div className="mini-map-preview" id="profile-mini-map">
                                <div className="mini-map-overlay-badge">
                                    <i className="fas fa-map-pin text-primary"></i>
                                    <span>Default Home: Kodungallur</span>
                                </div>
                            </div>
                        </div>

                        
                        <div className="flex justify-end items-center gap-3">
                            <button type="button" className="btn btn-secondary">Cancel</button>
                            <button type="submit" className="btn btn-primary btn-lg">
                                <i className="fas fa-check mr-1"></i> Save Changes
                            </button>
                        </div>
                    </form>
            </div>
        
    

    
    <div className="loc-modal-overlay" id="profileLocModal">
        <div className="loc-modal" style={{ maxWidth: '600px' }}>
            <div className="loc-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-home text-primary"></i>
                    <h3 className="h6 mb-0">Update Default Profile Location</h3>
                </div>
                <button className="btn-icon" onClick={() => {  }}><i className="fas fa-times"></i></button>
            </div>
            <div className="loc-modal-body">
                <div id="profile-location-picker"></div>
            </div>
            <div className="loc-modal-footer">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => {  }}>Cancel</button>
                <button type="button" className="btn btn-primary text-xs" onClick={() => {  }}>Save Default Location</button>
            </div>
        </div>
    </div>

    
    
    
    
    
    
    

    </>
  );
}
