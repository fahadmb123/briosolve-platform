import './Notifications.css';

export default function Notifications() {
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
                        <a href="notifications.html" className="sidebar-item active">
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
                        <a href="../settings/settings.html" className="sidebar-item">
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
                {/*  Heading and Actions  */}
                <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                        <div>
                            <h1 className="h2 mb-1">Notifications & Activity Alerts</h1>
                            <p className="text-secondary text-sm">
                                Real-time updates on bids, job milestones, and messages.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="btn btn-secondary text-xs">
                                <i className="fas fa-check-double mr-1"></i> Mark All as Read
                            </button>
                            <a href="../settings/settings.html" className="btn btn-outline text-xs" title="Notification Settings">
                                <i className="fas fa-sliders-h mr-1"></i> Preferences
                            </a>
                        </div>
                    </div>

                    {/*  Notification Groups Container  */}
                    <div className="flex flex-col gap-6">
                        {/*  GROUP 1: TODAY  */}
                        <div className="card p-0 notif-group-card">
                            <div className="group-header p-3 px-4 border-bottom bg-surface-elevated font-semibold text-xs text-secondary uppercase tracking-wider">
                                Today
                            </div>

                            <div className="notif-list">
                                {/*  Notif 1: Quotation (Unread)  */}
                                <div className="notif-item unread flex items-start gap-4 p-4 border-bottom">
                                    <div className="notif-type-icon bg-warning-light text-warning">
                                        <i className="fas fa-file-invoice-dollar"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                New Quotation Received from <a href="../quotation-details/quotation-details.html" className="text-primary">Farhan Ansari</a>
                                            </div>
                                            <span className="text-xs text-muted">20m ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            Apex Plumbing Solutions quoted <strong>₹3,200</strong> for "Bathroom Plumbing Repair & Pipe Leak Fix".
                                        </p>
                                        <div className="flex gap-2">
                                            <a href="../quotation-details/quotation-details.html" className="btn btn-primary btn-xs">View Quotation</a>
                                            <a href="../comparison/comparison.html" className="btn btn-secondary btn-xs">Compare (7)</a>
                                        </div>
                                    </div>
                                    <span className="unread-dot"></span>
                                </div>

                                {/*  Notif 2: Message (Unread)  */}
                                <div className="notif-item unread flex items-start gap-4 p-4 border-bottom">
                                    <div className="notif-type-icon bg-info-light text-info">
                                        <i className="fas fa-comment-dots"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                New Message from <a href="../chat/chat.html" className="text-primary">Farhan Ansari</a>
                                            </div>
                                            <span className="text-xs text-muted">1h ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            "Pressure test is holding up nicely, no drips at all. Running hot and cold water..."
                                        </p>
                                        <a href="../chat/chat.html" className="btn btn-secondary btn-xs">Reply in Chat</a>
                                    </div>
                                    <span className="unread-dot"></span>
                                </div>

                                {/*  Notif 3: Status Milestone  */}
                                <div className="notif-item flex items-start gap-4 p-4">
                                    <div className="notif-type-icon bg-success-light text-success">
                                        <i className="fas fa-wrench"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                Service Started for Booking #BK-8891
                                            </div>
                                            <span className="text-xs text-muted">3h ago</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            Farhan Ansari arrived on premises and marked the job milestone as <strong>In Progress</strong>.
                                        </p>
                                        <a href="../booking-details/booking-details.html" className="btn btn-outline btn-xs">Track Progress</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  GROUP 2: YESTERDAY  */}
                        <div className="card p-0 notif-group-card">
                            <div className="group-header p-3 px-4 border-bottom bg-surface-elevated font-semibold text-xs text-secondary uppercase tracking-wider">
                                Yesterday
                            </div>

                            <div className="notif-list">
                                {/*  Notif 4: Booking Scheduled  */}
                                <div className="notif-item flex items-start gap-4 p-4 border-bottom">
                                    <div className="notif-type-icon bg-primary-light text-primary">
                                        <i className="fas fa-calendar-check"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                Booking Scheduled with Rajesh Patil
                                            </div>
                                            <span className="text-xs text-muted">Yesterday, 6:00 PM</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            "Kitchen Water Purifier Installation" has been locked for Oct 14 at 10:30 AM.
                                        </p>
                                        <a href="../booking-details/booking-details.html" className="btn btn-outline btn-xs">View Schedule</a>
                                    </div>
                                </div>

                                {/*  Notif 5: Review Reminder  */}
                                <div className="notif-item flex items-start gap-4 p-4">
                                    <div className="notif-type-icon bg-warning-light text-warning">
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                How was your AC Servicing experience?
                                            </div>
                                            <span className="text-xs text-muted">Yesterday, 11:30 AM</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-2">
                                            Sunil Verma completed your AC foam jet service. Help the community by leaving a star rating.
                                        </p>
                                        <a href="../reviews/reviews.html" className="btn btn-secondary btn-xs">Leave Review</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  GROUP 3: EARLIER  */}
                        <div className="card p-0 notif-group-card">
                            <div className="group-header p-3 px-4 border-bottom bg-surface-elevated font-semibold text-xs text-secondary uppercase tracking-wider">
                                Earlier this month
                            </div>

                            <div className="notif-list">
                                {/*  Notif 6: System Notification  */}
                                <div className="notif-item flex items-start gap-4 p-4">
                                    <div className="notif-type-icon bg-surface-elevated text-secondary">
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="notif-title text-sm font-semibold text-text">
                                                Security Login Alert
                                            </div>
                                            <span className="text-xs text-muted">Oct 5, 2026</span>
                                        </div>
                                        <p className="text-xs text-secondary mb-0">
                                            Your account was logged in from Chrome on Windows (Mumbai IP: 103.48.xx.xx).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </main>
    </div>

    {/*  Main JavaScript  */}
    

    </>
  );
}
