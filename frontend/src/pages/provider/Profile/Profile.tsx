// @ts-nocheck
import React from 'react';

export default function Profile() {
  return (
    <>
<div className="app-container">
        {/*  Sidebar Navigation  */}
        <aside className="app-sidebar" id="app-sidebar">
            <div className="sidebar-brand flex justify-between items-center">
                <a href="../dashboard/dashboard.html" className="logo">
                    <i className="fas fa-tools text-primary"></i>
                    <span>ReverseMarket <small className="text-xs text-primary font-bold ml-1">PRO</small></span>
                </a>
                <button id="sidebar-close" className="btn-icon sidebar-close-btn" aria-label="Close Sidebar">
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Provider Workspace</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../dashboard/dashboard.html" className="sidebar-item">
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="../requests/requests.html" className="sidebar-item">
                            <i className="fas fa-search-dollar"></i>
                            <span>Service Requests</span>
                            <span className="badge badge-primary ml-auto">8 New</span>
                        </a>
                    </li>
                    <li>
                        <a href="../quotations/quotations.html" className="sidebar-item">
                            <i className="fas fa-file-invoice-dollar"></i>
                            <span>My Quotations</span>
                            <span className="badge badge-warning ml-auto">4</span>
                        </a>
                    </li>
                    <li>
                        <a href="../bookings/bookings.html" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                            <span className="badge badge-info ml-auto">3</span>
                        </a>
                    </li>
                    <li>
                        <a href="../chat/chat.html" className="sidebar-item">
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                            <span className="badge badge-danger ml-auto">2</span>
                        </a>
                    </li>
                    <li>
                        <a href="../reviews/reviews.html" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </a>
                    </li>
                </ul>

                <div className="menu-label mt-6">Professional Profile</div>
                <ul className="sidebar-menu">
                    <li>
                        <a href="../verification/verification.html" className="sidebar-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>Verification</span>
                            <span className="badge badge-success ml-auto"><i className="fas fa-check"></i></span>
                        </a>
                    </li>
                    <li>
                        <a href="profile.html" className="sidebar-item active">
                            <i className="fas fa-user-tie"></i>
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
                        <a href="../../user/email-verification/email-verification.html?context=switch_role" className="sidebar-item text-primary font-medium" id="customer-mode-switch">
                            <i className="fas fa-exchange-alt"></i>
                            <span>Switch to User</span>
                        </a>
                    </li>
                    <li>
                        <a href="../../user/login/login.html" className="sidebar-item text-danger">
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
                <div className="flex items-center gap-4">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="breadcrumbs-trail text-xs text-secondary">
                        <span className="text-text font-medium">Provider Workspace</span>
                        <i className="fas fa-chevron-right text-muted mx-2"></i>
                        <span>Dashboard</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="badge badge-success text-xs py-1 px-2.5 flex items-center gap-1.5" title="You are receiving live customer requests in Andheri West">
                        <span className="pulse-dot-green"></span>
                        <span>Receiving Leads</span>
                    </span>
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                        <i className="fas fa-sun"></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <a href="profile.html" className="avatar avatar-sm ml-1" title="Arjun Menon (Verified Master Tech)">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&amp;auto=format&amp;fit=crop&amp;q=80" alt="Arjun Menon" />
                    </a>
                </div>
            </header>

            <div className="app-content">
                {/*  1. MODERN PROFILE HERO COVER BANNER  */}
                <div className="profile-hero-card">
                    <div className="profile-cover-banner">
                        <span className="profile-cover-badge">
                            <i className="fas fa-circle text-success" style={{"fontSize":"0.5rem"}}></i>
                            Accepting New Leads • Mumbai Area
                        </span>
                    </div>

                    <div className="profile-header-body">
                        <div className="profile-identity-group">
                            <div className="profile-avatar-wrapper">
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&amp;auto=format&amp;fit=crop&amp;q=80" alt="Arjun Menon" />
                                <div className="profile-verified-badge" title="Government ID &amp; Trade Verified">
                                    <i className="fas fa-check"></i>
                                </div>
                            </div>
                            <div className="profile-meta-details">
                                <div className="profile-title-row">
                                    <h1 className="profile-name">Arjun Menon</h1>
                                    <span className="badge-pro-tier">
                                        <i className="fas fa-shield-alt text-warning"></i> Level 3 Master Pro
                                    </span>
                                    <span className="badge badge-primary text-xs">Apex Plumbing &amp; HVAC</span>
                                </div>
                                <div className="profile-headline">
                                    Master Sanitary Technician &amp; Certified Refrigeration Specialist
                                </div>
                                <div className="profile-quick-stats">
                                    <span className="stat-item text-warning font-bold">
                                        <i className="fas fa-star"></i> 4.92 ★ (186 Reviews)
                                    </span>
                                    <span className="stat-item">
                                        <i className="fas fa-briefcase text-primary"></i> 142 Jobs Completed
                                    </span>
                                    <span className="stat-item">
                                        <i className="fas fa-map-marker-alt text-danger"></i> Andheri West (15 km radius)
                                    </span>
                                    <span className="stat-item text-success">
                                        <i className="fas fa-clock"></i> 8 Min Avg Response
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions-bar">
                            <button className="btn btn-secondary text-xs" onClick={() => {}}>
                                <i className="fas fa-external-link-alt mr-1"></i> Preview as Client
                            </button>
                            <button className="btn btn-primary" onClick={() => {}}>
                                <i className="fas fa-save mr-1"></i> Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/*  2. TWO-COLUMN MAIN CONTENT GRID  */}
                <div className="profile-content-grid">
                    {/*  Left Column: Biography, Credentials, Skills &amp; Portfolio  */}
                    <div>
                        {/*  Card 1: About &amp; Professional Background  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h2 className="profile-card-title">
                                    <i className="fas fa-user-circle text-primary"></i> About &amp; Trade Background
                                </h2>
                                <span className="badge badge-primary text-xs">10+ Years Experience</span>
                            </div>
                            <p className="text-sm text-secondary leading-relaxed mb-0">
                                Licensed master technician with a decade of hands-on expertise specializing in multi-storey residential leak diagnostics, concealed sanitary overhaul, high-pressure CPVC piping, and inverter air conditioner servicing. Equipped with state-of-the-art ultrasonic acoustic leak listening sensors and digital manifold gauges for zero-destruction troubleshooting.
                            </p>

                            {/*  Credentials Micro Grid  */}
                            <div className="credentials-micro-grid">
                                <div className="credential-item">
                                    <div className="credential-icon">
                                        <i className="fas fa-certificate"></i>
                                    </div>
                                    <div className="credential-info">
                                        <h4>ITI Trade Certified</h4>
                                        <p>Govt Sanitary &amp; HVAC</p>
                                    </div>
                                </div>
                                <div className="credential-item">
                                    <div className="credential-icon" style={{"background":"rgba(16, 185, 129, 0.15)","color":"#10B981"}}>
                                        <i className="fas fa-id-card"></i>
                                    </div>
                                    <div className="credential-info">
                                        <h4>Identity Checked</h4>
                                        <p>Aadhaar &amp; Police Cleared</p>
                                    </div>
                                </div>
                                <div className="credential-item">
                                    <div className="credential-icon" style={{"background":"rgba(171, 151, 140, 0.2)","color":"#AB978C"}}>
                                        <i className="fas fa-award"></i>
                                    </div>
                                    <div className="credential-info">
                                        <h4>Top 1% Rated Pro</h4>
                                        <p>Mumbai Metro Region</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Card 2: Specialized Technical Skills  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h2 className="profile-card-title">
                                    <i className="fas fa-wrench text-primary"></i> Specialized Technical Skills
                                </h2>
                                <span className="text-xs text-muted">6 Core Competencies</span>
                            </div>
                            <div className="skills-container">
                                <span className="skill-chip-pro">
                                    <i className="fas fa-search"></i> Concealed Leak Detection
                                </span>
                                <span className="skill-chip-pro">
                                    <i className="fas fa-gas-pump"></i> R32 &amp; R410A Refrigerant Charging
                                </span>
                                <span className="skill-chip-pro">
                                    <i className="fas fa-fire"></i> CPVC / PPR Pipe Heat Welding
                                </span>
                                <span className="skill-chip-pro">
                                    <i className="fas fa-tachometer-alt"></i> Pressure Pump Overhaul
                                </span>
                                <span className="skill-chip-pro">
                                    <i className="fas fa-sliders-h"></i> Thermostatic Valve Balancing
                                </span>
                                <span className="skill-chip-pro">
                                    <i className="fas fa-spray-can"></i> Anti-Bacterial Foam Jet Washing
                                </span>
                            </div>
                        </div>

                        {/*  Card 3: Primary Service Categories  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h2 className="profile-card-title">
                                    <i className="fas fa-layer-group text-primary"></i> Active Service Categories
                                </h2>
                                <a href="../settings/settings.html" className="text-xs text-primary font-medium hover:underline">
                                    Manage Rates <i className="fas fa-arrow-right ml-1"></i>
                                </a>
                            </div>
                            <div className="categories-pro-grid">
                                <div className="category-pro-card">
                                    <div className="category-icon-title">
                                        <div className="category-icon-box">
                                            <i className="fas fa-faucet"></i>
                                        </div>
                                        <div className="category-name">Residential Plumbing</div>
                                    </div>
                                    <div className="category-stats-row">
                                        <span>94 Completed Jobs</span>
                                        <strong className="text-text">From ₹1,200</strong>
                                    </div>
                                </div>
                                <div className="category-pro-card">
                                    <div className="category-icon-title">
                                        <div className="category-icon-box">
                                            <i className="fas fa-snowflake"></i>
                                        </div>
                                        <div className="category-name">AC Repair &amp; Maintenance</div>
                                    </div>
                                    <div className="category-stats-row">
                                        <span>38 Completed Jobs</span>
                                        <strong className="text-text">From ₹1,800</strong>
                                    </div>
                                </div>
                                <div className="category-pro-card">
                                    <div className="category-icon-title">
                                        <div className="category-icon-box">
                                            <i className="fas fa-bolt"></i>
                                        </div>
                                        <div className="category-name">Appliance Electricals</div>
                                    </div>
                                    <div className="category-stats-row">
                                        <span>10 Completed Jobs</span>
                                        <strong className="text-text">From ₹800</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Card 4: Completed Job Portfolio Gallery  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div>
                                    <h2 className="profile-card-title">
                                        <i className="fas fa-camera text-primary"></i> Completed Job Portfolio
                                    </h2>
                                    <p className="text-xs text-secondary mt-1 mb-0">Verified before &amp; after work showcases attached to quotation proposals</p>
                                </div>
                                <button className="btn btn-outline btn-xs" onClick={() => {}}>
                                    <i className="fas fa-plus mr-1"></i> Add Project
                                </button>
                            </div>

                            <div className="portfolio-gallery-grid">
                                {/*  Project 1  */}
                                <div className="portfolio-item-card">
                                    <div className="portfolio-thumb-wrapper">
                                        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&amp;auto=format&amp;fit=crop&amp;q=80" alt="Concealed Pipe Repair" />
                                        <span className="portfolio-badge-overlay">
                                            <i className="fas fa-check mr-1"></i> 90-Day Warranty
                                        </span>
                                    </div>
                                    <div className="portfolio-details">
                                        <div className="portfolio-project-title">Concealed Sink Manifold</div>
                                        <div className="portfolio-project-meta">
                                            <span>Andheri West</span>
                                            <span>Oct 2026</span>
                                        </div>
                                    </div>
                                </div>

                                {/*  Project 2  */}
                                <div className="portfolio-item-card">
                                    <div className="portfolio-thumb-wrapper">
                                        <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&amp;auto=format&amp;fit=crop&amp;q=80" alt="AC Coil Jet Cleaning" />
                                        <span className="portfolio-badge-overlay">
                                            <i className="fas fa-snowflake mr-1"></i> Deep Sanitized
                                        </span>
                                    </div>
                                    <div className="portfolio-details">
                                        <div className="portfolio-project-title">Split AC Foam Jet Wash</div>
                                        <div className="portfolio-project-meta">
                                            <span>Bandra West</span>
                                            <span>Sep 2026</span>
                                        </div>
                                    </div>
                                </div>

                                {/*  Project 3  */}
                                <div className="portfolio-item-card">
                                    <div className="portfolio-thumb-wrapper">
                                        <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&amp;auto=format&amp;fit=crop&amp;q=80" alt="Brass Diverter Assembly" />
                                        <span className="portfolio-badge-overlay">
                                            <i className="fas fa-certificate mr-1"></i> OEM Brass
                                        </span>
                                    </div>
                                    <div className="portfolio-details">
                                        <div className="portfolio-project-title">Brass Diverter Assembly</div>
                                        <div className="portfolio-project-meta">
                                            <span>Juhu</span>
                                            <span>Aug 2026</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Right Column: Performance, Trust &amp; Schedule  */}
                    <div>
                        {/*  Card 1: Platform Reputation &amp; Performance  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h3 className="profile-card-title">
                                    <i className="fas fa-chart-line text-primary"></i> Marketplace Track Record
                                </h3>
                            </div>

                            <div className="score-highlight-hero">
                                <div className="score-number-box">
                                    <span>4.92</span>
                                    <div className="score-stars">
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star"></i>
                                        <i className="fas fa-star-half-alt"></i>
                                    </div>
                                </div>
                                <div className="score-context">
                                    <h4>Master Rating</h4>
                                    <p>Based on 186 verified client ratings in Mumbai</p>
                                </div>
                            </div>

                            <div className="metric-bars-list">
                                <div className="metric-bar-item">
                                    <div className="metric-bar-header">
                                        <span>Job Completion Rate</span>
                                        <strong>99.4%</strong>
                                    </div>
                                    <div className="metric-progress-track">
                                        <div className="metric-progress-fill green" style={{"width":"99.4%"}}></div>
                                    </div>
                                </div>
                                <div className="metric-bar-item">
                                    <div className="metric-bar-header">
                                        <span>On-Time Arrival</span>
                                        <strong>98.2%</strong>
                                    </div>
                                    <div className="metric-progress-track">
                                        <div className="metric-progress-fill" style={{"width":"98.2%"}}></div>
                                    </div>
                                </div>
                                <div className="metric-bar-item">
                                    <div className="metric-bar-header">
                                        <span>5-Star Review Ratio</span>
                                        <strong>88%</strong>
                                    </div>
                                    <div className="metric-progress-track">
                                        <div className="metric-progress-fill" style={{"width":"88%"}}></div>
                                    </div>
                                </div>
                                <div className="metric-bar-item">
                                    <div className="metric-bar-header">
                                        <span>Quote Response Speed</span>
                                        <strong className="text-primary">8 Min Avg</strong>
                                    </div>
                                    <div className="metric-progress-track">
                                        <div className="metric-progress-fill green" style={{"width":"95%"}}></div>
                                    </div>
                                </div>
                            </div>

                            <a href="../reviews/reviews.html" className="btn btn-outline text-xs w-full text-center">
                                <i className="fas fa-comments mr-1"></i> Read All 186 Client Reviews
                            </a>
                        </div>

                        {/*  Card 2: Verification Status &amp; Compliance Badges  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h3 className="profile-card-title">
                                    <i className="fas fa-shield-alt text-success"></i> Verification Badges
                                </h3>
                                <span className="badge badge-success text-xs">All Clear</span>
                            </div>

                            <div className="trust-badges-list">
                                <div className="trust-badge-row">
                                    <div className="trust-badge-left">
                                        <i className="fas fa-check-circle"></i>
                                        <span>Government Aadhaar ID</span>
                                    </div>
                                    <span className="badge badge-success text-xs">Verified</span>
                                </div>
                                <div className="trust-badge-row">
                                    <div className="trust-badge-left">
                                        <i className="fas fa-check-circle"></i>
                                        <span>Sanitary Trade Diploma</span>
                                    </div>
                                    <span className="badge badge-success text-xs">Verified</span>
                                </div>
                                <div className="trust-badge-row">
                                    <div className="trust-badge-left">
                                        <i className="fas fa-check-circle"></i>
                                        <span>HVAC Refrigeration License</span>
                                    </div>
                                    <span className="badge badge-success text-xs">Verified</span>
                                </div>
                            </div>

                            <div className="mt-3 pt-2">
                                <a href="../verification/verification.html" className="btn btn-secondary text-xs w-full text-center">
                                    <i className="fas fa-file-contract mr-1"></i> Manage Document Badges
                                </a>
                            </div>
                        </div>

                        {/*  Card 3: Availability &amp; Service Radius  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h3 className="profile-card-title">
                                    <i className="fas fa-calendar-alt text-primary"></i> Operating Schedule
                                </h3>
                                <span className="badge badge-success text-xs">Active</span>
                            </div>

                            {/*  Weekly Day Pills  */}
                            <div className="weekdays-pill-row">
                                <div className="weekday-pill active" title="Monday (Working)">Mon</div>
                                <div className="weekday-pill active" title="Tuesday (Working)">Tue</div>
                                <div className="weekday-pill active" title="Wednesday (Working)">Wed</div>
                                <div className="weekday-pill active" title="Thursday (Working)">Thu</div>
                                <div className="weekday-pill active" title="Friday (Working)">Fri</div>
                                <div className="weekday-pill active" title="Saturday (Working)">Sat</div>
                                <div className="weekday-pill emergency" title="Sunday (Emergency Callouts)">Sun</div>
                            </div>

                            <div className="schedule-info-row">
                                <span>Standard Hours</span>
                                <strong>09:00 AM – 08:00 PM</strong>
                            </div>
                            <div className="schedule-info-row">
                                <span>Sunday Dispatch</span>
                                <strong className="text-warning">Emergency Jobs Only</strong>
                            </div>

                            <div className="mt-4">
                                <a href="../settings/settings.html" className="btn btn-secondary text-xs w-full text-center">
                                    <i className="fas fa-clock mr-1"></i> Edit Availability Schedule
                                </a>
                            </div>
                        </div>

                        {/*  Card 4: Service Location &amp; Travel Radius  */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <h3 className="profile-card-title">
                                    <i className="fas fa-map-marked-alt text-primary"></i> Service Location &amp; Radius
                                </h3>
                                <span className="badge badge-primary text-xs" id="pro-radius-badge">20 km Radius</span>
                            </div>

                            <div className="flex items-start gap-3 mb-3">
                                <i className="fas fa-map-marker-alt text-primary text-xl mt-1"></i>
                                <div>
                                    <div className="font-bold text-text text-sm" id="pro-profile-loc-name">Kodungallur, Thrissur, Kerala</div>
                                    <div className="text-xs text-secondary mt-1" id="pro-profile-loc-sub">Dispatch Base: 10.2201° N, 76.2002° E</div>
                                </div>
                            </div>

                            {/*  Mini map with radius circle  */}
                            <div className="mini-map-preview" id="pro-profile-mini-map">
                                <div className="mini-map-overlay-badge">
                                    <i className="fas fa-compass text-primary"></i>
                                    <span id="pro-profile-coverage-label">Coverage: 20 km around Kodungallur</span>
                                </div>
                            </div>

                            <div className="schedule-info-row mb-3">
                                <span>Travel Radius</span>
                                <strong id="pro-profile-coverage-text">Within 20 km of base</strong>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <button type="button" className="btn btn-secondary text-xs" onClick={() => {}}>
                                    <i className="fas fa-map-pin mr-1"></i> Update Location
                                </button>
                                <button type="button" className="btn btn-outline text-xs" onClick={() => {}}>
                                    <i className="fas fa-sliders-h mr-1"></i> Update Service Radius
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    {/*  Provider Location &amp; Radius Modal  */}
    <div className="loc-modal-overlay" id="proLocModal">
        <div className="loc-modal" style={{"maxWidth":"600px"}}>
            <div className="loc-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-map-marked-alt text-primary"></i>
                    <h3 className="h6 mb-0">Update Service Location &amp; Travel Radius</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="loc-modal-body">
                <div id="pro-profile-location-picker"></div>
            </div>
            <div className="loc-modal-footer">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => {}}>Cancel</button>
                <button type="button" className="btn btn-primary text-xs" onClick={() => {}}>Save Service Area</button>
            </div>
        </div>
    </div>

    {/*  Main JavaScript  */}
    
    {/*  Leaflet &amp; Location Picker JS  */}
    </>
  );
}
