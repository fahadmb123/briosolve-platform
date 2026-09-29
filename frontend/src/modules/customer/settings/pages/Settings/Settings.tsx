import { useTheme } from '../../../../../shared/hooks/useTheme';
import './Settings.css';
import { Link } from 'react-router-dom';



export default function Settings() {
    const {theme,  toggleTheme } = useTheme()

    return (
        <>
        
        <div className="app-content">
                    
                    <div className="mb-6">
                            <h1 className="h2 mb-1">Account & Application Settings</h1>
                            <p className="text-secondary text-sm">
                                Manage theme preferences, security settings, alerts, and data privacy.
                            </p>
                        </div>

                        
                        <div className="flex flex-col gap-6">
                            
                            <div className="card p-6">
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

                            
                            <div className="card p-6">
                                <h2 className="h5 mb-2">Security & Password</h2>
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

                            
                            <div className="card p-6">
                                <h2 className="h5 mb-2">Notification Alerts</h2>
                                <p className="text-xs text-secondary mb-4">Configure which activity generates direct push or email alerts.</p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center py-2 border-bottom">
                                        <div>
                                            <div className="font-semibold text-xs text-text">New Quotation Alerts</div>
                                            <div className="text-xs text-secondary">Get notified instantly when a provider bids on your request</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-bottom">
                                        <div>
                                            <div className="font-semibold text-xs text-text">Booking Milestones & Status Updates</div>
                                            <div className="text-xs text-secondary">Receive alerts when a provider accepts, starts, or completes work</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-bottom">
                                        <div>
                                            <div className="font-semibold text-xs text-text">Direct Messages</div>
                                            <div className="text-xs text-secondary">Notify when a contractor sends a message regarding an active request</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>

                                    <div className="flex justify-between items-center py-2">
                                        <div>
                                            <div className="font-semibold text-xs text-text">Review & Rating Reminders</div>
                                            <div className="text-xs text-secondary">Periodic prompts to rate providers after booking completion</div>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" checked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="card p-6">
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
                                            <input type="checkbox" checked id="toggle-geo-perm" />
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

                            
                            <div className="card p-6">
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

                            
                            <div className="card p-6 border-danger">
                                <h2 className="h5 mb-2 text-danger">Danger Zone</h2>
                                <p className="text-xs text-secondary mb-4">
                                    Permanently close your customer account and cancel all active requests. This action cannot be undone.
                                </p>
                                <button className="btn btn-danger text-xs">
                                    <i className="fas fa-user-slash mr-1"></i> Deactivate Account
                                </button>
                            </div>
                        </div>
                </div>
            
        

        
        

        </>
    );
}
