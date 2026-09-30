import { useState } from 'react';
import { useTheme } from '../../../../../shared/hooks/useTheme';
import './Settings.css';
import { Link } from 'react-router-dom';

type SettingsView = 'menu' | 'appearance' | 'contact' | 'security' | 'notifications' | 'location' | 'privacy' | 'danger';

export default function Settings() {
    const { theme, toggleTheme } = useTheme();
    const [activeView, setActiveView] = useState<SettingsView>('menu');

    const renderMenu = () => (
        <div className="settings-glass-grid">
            <div className="settings-glass-card" onClick={() => setActiveView('appearance')}>
                <div className="settings-glass-icon"><i className="fas fa-paint-brush"></i></div>
                <h3 className="settings-glass-title">Theme & Appearance</h3>
                <p className="settings-glass-desc">Choose your preferred visual style across all customer screens.</p>
                <i className="fas fa-chevron-right settings-glass-arrow"></i>
            </div>
            
            <div className="settings-glass-card" onClick={() => setActiveView('contact')}>
                <div className="settings-glass-icon"><i className="fas fa-id-card"></i></div>
                <h3 className="settings-glass-title">Account & Contact</h3>
                <p className="settings-glass-desc">Update your sign-in email and verified mobile number.</p>
                <i className="fas fa-chevron-right settings-glass-arrow"></i>
            </div>

            <div className="settings-glass-card" onClick={() => setActiveView('security')}>
                <div className="settings-glass-icon"><i className="fas fa-shield-alt"></i></div>
                <h3 className="settings-glass-title">Password & Security</h3>
                <p className="settings-glass-desc">Update your sign-in credentials to protect your marketplace account.</p>
                <i className="fas fa-chevron-right settings-glass-arrow"></i>
            </div>

            <div className="settings-glass-card" onClick={() => setActiveView('notifications')}>
                <div className="settings-glass-icon"><i className="fas fa-bell"></i></div>
                <h3 className="settings-glass-title">Notification Alerts</h3>
                <p className="settings-glass-desc">Configure which activity generates direct push or email alerts.</p>
                <i className="fas fa-chevron-right settings-glass-arrow"></i>
            </div>

            <div className="settings-glass-card" onClick={() => setActiveView('location')}>
                <div className="settings-glass-icon"><i className="fas fa-map-marker-alt"></i></div>
                <h3 className="settings-glass-title">Location Preferences</h3>
                <p className="settings-glass-desc">Manage default address auto-fill and browser GPS permission preferences.</p>
                <i className="fas fa-chevron-right settings-glass-arrow"></i>
            </div>

            <div className="settings-glass-card" onClick={() => setActiveView('privacy')}>
                <div className="settings-glass-icon"><i className="fas fa-laptop-house"></i></div>
                <h3 className="settings-glass-title">Privacy & Sessions</h3>
                <p className="settings-glass-desc">Manage connected devices and data visibility.</p>
                <i className="fas fa-chevron-right settings-glass-arrow"></i>
            </div>
            
            <div className="settings-glass-card" onClick={() => setActiveView('danger')} style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                <div className="settings-glass-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}><i className="fas fa-exclamation-triangle"></i></div>
                <h3 className="settings-glass-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
                <p className="settings-glass-desc">Permanently close your customer account and cancel all active requests.</p>
                <i className="fas fa-chevron-right settings-glass-arrow" style={{ color: '#ef4444' }}></i>
            </div>
        </div>
    );

    return (
        <div className="app-content">
            <div className="mb-6">
                <h1 className="h2 mb-1">Account & Application Settings</h1>
                <p className="text-secondary text-sm">
                    Manage theme preferences, security settings, alerts, and data privacy.
                </p>
            </div>

            {activeView !== 'menu' && (
                <div className="settings-header-back" onClick={() => setActiveView('menu')}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Settings Menu</span>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {activeView === 'menu' && renderMenu()}

                {activeView === 'appearance' && (
                    <div className="card p-6 fade-in">
                        <h2 className="h5 mb-2">Theme & Appearance</h2>
                        <p className="text-xs text-secondary mb-4">Choose your preferred visual style across all customer screens.</p>
                        <div className="theme-options-grid">
                            <div className={theme === "dark" ? "theme-card active" : "theme-card "} onClick={toggleTheme}>
                                <div className="theme-preview dark-preview mb-2"></div>
                                <div className="font-semibold text-xs text-text">Dark Mode (Default)</div>
                                <div className="text-xs text-secondary">Optimal contrast for low-light</div>
                            </div>
                            <div className={theme === "light" ? "theme-card active" : "theme-card "} onClick={toggleTheme}>
                                <div className="theme-preview light-preview mb-2"></div>
                                <div className="font-semibold text-xs text-text">Light Mode</div>
                                <div className="text-xs text-secondary">Clean neutral surfaces</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'contact' && (
                    <div className="card p-6 fade-in">
                        <h2 className="h5 mb-4 border-bottom pb-3">Account Credentials & Contact</h2>
                        <p className="text-xs text-secondary mb-4">Update your sign-in email and verified mobile number.</p>
                        <div className="form-row-2 mb-4">
                            <div className="form-group">
                                <label className="form-label text-xs" htmlFor="prof-email">Email Address</label>
                                <div className="input-icon-wrapper">
                                    <i className="fas fa-envelope"></i>
                                    <input type="email" id="prof-email" className="form-control" value="aarav.sharma@example.com" />
                                </div>
                            </div>
                            <div className="form-group" id="mobile-container">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="form-label text-xs mb-0" htmlFor="prof-phone">Mobile Number</label>
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
                        <div className="flex justify-end">
                            <button type="button" className="btn btn-primary btn-sm">Update Contact Details</button>
                        </div>
                    </div>
                )}

                {activeView === 'security' && (
                    <div className="card p-6 fade-in">
                        <h2 className="h5 mb-4 border-bottom pb-3">Password & Security</h2>
                        <p className="text-xs text-secondary mb-4">Update your sign-in credentials to protect your marketplace account.</p>
                        <form action="#" className="flex flex-col gap-4">
                            <div className="form-row-2">
                                <div className="form-group mb-0">
                                    <label className="form-label text-xs" htmlFor="curr-pass">Current Password</label>
                                    <input type="password" id="curr-pass" className="form-control" placeholder="••••••••" />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label text-xs" htmlFor="new-pass">New Password</label>
                                    <input type="password" id="new-pass" className="form-control" placeholder="At least 8 characters" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="btn btn-primary btn-sm">Update Password</button>
                            </div>
                        </form>
                    </div>
                )}

                {activeView === 'notifications' && (
                    <div className="card p-6 fade-in">
                        <h2 className="h5 mb-2">Notification Alerts</h2>
                        <p className="text-xs text-secondary mb-4">Configure which activity generates direct push or email alerts.</p>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center py-2 border-bottom">
                                <div>
                                    <div className="font-semibold text-xs text-text">New Quotation Alerts</div>
                                    <div className="text-xs text-secondary">Get notified instantly when a provider bids on your request</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked readOnly />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="flex justify-between items-center py-2 border-bottom">
                                <div>
                                    <div className="font-semibold text-xs text-text">Booking Milestones & Status Updates</div>
                                    <div className="text-xs text-secondary">Receive alerts when a provider accepts, starts, or completes work</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked readOnly />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="flex justify-between items-center py-2 border-bottom">
                                <div>
                                    <div className="font-semibold text-xs text-text">Direct Messages</div>
                                    <div className="text-xs text-secondary">Notify when a contractor sends a message regarding an active request</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked readOnly />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div>
                                    <div className="font-semibold text-xs text-text">Review & Rating Reminders</div>
                                    <div className="text-xs text-secondary">Periodic prompts to rate providers after booking completion</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked readOnly />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'location' && (
                    <div className="card p-6 fade-in">
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                            <h2 className="h5 mb-0">Location & Privacy Preferences</h2>
                            <Link to="/profile" className="btn btn-outline btn-xs">
                                <i className="fas fa-edit mr-1"></i> Edit Profile Location
                            </Link>
                        </div>
                        <p className="text-xs text-secondary mb-4">Manage default address auto-fill and browser GPS permission preferences.</p>
                        <div className="flex flex-col gap-4">
                            <div className="p-3 bg-surface-elevated rounded border flex justify-between items-center flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                    <i className="fas fa-map-marker-alt text-primary text-lg"></i>
                                    <div>
                                        <div className="font-bold text-xs text-text">Default Home Location</div>
                                        <div className="text-xs text-secondary">Kodungallur, Thrissur, Kerala, India</div>
                                    </div>
                                </div>
                                <span className="badge badge-verified text-xs"><i className="fas fa-check-circle mr-1"></i>Active</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-bottom">
                                <div>
                                    <div className="font-semibold text-xs text-text">Allow Browser Geolocation Detection</div>
                                    <div className="text-xs text-secondary">Enables "Use My Current Location" button in service request creation</div>
                                </div>
                                <label className="toggle-switch">
                                    <input type="checkbox" checked readOnly id="toggle-geo-perm" />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <div>
                                    <div className="font-semibold text-xs text-text">Preferred Proximity Range for Providers</div>
                                    <div className="text-xs text-secondary">Highlight quotations from specialists situated within your city radius</div>
                                </div>
                                <select className="form-control text-xs" style={{ width: 'auto', padding: '0.25rem 0.5rem' }}>
                                    <option value="15">Within 15 km</option>
                                    <option value="25" selected>Within 25 km</option>
                                    <option value="50">Within 50 km</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {activeView === 'privacy' && (
                    <div className="card p-6 fade-in">
                        <h2 className="h5 mb-2">Privacy & Active Sessions</h2>
                        <p className="text-xs text-secondary mb-4">Manage connected devices and data visibility.</p>
                        <div className="p-4 bg-surface-elevated rounded border flex justify-between items-center flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-3">
                                <i className="fas fa-laptop text-primary text-xl"></i>
                                <div>
                                    <div className="font-semibold text-xs text-text">Chrome on Windows 11 (Current Device)</div>
                                    <div className="text-xs text-muted">Mumbai, India • Active right now</div>
                                </div>
                            </div>
                            <span className="badge badge-success text-xs">This Session</span>
                        </div>
                        <button className="btn btn-secondary btn-sm">
                            <i className="fas fa-sign-out-alt mr-1"></i> Log Out of All Other Devices
                        </button>
                    </div>
                )}

                {activeView === 'danger' && (
                    <div className="card p-6 border-danger fade-in">
                        <h2 className="h5 mb-2 text-danger">Danger Zone</h2>
                        <p className="text-xs text-secondary mb-4">
                            Permanently close your customer account and cancel all active requests. This action cannot be undone.
                        </p>
                        <button className="btn btn-danger text-xs">
                            <i className="fas fa-user-slash mr-1"></i> Deactivate Account
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
