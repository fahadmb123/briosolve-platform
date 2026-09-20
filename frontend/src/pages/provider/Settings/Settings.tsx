// @ts-nocheck
import React from 'react';

export default function Settings() {
  return (
    <>
<div className="app-content">
                {/*  Page Title  */}
                <div className="flex justify-between items-end flex-wrap gap-4 mb-5">
                    <div>
                        <h1 className="h2 mb-1">Provider Settings</h1>
                        <p className="text-secondary text-sm mb-0">
                            Configure your account security, working schedule availability, lead notification triggers, and operational privacy.
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div id="save-toast" className="text-success text-sm font-bold mr-3" style={{"display":"none"}}><i className="fas fa-check-circle mr-1"></i> Availability saved</div>
                        <button className="btn btn-primary" onClick={() => {}}>
                            <i className="fas fa-save mr-1"></i> Save Changes
                        </button>
                    </div>
                </div>

                {/*  Settings Grid Layout  */}
                <div id="settings-grid-view">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-user-shield text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Account &amp; Security</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-briefcase text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Business Profile</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-wrench text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Trade Services</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-calendar-alt text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Working Availability</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-bell text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Notification Triggers</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-map-marked-alt text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Service Area &amp; Radius</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-user-lock text-4xl text-primary mb-3"></i>
                            <h3 className="font-bold text-sm">Privacy &amp; Security</h3>
                        </div>
                        <div className="card p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-danger transition-all shadow-sm" onClick={() => {}}>
                            <i className="fas fa-exclamation-triangle text-4xl text-danger mb-3"></i>
                            <h3 className="font-bold text-sm text-danger">Danger Zone</h3>
                        </div>
                    </div>
                </div>

                {/*  Right: Panels Container  */}
                <div id="settings-detail-view" style={{"display":"none"}}>
                    <button className="btn btn-outline btn-sm mb-4" onClick={() => {}}>
                        <i className="fas fa-arrow-left mr-2"></i> Back to Settings Grid
                    </button>
                    {/*  1. Account &amp; Security  */}
                        <div className="settings-card-panel" id="sec-account">
                            <h2 className="h5 mb-4">Account Information &amp; Password</h2>
                            <div className="grid-2 gap-4 mb-4">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="acc-email">Registered Email</label>
                                    <input type="email" id="acc-email" className="form-control" value="arjun.menon@example.com" />
                                </div>
                                <div className="form-group" id="mobile-container">
                                    <label className="form-label mb-2">Mobile Number</label>
                                    <div className="flex items-center justify-between p-3 bg-surface border rounded">
                                        <div className="flex items-center gap-3">
                                            <div className="icon-circle bg-surface-elevated text-secondary w-10 h-10 rounded-full flex items-center justify-center">
                                                <i className="fas fa-phone"></i>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-text mb-1 flex items-center gap-2">
                                                    <span id="verified-number-display">Not added</span>
                                                    <span id="phone-status-badge" className="badge badge-warning text-xs">Not Verified</span>
                                                </div>
                                                <div className="text-xs text-secondary">Used for urgent dispatch alerts</div>
                                            </div>
                                        </div>
                                        <button type="button" id="btn-start-verify" className="btn btn-outline btn-sm" onClick={() => {}}>
                                            Add / Change Number
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <h3 className="h6 mb-3 pt-3 border-top">Change Account Password</h3>
                            <div className="grid-3 gap-4 mb-3">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="curr-pwd">Current Password</label>
                                    <input type="password" id="curr-pwd" className="form-control" placeholder="••••••••" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="new-pwd">New Password</label>
                                    <input type="password" id="new-pwd" className="form-control" placeholder="••••••••" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="conf-new-pwd">Confirm New Password</label>
                                    <input type="password" id="conf-new-pwd" className="form-control" placeholder="••••••••" />
                                </div>
                            </div>
                            <button className="btn btn-secondary text-xs" onClick={() => {}}>
                                Update Password
                            </button>
                        </div>

                        {/*  2. Business Information  */}
                        <div className="settings-card-panel" id="sec-business">
                            <h2 className="h5 mb-4">Business Information</h2>
                            <div className="grid-2 gap-4 mb-4">
                                <div className="form-group">
                                    <label className="form-label">Business / Professional Name</label>
                                    <input type="text" className="form-control" value="Apex Plumbing &amp; HVAC" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Years of Experience</label>
                                    <select className="form-control">
                                        <option>1 - 3 Years</option>
                                        <option>4 - 7 Years</option>
                                        <option selected>8 - 12 Years (Master Tech)</option>
                                        <option>12+ Years (Industry Veteran)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group mb-0">
                                <label className="form-label">Professional Overview / Bio</label>
                                <textarea className="form-control" rows="4">Licensed master technician with a decade of hands-on expertise specializing in multi-storey residential leak diagnostics, concealed sanitary overhaul, high-pressure CPVC piping, and inverter air conditioner servicing.</textarea>
                            </div>
                        </div>

                        {/*  3. Trade Services  */}
                        <div className="settings-card-panel" id="sec-services">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="h5 mb-0">Trade &amp; Services</h2>
                                <button type="button" className="btn btn-outline btn-sm" onClick={() => {}}>
                                    <i className="fas fa-plus mr-1"></i> Add Service Category
                                </button>
                            </div>
                            
                            <div id="display-services-container" className="flex flex-col gap-4">
                                {/*  Populated dynamically by JS  */}
                            </div>
                        </div>

                        {/*  2. Availability &amp; Schedule  */}
                        <div className="settings-card-panel" id="sec-availability">
                            <h2 className="h5 mb-2">Availability &amp; Work Status</h2>
                            <p className="text-xs text-secondary mb-4">Pause lead invitations when you are fully booked or on leave</p>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Accepting New Service Leads</div>
                                    <div className="text-xs text-secondary">Your profile appears in local homeowner search results</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Emergency Callout Dispatch</div>
                                    <div className="text-xs text-secondary">Receive urgent high-priority plumbing leak notices after 8:00 PM</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            {/*  Weekly Schedule UI  */}
                            <div className="mt-4 pt-3 border-top">
                                <h3 className="h6 mb-3">Weekly Working Schedule</h3>
                                <div id="weekly-schedule-container" className="schedule-days-container text-sm">
                                    {/*  Populated dynamically via JS  */}
                                </div>
                            </div>

                            {/*  Specific Date Overrides UI  */}
                            <div className="mt-4 pt-3 border-top">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="h6 mb-0">Specific Date Overrides</h3>
                                    <button className="btn btn-outline btn-xs" onClick={() => {}}>Add Date Override</button>
                                </div>
                                <p className="text-xs text-secondary mb-3">Set custom hours or take a specific day off. This overrides your weekly schedule.</p>
                                
                                <div id="date-overrides-container">
                                    {/*  Populated dynamically via JS  */}
                                </div>
                            </div>
                            
                            {/*  Travel Buffer  */}
                            <div className="mt-4 pt-3 border-top">
                                <div className="form-group mb-0">
                                    <label className="form-label">Travel Buffer Time (Minutes)</label>
                                    <p className="text-xs text-secondary mb-2">Time reserved between jobs to account for travel and delays.</p>
                                    <select id="buffer-time-select" className="form-control text-sm" style={{"width":"150px"}}>
                                        <option value="0">0 mins</option>
                                        <option value="15">15 mins</option>
                                        <option value="30">30 mins</option>
                                        <option value="45">45 mins</option>
                                        <option value="60">60 mins</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/*  3. Notifications Preferences  */}
                        <div className="settings-card-panel" id="sec-notifications">
                            <h2 className="h5 mb-2">Notification Preferences</h2>
                            <p className="text-xs text-secondary mb-4">Choose which marketplace events trigger real-time push alerts</p>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">New Matching Request Alerts</div>
                                    <div className="text-xs text-secondary">Instant alerts when a customer posts a plumbing/AC request within 15 km</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Quotation Acceptance &amp; Updates</div>
                                    <div className="text-xs text-secondary">Notify immediately when a homeowner accepts or views your quotation</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Customer Chat Messages</div>
                                    <div className="text-xs text-secondary">Notify when a client sends an in-app message</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">New Reviews &amp; Ratings</div>
                                    <div className="text-xs text-secondary">Notify when a client writes a review after job completion</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>
                        </div>

                        {/*  4. Service Area &amp; Radius  */}
                        <div className="settings-card-panel" id="sec-service-area">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <h2 className="h5 mb-0">Service Area &amp; Travel Radius</h2>
                                <button type="button" className="btn btn-primary btn-sm" onClick={() => {}}>
                                    <i className="fas fa-map-pin mr-1"></i> Manage Service Area
                                </button>
                            </div>
                            <p className="text-xs text-secondary mb-4">Define your central dispatch location and maximum travel radius for receiving local customer requests.</p>

                            <div className="grid-2 gap-4 mb-4">
                                <div className="p-3 bg-surface-elevated rounded border">
                                    <div className="text-xs text-secondary mb-1">Base Dispatch Location</div>
                                    <div className="font-bold text-sm text-text" id="settings-base-loc">Kodungallur, Thrissur, Kerala</div>
                                    <div className="text-xs text-muted mt-1" id="settings-base-coords">Coordinates: 10.2201° N, 76.2002° E</div>
                                </div>

                                <div className="p-3 bg-surface-elevated rounded border">
                                    <div className="text-xs text-secondary mb-1">Maximum Service Radius</div>
                                    <div className="font-bold text-sm text-primary" id="settings-radius-display">20 km Travel Radius</div>
                                    <div className="text-xs text-muted mt-1">Lead alerts enabled within this perimeter</div>
                                </div>
                            </div>
                        </div>

                        {/*  5. Privacy &amp; Active Sessions  */}
                        <div className="settings-card-panel" id="sec-privacy">
                            <h2 className="h5 mb-4">Privacy &amp; Security Sessions</h2>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Public Portfolio Visibility</div>
                                    <div className="text-xs text-secondary">Display your past job photographs to prospective clients</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <h3 className="h6 mb-2 mt-4 pt-3 border-top">Active Logged-in Devices</h3>
                            <div className="session-device-row">
                                <div>
                                    <strong className="text-text block">Windows Chrome (Current Session)</strong>
                                    <span className="text-xs text-muted">Mumbai, India • Active Now</span>
                                </div>
                                <span className="badge badge-success text-xs">Current</span>
                            </div>
                            <div className="session-device-row">
                                <div>
                                    <strong className="text-text block">Android Mobile App</strong>
                                    <span className="text-xs text-muted">Mumbai, India • Last active 1 hour ago</span>
                                </div>
                                <button className="btn btn-outline btn-xs" onClick={() => {}}>Revoke</button>
                            </div>

                            <div className="mt-3">
                                <button className="btn btn-outline text-xs text-danger" onClick={() => {}}>
                                    <i className="fas fa-sign-out-alt mr-1"></i> Log Out from All Other Devices
                                </button>
                            </div>
                        </div>

                        {/*  5. Danger Zone  */}
                        <div className="settings-card-panel danger-zone-box" id="sec-danger">
                            <h2 className="h5 text-danger mb-1">Danger Zone</h2>
                            <p className="text-xs text-secondary mb-3">
                                Deactivating your provider account will permanently withdraw all active quotations and unlist your verified profile.
                            </p>
                            <button className="btn btn-outline text-xs text-danger" onClick={() => {}}>
                                <i className="fas fa-trash-alt mr-1"></i> Deactivate Provider Account
                            </button>
                        </div>
                    </div> {/*  Close settings-detail-view  */}
                </div>
        
    

    {/*  Provider Service Area Settings Modal  */}
    <div className="loc-modal-overlay" id="settingsLocModal">
        <div className="loc-modal" style={{"maxWidth":"600px"}}>
            <div className="loc-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-map-marked-alt text-primary"></i>
                    <h3 className="h6 mb-0">Configure Service Area &amp; Coverage</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="loc-modal-body">
                <div id="settings-location-picker"></div>
            </div>
            <div className="loc-modal-footer">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => {}}>Cancel</button>
                <button type="button" className="btn btn-primary text-xs" onClick={() => {}}>Save Preferences</button>
            </div>
        </div>
    </div>

    {/*  Mobile Verification Modal  */}
    <div className="loc-modal-overlay" id="mobileOtpModal">
        <div className="loc-modal" style={{"maxWidth":"450px"}}>
            <div className="loc-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-mobile-alt text-primary"></i>
                    <h3 className="h6 mb-0">Verify Mobile Number</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="loc-modal-body p-5">
                <div id="modal-mv-step-1">
                    <p className="text-sm text-secondary mb-4">We will send an OTP to verify this number. This number will be used for urgent dispatch alerts.</p>
                    <div className="input-icon-wrapper mb-4">
                        <i className="fas fa-phone"></i>
                        <input type="tel" id="modal-acc-phone" className="form-control" placeholder="+91 XXXXXXXXXX" value="" />
                    </div>
                    <button type="button" id="modal-btn-send-otp" className="btn btn-primary w-full" onClick={() => {}}>Send OTP</button>
                </div>
                <div id="modal-mv-step-2" style={{"display":"none"}}>
                    <p className="text-sm text-secondary mb-4 text-center">Enter the 6-digit OTP sent to your number.</p>
                    <div className="form-group mb-4">
                        <label className="text-xs font-semibold mb-1 block text-center">OTP Code</label>
                        <input type="text" id="modal-mobile-otp" className="form-control text-center text-xl tracking-[0.5em]" placeholder="------" maxlength="6" />
                    </div>
                    <button type="button" id="modal-btn-verify-otp" className="btn btn-success w-full" onClick={() => {}}>Verify &amp; Save</button>
                    <div className="text-center mt-3">
                        <button type="button" className="btn btn-link text-xs" onClick={() => {}}>Change Number</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/*  Trade &amp; Services Edit Modal  */}
    <div className="loc-modal-overlay" id="servicesEditModal">
        <div className="loc-modal" style={{"maxWidth":"500px"}}>
            <div className="loc-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-wrench text-primary"></i>
                    <h3 className="h6 mb-0">Edit Trade &amp; Services</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="loc-modal-body p-5">
                <div className="form-group mb-4">
                    <label className="form-label font-bold">Service Category</label>
                    <select id="modal-category-select" className="form-control" onchange="renderModalServices()">
                        {/*  Populated dynamically  */}
                    </select>
                </div>
                
                <div className="form-group mb-0">
                    <label className="form-label font-bold">Available Services</label>
                    <div id="modal-services-container" className="bg-surface-elevated border rounded p-3" style={{"maxHeight":"250px","overflowY":"auto"}}>
                        {/*  Checkboxes populated dynamically  */}
                    </div>
                </div>
            </div>
            <div className="loc-modal-footer">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => {}}>Cancel</button>
                <button type="button" className="btn btn-primary text-xs" onClick={() => {}}>Save Changes</button>
            </div>
        </div>
    </div>

    {/*  Main JavaScript  */}
    
    
    {/*  Leaflet &amp; Location Picker JS  */}
    </>
  );
}
