import './Settings.css';

export default function Settings() {
  return (
    <>
      
    <div className="app-container">
        {/*  Sidebar Navigation  */}
        <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand">
                <a href="../home/home.html" className="logo">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </a>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar" title="Close Menu">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Navigation</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../home/home.html" className="sidebar-item">
                            <i className="fas fa-home"></i>
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a href="../dashboard/dashboard.html" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="../nearby-providers/nearby-providers.html" className="sidebar-item">
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Nearby Providers</span>
                            <span className="badge badge-primary ml-auto">12+</span>
                        </a>
                    </li>
                    <li>
                        <a href="../requests/requests.html" className="sidebar-item">
                            <i className="fas fa-file-alt"></i>
                            <span>My Requests</span>
                        </a>
                    </li>
                    <li>
                        <a href="../bookings/bookings.html" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                        </a>
                    </li>
                    <li>
                        <a href="../chat/chat.html" className="sidebar-item">
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                        </a>
                    </li>
                    <li>
                        <a href="../reviews/reviews.html" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </a>
                    </li>
                    <li>
                        <a href="../ai-assistant/ai-assistant.html" className="sidebar-item">
                            <i className="fas fa-robot"></i>
                            <span>AI Assistant</span>
                            <span className="badge badge-primary ml-auto">AI</span>
                        </a>
                    </li>
                    <li>
                        <a href="../products/products.html" className="sidebar-item">
                            <i className="fas fa-shopping-bag"></i>
                            <span>Products</span>
                            <span className="badge badge-success ml-auto">New</span>
                        </a>
                    </li>
                </ul>

                <div className="menu-label mt-6">Preferences</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../notifications/notifications.html" className="sidebar-item">
                            <i className="fas fa-bell"></i>
                            <span>Notifications</span>
                        </a>
                    </li>
                    <li>
                        <a href="../profile/profile.html" className="sidebar-item">
                            <i className="fas fa-user-circle"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li>
                        <a href="settings.html" className="sidebar-item active">
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </a>
                    </li>
                    <li className="mt-4 pt-2 border-top">
                        <a href="../login/login.html" className="sidebar-item text-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>

        {/*  Main Content  */}
        <main className="app-main">
            {/*  Topbar Navigation  */}
            <header className="app-header">
                <div className="flex items-center gap-3">
                    <button id="sidebar-toggle" className="btn-icon" aria-label="Toggle Sidebar" title="Open Menu">
                        <i className="fas fa-bars"></i>
                    </button>
                    <a href="../home/home.html" className="logo">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <a href="../nearby-providers/nearby-providers.html" className="nav-item-link hide-mobile">Nearby Providers</a>
                    <a href="#how-it-works" className="nav-item-link hide-mobile">How It Works</a>
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                        <i className="fas fa-sun"></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <a href="../create-request/create-request.html" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus mr-1"></i> Post Request
                    </a>
                    <a href="../../provider/register/register.html" className="btn btn-outline btn-sm hide-mobile">
                        Become a Provider
                    </a>
                    <a href="../profile/profile.html" className="avatar avatar-sm ml-1" title="Profile">
                        <img src="https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366F1&color=fff" alt="Aarav" />
                    </a>
                </div>
            </header>

            <div className="app-content">
                {/*  Title  */}
                <div className="mb-6">
                        <h1 className="h2 mb-1">Account & Application Settings</h1>
                        <p className="text-secondary text-sm">
                            Manage theme preferences, security settings, alerts, and data privacy.
                        </p>
                    </div>

                    {/*  Settings Sections Container  */}
                    <div className="flex flex-col gap-6">
                        {/*  1. Appearance / Theming  */}
                        <div className="card p-6">
                            <h2 className="h5 mb-2">Theme & Appearance</h2>
                            <p className="text-xs text-secondary mb-4">Choose your preferred visual style across all customer screens.</p>
                            
                            <div className="theme-options-grid">
                                <div className="theme-card active" onClick={() => { /* document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'dark'); */ }}>
                                    <div className="theme-preview dark-preview mb-2"></div>
                                    <div className="font-semibold text-xs text-text">Dark Mode (Default)</div>
                                    <div className="text-xs text-secondary">Optimal contrast for low-light</div>
                                </div>

                                <div className="theme-card" onClick={() => { /* document.documentElement.setAttribute('data-theme', 'light'); localStorage.setItem('theme', 'light'); */ }}>
                                    <div className="theme-preview light-preview mb-2"></div>
                                    <div className="font-semibold text-xs text-text">Light Mode</div>
                                    <div className="text-xs text-secondary">Clean neutral surfaces</div>
                                </div>
                            </div>
                        </div>

                        {/*  2. Account Security & Password  */}
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

                        {/*  3. Notification Preferences  */}
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

                        {/*  4. Location Preferences  */}
                        <div className="card p-6">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <h2 className="h5 mb-0">Location & Privacy Preferences</h2>
                                <a href="../profile/profile.html" className="btn btn-outline btn-xs">
                                    <i className="fas fa-edit mr-1"></i> Edit Profile Location
                                </a>
                            </div>
                            <p className="text-xs text-secondary mb-4">Manage default address auto-fill and browser GPS permission preferences.</p>

                            <div className="flex flex-col gap-4">
                                {/*  Default Location Summary  */}
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

                                {/*  Geolocation Permission Toggle  */}
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

                                {/*  Nearby Provider Matching Range  */}
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

                        {/*  5. Privacy & Active Sessions  */}
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

                        {/*  5. Danger Zone  */}
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
        </main>
    </div>

    {/*  Main JavaScript  */}
    

    </>
  );
}
