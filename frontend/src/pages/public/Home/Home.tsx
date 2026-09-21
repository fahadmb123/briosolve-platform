import { useSidebar } from '../../../hooks/useSidebar';
import './Home.css';


import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';

export default function Home() {
  const { isSidebarOpen, setIsSidebarOpen, handleSidebarToggle } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      
    <div className={`app-container sidebar-modal-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        
        <div id="sidebar-overlay" className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>

        
        <aside className={`app-sidebar ${isSidebarOpen ? 'show' : ''}`} id="app-sidebar">
            <div className="sidebar-brand flex items-center justify-between">
                <Link to="/" className="logo flex items-center gap-2">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </Link>
                <button className="btn-icon ml-auto sidebar-inner-toggle" aria-label="Close Sidebar" title="Close Menu" onClick={handleSidebarToggle}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>

            <div className="sidebar-menu-wrapper">
                <div className="menu-label">Navigation</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-home"></i>
                            <span>Home</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-chart-pie"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/providers" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Nearby Providers</span>
                            <span className="badge badge-primary ml-auto">12+</span>
                        </NavLink>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-file-alt"></i>
                            <span>My Requests</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-calendar-check"></i>
                            <span>Bookings</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-comments"></i>
                            <span>Messages</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-star"></i>
                            <span>Reviews</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-robot"></i>
                            <span>AI Assistant</span>
                            <span className="badge badge-primary ml-auto">AI</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" className="sidebar-item">
                            <i className="fas fa-shopping-bag"></i>
                            <span>Products</span>
                            <span className="badge badge-success ml-auto">New</span>
                        </Link>
                    </li>
                </ul>

                <div className="menu-label mt-6">Preferences</div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/notifications" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-bell"></i>
                            <span>Notifications</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-user-circle"></i>
                            <span>Profile</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
                            <i className="fas fa-cog"></i>
                            <span>Settings</span>
                        </NavLink>
                    </li>
                    <li className="mt-4 pt-2 border-top">
                        <Link to="/login" className="sidebar-item text-danger">
                            <i className="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>

        
        <main className="app-main">
            
            <header className="app-header">
                <div className="flex items-center gap-3">
                    <button id="sidebar-toggle" className="btn-icon mobile-menu-toggle" aria-label="Toggle Sidebar" title="Open Menu" onClick={handleSidebarToggle}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link to="/" className="logo">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/admin/providers" className="nav-item-link hide-mobile">Nearby Providers</Link>
                    <Link to="#" className="nav-item-link hide-mobile">How It Works</Link>
                    <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <div className="notif-dropdown-wrapper">
                        <button id="notif-toggle" className="btn-icon notif-bell-btn" aria-label="Notifications" title="Notifications">
                            <i className="fas fa-bell"></i>
                            <span className="notif-badge-count" id="notif-badge">3</span>
                        </button>
                    </div>
                    <Link to="#" className="btn btn-primary btn-sm">
                        <i className="fas fa-plus mr-1"></i> Post Request
                    </Link>
                    <Link to="/register" className="btn btn-outline btn-sm hide-mobile">
                        Become a Provider
                    </Link>
                    <Link to="//profile" className="avatar avatar-sm ml-1" title="Profile">
                        <img src="https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366F1&color=fff" alt="Aarav" />
                    </Link>
                </div>
            </header>

            <div className="app-content-home">

                
                <header className="hero-split-section">
                    <div className="hero-ambient-glow"></div>
                    <div className="container hero-grid">
                        
                        <div className="hero-left">
                            <div className="hero-pill-badge">
                                <span className="pulse-dot"></span>
                                Reverse Marketplace 2.0 • Zero Client Commission
                            </div>
                            
                            <h1 className="hero-title-modern">
                                Post what you need.<br />
                                Let skilled pros <span className="gradient-text">compete to win</span> your project.
                            </h1>

                            <p className="hero-lead-text">
                                Stop scrolling through cluttered directories or dodging sales calls. Describe your task once, receive custom bids from background-verified local specialists, compare transparently, and hire on your terms.
                            </p>

                            
                            {/*<form action="../create-request/create-request.html" method="GET" className="modern-search-card">
                                <div className="search-inputs-row">
                                    <div className="search-field-wrapper">
                                        <i className="fas fa-search field-icon"></i>
                                        <input type="text" id="service-search-input" name="service" placeholder="What service do you need? (e.g. AC Repair, Plumbing)" className="search-modern-input" required />
                                    </div>
                                    <div className="search-field-location">
                                        <i className="fas fa-map-marker-alt field-icon"></i>
                                        <input type="text" name="location" placeholder="City or Pincode" className="search-modern-input" value="Andheri West, Mumbai" />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-hero-cta">
                                        <span>Get Competing Bids</span>
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </form>

                            
                            <div className="trending-pills-row">
                                <span className="trending-label">Trending:</span>
                                <Link to="javascript:void(0)" className="trending-pill-chip" onClick={() => {  }}>
                                    <i className="fas fa-tools mr-1"></i> Plumbing
                                </Link>
                                <Link to="javascript:void(0)" className="trending-pill-chip" onClick={() => {  }}>
                                    <i className="fas fa-snowflake mr-1"></i> AC Repair
                                </Link>
                                <Link to="javascript:void(0)" className="trending-pill-chip" onClick={() => {  }}>
                                    <i className="fas fa-bolt mr-1"></i> Electrician
                                </Link>
                                <Link to="javascript:void(0)" className="trending-pill-chip" onClick={() => {  }}>
                                    <i className="fas fa-broom mr-1"></i> Deep Clean
                                </Link>
                                <Link to="javascript:void(0)" className="trending-pill-chip" onClick={() => {  }}>
                                    <i className="fas fa-paint-roller mr-1"></i> Painter
                                </Link>
                            </div>

                            
                            <div className="social-proof-cluster">
                                <div className="avatar-stack">
                                    <div className="avatar-stack-item">
                                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Customer" />
                                    </div>
                                    <div className="avatar-stack-item">
                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Customer" />
                                    </div>
                                    <div className="avatar-stack-item">
                                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" alt="Customer" />
                                    </div>
                                    <div className="avatar-stack-item">
                                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" alt="Customer" />
                                    </div>
                                </div>
                                <div className="social-proof-text">
                                    <strong>12,400+ Verified Specialists</strong> ready to bid<br />
                                    <span className="text-secondary"><i className="fas fa-star text-warning"></i> <strong>4.9/5</strong> rating from 48,500+ completed projects</span>
                                </div>
                            </div>*/}
                        </div>

                        
                        <div className="hero-right">
                            <div className="live-bidding-card">
                                
                                <div className="live-card-top">
                                    <div className="flex items-center gap-2">
                                        <span className="live-tag-badge bg-primary-light text-primary">
                                            <i className="fas fa-bolt"></i> Live Marketplace Demo
                                        </span>
                                    </div>
                                    <span className="badge badge-success text-xs flex items-center gap-1">
                                        <span className="pulse-dot-green"></span> 3 Bids Received
                                    </span>
                                </div>

                                
                                <div className="live-req-summary">
                                    <div className="text-xs text-muted mb-1">REQ-84920 • Posted 14m ago by Aarav S.</div>
                                    <div className="live-req-title">Bathroom Plumbing Repair & Pipe Leak Fix</div>
                                    <div className="live-req-meta">
                                        <span><i className="fas fa-wallet text-primary mr-1"></i> Budget: <strong>₹2,500 – ₹3,500</strong></span>
                                        <span><i className="fas fa-clock text-warning mr-1"></i> Needed: <strong>Within 2 Days</strong></span>
                                        <span><i className="fas fa-map-marker-alt text-danger mr-1"></i> <strong>Andheri West</strong></span>
                                    </div>
                                </div>

                                
                                <div className="bids-feed-title">
                                    <span>Verified Providers Competing</span>
                                    <span className="text-primary text-xs" style={{ textTransform: 'none' }}><i className="fas fa-check-circle"></i> Price Bidding Active</span>
                                </div>

                                <div className="bids-feed-list">
                                    
                                    <div className="live-bid-row featured-bid">
                                        <div className="bid-provider-info">
                                            <div className="bid-provider-avatar">
                                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80" alt="Farhan" />
                                            </div>
                                            <div>
                                                <div className="bid-name">
                                                    Farhan Ansari
                                                    <span className="badge badge-primary text-xs py-0 px-1" style={{ fontSize: '0.625rem' }}>
                                                        <i className="fas fa-sparkles"></i> 98% AI Match
                                                    </span>
                                                </div>
                                                <div className="bid-subnote">
                                                    <i className="fas fa-star text-warning"></i> <strong>4.9</strong> (124 reviews) • Apex Plumbing
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bid-pricing">
                                            <div className="bid-amount text-primary">₹2,800</div>
                                            <span className="bid-status-pill">Lowest Quote</span>
                                        </div>
                                    </div>

                                    
                                    <div className="live-bid-row">
                                        <div className="bid-provider-info">
                                            <div className="bid-provider-avatar">
                                                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80" alt="Suresh" />
                                            </div>
                                            <div>
                                                <div className="bid-name">Suresh Kumar</div>
                                                <div className="bid-subnote">
                                                    <i className="fas fa-star text-warning"></i> <strong>4.8</strong> (89 reviews) • 90-Day Warranty
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bid-pricing">
                                            <div className="bid-amount">₹2,950</div>
                                            <span className="text-xs text-muted">Ready Tomorrow</span>
                                        </div>
                                    </div>

                                    
                                    <div className="live-bid-row">
                                        <div className="bid-provider-info">
                                            <div className="bid-provider-avatar">
                                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Rajesh" />
                                            </div>
                                            <div>
                                                <div className="bid-name">Rajesh Patil</div>
                                                <div className="bid-subnote">
                                                    <i className="fas fa-star text-warning"></i> <strong>5.0</strong> (62 reviews) • Master Plumber
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bid-pricing">
                                            <div className="bid-amount">₹3,200</div>
                                            <span className="text-xs text-muted">OEM Parts Guaranteed</span>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="live-card-actions">
                                    <Link to="#" className="btn btn-primary w-full btn-lg">
                                        <i className="fas fa-balance-scale mr-1"></i> Compare Quotations Side-by-Side
                                    </Link>
                                    <div className="flex justify-between items-center text-xs text-secondary mt-2 px-1">
                                        <span><i className="fas fa-shield-alt text-success mr-1"></i> ID Background Checked</span>
                                        <span><i className="fas fa-lock text-primary mr-1"></i> Escrow Milestone Protection</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                
                <section className="bento-section">
                    <div className="container">
                        <div className="section-header-modern">
                            <div>
                                <span className="badge badge-primary mb-2">Service Directory</span>
                                <h2 className="section-title-modern">Popular Marketplace Categories</h2>
                                <p className="text-secondary text-sm mb-0">Post requirements across 120+ specialized home trade and freelance services.</p>
                            </div>
                            <div className="flex gap-2">
                                <Link to="#" className="btn btn-outline">
                                    <span>View All Categories</span>
                                </Link>
                                <Link to="/admin/providers" className="btn btn-secondary">
                                    <span>Find Nearby Providers</span>
                                    <i className="fas fa-arrow-right ml-1"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="bento-grid">
                            
                            <Link to="#" className="bento-card bento-col-8">
                                <div>
                                    <div className="bento-badge">
                                        <i className="fas fa-bolt"></i> High Demand • Avg 1st Bid: 11 Mins
                                    </div>
                                    <div className="bento-icon-box bg-primary-light text-primary">
                                        <i className="fas fa-tools"></i>
                                    </div>
                                    <h3 className="bento-title">Plumbing & Emergency Home Repairs</h3>
                                    <p className="bento-desc">
                                        Leak detections, pipe replacements, bathroom tap fittings, drainage blockages, and water motor installations. Verified master plumbers ready to quote.
                                    </p>
                                    <div className="bento-chips-group">
                                        <span className="bento-chip">Tap & Pipe Leaks</span>
                                        <span className="bento-chip">Toilet Flush Valve</span>
                                        <span className="bento-chip">Water Tank Cleaning</span>
                                        <span className="bento-chip">Drainage Blockage</span>
                                        <span className="bento-chip">Geyser Fitting</span>
                                    </div>
                                </div>
                                <div className="bento-footer">
                                    <span className="bento-stat-highlight">1,240+ Active Plumbers in Mumbai</span>
                                    <span className="bento-arrow-link">View Pricing & Quotes &rarr;</span>
                                </div>
                            </Link>

                            
                            <Link to="#" className="bento-card bento-col-4">
                                <div>
                                    <div className="bento-badge" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0284c7' }}>
                                        <i className="fas fa-snowflake"></i> Climate Specialist
                                    </div>
                                    <div className="bento-icon-box bg-info-light text-info">
                                        <i className="fas fa-wind"></i>
                                    </div>
                                    <h3 className="bento-title">AC Repair & Servicing</h3>
                                    <p className="bento-desc">
                                        Foam jet master servicing, refrigerant gas recharge, PCB diagnosis, and split unit installations.
                                    </p>
                                </div>
                                <div className="bento-footer">
                                    <span className="bento-stat-highlight">1,510 Technicians</span>
                                    <span className="bento-arrow-link">Explore &rarr;</span>
                                </div>
                            </Link>

                            
                            <Link to="#" className="bento-card bento-col-4">
                                <div>
                                    <div className="bento-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}>
                                        <i className="fas fa-shield-virus"></i> Eco Sanitized
                                    </div>
                                    <div className="bento-icon-box bg-success-light text-success">
                                        <i className="fas fa-broom"></i>
                                    </div>
                                    <h3 className="bento-title">Deep Cleaning & Sanitization</h3>
                                    <p className="bento-desc">
                                        Complete apartment deep clean, kitchen degreasing, bathroom descaling, and sofa shampooing.
                                    </p>
                                </div>
                                <div className="bento-footer">
                                    <span className="bento-stat-highlight">2,100 Cleaners</span>
                                    <span className="bento-arrow-link">Explore &rarr;</span>
                                </div>
                            </Link>

                            
                            <Link to="#" className="bento-card bento-col-4">
                                <div>
                                    <div className="bento-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }}>
                                        <i className="fas fa-bolt"></i> Certified Wiremen
                                    </div>
                                    <div className="bento-icon-box bg-warning-light text-warning">
                                        <i className="fas fa-plug"></i>
                                    </div>
                                    <h3 className="bento-title">Electrical & Smart Home</h3>
                                    <p className="bento-desc">
                                        Tripping MCB fixes, switchboard replacements, smart lighting installations, and wiring safety audits.
                                    </p>
                                </div>
                                <div className="bento-footer">
                                    <span className="bento-stat-highlight">980 Electricians</span>
                                    <span className="bento-arrow-link">Explore &rarr;</span>
                                </div>
                            </Link>

                            
                            <Link to="#" className="bento-card bento-col-4">
                                <div>
                                    <div className="bento-badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#9333ea' }}>
                                        <i className="fas fa-laptop-code"></i> Freelance & Tech
                                    </div>
                                    <div className="bento-icon-box" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#9333ea' }}>
                                        <i className="fas fa-palette"></i>
                                    </div>
                                    <h3 className="bento-title">Design & Web Development</h3>
                                    <p className="bento-desc">
                                        Modern responsive websites, UI/UX interfaces, video edits, and branding from vetted freelancers.
                                    </p>
                                </div>
                                <div className="bento-footer">
                                    <span className="bento-stat-highlight">3,450 Specialists</span>
                                    <span className="bento-arrow-link">Explore &rarr;</span>
                                </div>
                            </Link>

                            
                            <div className="bento-card bento-col-12 bento-custom-banner">
                                <div className="flex justify-between items-center flex-wrap gap-4">
                                    <div>
                                        <span className="badge badge-primary mb-2">Don't see your specific need?</span>
                                        <h3 className="bento-title mb-1">Post Any Custom Service Requirement in 2 Minutes</h3>
                                        <p className="bento-desc mb-0">Describe what you need, set your budget limit, and verified providers with the right expertise will bid directly.</p>
                                    </div>
                                    <Link to="#" className="btn btn-primary btn-lg">
                                        <i className="fas fa-plus-circle mr-1"></i> Post Custom Requirement
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="comparison-section-modern">
                    <div className="container">
                        <div className="text-center max-w-2xl mx-auto mb-6">
                            <span className="badge badge-primary mb-2">Why The Reverse Model Wins</span>
                            <h2 className="section-title-modern">Traditional Directories vs. ReverseMarket</h2>
                            <p className="text-secondary text-sm">We flipped the broken hiring model on its head so customers get true market pricing and zero spam.</p>
                        </div>

                        <div className="comparison-matrix-grid">
                            
                            <div className="comparison-card old-way">
                                <div className="comp-header">
                                    <h3 className="h4 mb-0">Traditional Directories</h3>
                                    <span className="comp-badge-old"><i className="fas fa-times-circle mr-1"></i> The Outdated Way</span>
                                </div>
                                <div className="comp-list">
                                    <div className="comp-item">
                                        <i className="fas fa-times-circle text-danger"></i>
                                        <div className="comp-item-text">
                                            <strong>Aggressive Spam & Cold Calls</strong>
                                            <p>Your phone number is shared with dozens of contractors who bombard you with sales pitches.</p>
                                        </div>
                                    </div>
                                    <div className="comp-item">
                                        <i className="fas fa-times-circle text-danger"></i>
                                        <div className="comp-item-text">
                                            <strong>Inflated, Non-Transparent Pricing</strong>
                                            <p>Providers guess high because there's no visible price competition or standardized breakdown.</p>
                                        </div>
                                    </div>
                                    <div className="comp-item">
                                        <i className="fas fa-times-circle text-danger"></i>
                                        <div className="comp-item-text">
                                            <strong>You Do All The Chasing</strong>
                                            <p>You have to browse 20+ profiles, call for quotes, explain your problem repeatedly, and wait days.</p>
                                        </div>
                                    </div>
                                    <div className="comp-item">
                                        <i className="fas fa-times-circle text-danger"></i>
                                        <div className="comp-item-text">
                                            <strong>High Hidden Commission Fees</strong>
                                            <p>Platforms charge providers 20-30% lead commissions, which are silently passed onto you.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            <div className="comparison-card new-way">
                                <div className="comp-header">
                                    <h3 className="h4 mb-0">ReverseMarket Platform</h3>
                                    <span className="comp-badge-new"><i className="fas fa-check-circle mr-1"></i> The Modern Standard</span>
                                </div>
                                <div className="comp-list">
                                    <div className="comp-item">
                                        <i className="fas fa-check-circle text-success"></i>
                                        <div className="comp-item-text">
                                            <strong>100% Zero Spam Calls</strong>
                                            <p>Your contact info stays completely private. All proposals are submitted through clean in-app quotes.</p>
                                        </div>
                                    </div>
                                    <div className="comp-item">
                                        <i className="fas fa-check-circle text-success"></i>
                                        <div className="comp-item-text">
                                            <strong>Providers Compete on Price & Quality</strong>
                                            <p>Because providers know others are bidding, they offer genuine, competitive market pricing to win your job.</p>
                                        </div>
                                    </div>
                                    <div className="comp-item">
                                        <i className="fas fa-check-circle text-success"></i>
                                        <div className="comp-item-text">
                                            <strong>Post Once — Sit Back & Choose</strong>
                                            <p>Spend 90 seconds creating your request. Qualified providers review your exact specs and send tailored proposals.</p>
                                        </div>
                                    </div>
                                    <div className="comp-item">
                                        <i className="fas fa-check-circle text-success"></i>
                                        <div className="comp-item-text">
                                            <strong>Zero Client Commission & Verified IDs</strong>
                                            <p>100% free for homeowners. Every provider undergoes Aadhaar/business verification before bidding.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section id="how-it-works" className="stepper-section">
                    <div className="container">
                        <div className="text-center max-w-2xl mx-auto mb-6">
                            <span className="badge badge-primary mb-2">Seamless Workflow</span>
                            <h2 className="section-title-modern">How ReverseMarket Works</h2>
                            <p className="text-secondary text-sm">Four simple steps from posting your requirement to a successfully completed job.</p>
                        </div>

                        <div className="stepper-grid-modern">
                            
                            <div className="stepper-card-modern">
                                <div className="stepper-step-number">01</div>
                                <div className="stepper-icon-box">
                                    <i className="fas fa-edit"></i>
                                </div>
                                <h3>1. Post Your Need</h3>
                                <p>Describe your issue, attach photos or dimensions, define your estimated budget in ₹, and set your target date.</p>
                            </div>

                            
                            <div className="stepper-card-modern">
                                <div className="stepper-step-number">02</div>
                                <div className="stepper-icon-box">
                                    <i className="fas fa-file-invoice-dollar"></i>
                                </div>
                                <h3>2. Quotes Roll In</h3>
                                <p>Verified local contractors review your project and submit competitive itemized quotations in real-time.</p>
                            </div>

                            
                            <div className="stepper-card-modern">
                                <div className="stepper-step-number">03</div>
                                <div className="stepper-icon-box">
                                    <i className="fas fa-balance-scale"></i>
                                </div>
                                <h3>3. Compare & AI Match</h3>
                                <p>Compare side-by-side: price, past homeowner reviews, completion rates, and AI recommendations to pick the best fit.</p>
                            </div>

                            
                            <div className="stepper-card-modern">
                                <div className="stepper-step-number">04</div>
                                <div className="stepper-icon-box">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <h3>4. Book & Pay Confidently</h3>
                                <p>Accept the winning bid, coordinate via direct chat, and pay securely only when the work is done to your satisfaction.</p>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="audience-section">
                    <div className="container">
                        <div className="audience-switcher-tabs">
                            <button type="button" className="audience-tab-btn active" id="tab-customers-btn" onClick={() => {  }}>
                                <i className="fas fa-user mr-1"></i> For Homeowners & Customers
                            </button>
                            <button type="button" className="audience-tab-btn" id="tab-providers-btn" onClick={() => {  }}>
                                <i className="fas fa-briefcase mr-1"></i> For Independent Service Pros
                            </button>
                        </div>

                        
                        <div className="audience-content-pane active" id="pane-customers">
                            <div className="audience-text">
                                <span className="badge badge-primary mb-2">Customer Advantages</span>
                                <h3>Transparent service hiring built for homeowners</h3>
                                <p className="text-secondary text-sm">
                                    Whether fixing an emergency leak or remodeling a kitchen, our reverse marketplace ensures you get the highest quality workmanship at fair market pricing.
                                </p>

                                <div className="audience-perks-grid">
                                    <div className="perk-item">
                                        <i className="fas fa-coins text-warning"></i>
                                        <strong>Save Average 23%</strong>
                                        <p>Reverse bidding eliminates contractor markups.</p>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-user-check text-success"></i>
                                        <strong>Government ID Verified</strong>
                                        <p>Background checked before placing first bid.</p>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-comment-dots text-primary"></i>
                                        <strong>Direct Encrypted Chat</strong>
                                        <p>Share photos, ask questions, coordinate timing.</p>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-lock text-info"></i>
                                        <strong>Escrow Milestones</strong>
                                        <p>Funds released only on your sign-off.</p>
                                    </div>
                                </div>

                                <Link to="#" className="btn btn-primary btn-lg">
                                    <i className="fas fa-plus-circle mr-1"></i> Post a Request for Free
                                </Link>
                            </div>

                            <div className="audience-visual-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="avatar avatar-md">
                                        <img src="https://ui-avatars.com/api/?name=Pooja+Mehta&background=10B981&color=fff" alt="Pooja" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-text">Pooja Mehta • Bandra West</div>
                                        <div className="text-xs text-secondary">Posted "Full AC Servicing & Gas Top-up"</div>
                                    </div>
                                </div>
                                <blockquote className="text-sm text-secondary italic mb-4" style={{ lineHeight: '1.6' }}>
                                    "Within 25 minutes of posting my AC issue, I had 4 detailed quotes. I chose Farhan based on his 4.9-star rating and clear parts warranty. The whole process was completely stress-free with zero phone spam!"
                                </blockquote>
                                <div className="flex items-center justify-between pt-3 border-top text-xs">
                                    <span className="text-muted">Estimated Market: ₹2,400</span>
                                    <span className="text-success font-bold"><i className="fas fa-check-circle mr-1"></i> Booked for ₹1,850 (Saved 23%)</span>
                                </div>
                            </div>
                        </div>

                        
                        <div className="audience-content-pane" id="pane-providers">
                            <div className="audience-text">
                                <span className="badge badge-warning mb-2">Provider Growth Hub</span>
                                <h3>Grow your business without paying for dead leads</h3>
                                <p className="text-secondary text-sm">
                                    Join thousands of technicians, electricians, painters, and freelancers who get qualified local jobs delivered directly to their dashboard every day.
                                </p>

                                <div className="audience-perks-grid">
                                    <div className="perk-item">
                                        <i className="fas fa-ban text-danger"></i>
                                        <strong>Zero Pay-Per-Lead Fees</strong>
                                        <p>Never pay upfront for customer contacts that don't answer.</p>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-bullseye text-primary"></i>
                                        <strong>High-Intent Clients</strong>
                                        <p>Every post has a verified budget and confirmed timeline.</p>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-trophy text-warning"></i>
                                        <strong>Reputation Compounding</strong>
                                        <p>Build 5-star verified reviews to win premium enterprise jobs.</p>
                                    </div>
                                    <div className="perk-item">
                                        <i className="fas fa-wallet text-success"></i>
                                        <strong>Guaranteed Fast Payouts</strong>
                                        <p>Funds transferred to your bank account upon completion.</p>
                                    </div>
                                </div>

                                <Link to="/register" className="btn btn-primary btn-lg">
                                    <i className="fas fa-id-card mr-1"></i> Register as Verified Provider
                                </Link>
                            </div>

                            <div className="audience-visual-card">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="avatar avatar-md">
                                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80" alt="Farhan" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-text">Farhan Ansari • Apex Plumbing</div>
                                        <div className="text-xs text-secondary">Verified Provider • Joined 8 Months Ago</div>
                                    </div>
                                </div>
                                <div className="stats-counter-grid mb-4" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="p-3 bg-surface rounded border text-center">
                                        <div className="font-bold text-lg text-primary">142</div>
                                        <div className="text-xs text-secondary">Jobs Completed</div>
                                    </div>
                                    <div className="p-3 bg-surface rounded border text-center">
                                        <div className="font-bold text-lg text-success">₹4.2L+</div>
                                        <div className="text-xs text-secondary">Total Earnings</div>
                                    </div>
                                </div>
                                <blockquote className="text-sm text-secondary italic mb-0" style={{ lineHeight: '1.6' }}>
                                    "I used to spend thousands on fake lead platforms. On ReverseMarket, I see the client's actual budget, quote my best rate, and win high-quality residential jobs every week."
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="metrics-section">
                    <div className="container">
                        <div className="metrics-counter-grid">
                            <div>
                                <div className="metric-number text-primary">48,500+</div>
                                <div className="metric-label">Completed Service Jobs</div>
                            </div>
                            <div>
                                <div className="metric-number text-success">12,200+</div>
                                <div className="metric-label">Verified Specialists Active</div>
                            </div>
                            <div>
                                <div className="metric-number text-warning">₹3.8 Cr+</div>
                                <div className="metric-label">Total Customer Savings</div>
                            </div>
                            <div>
                                <div className="metric-number text-info">4.9 / 5.0</div>
                                <div className="metric-label">Average Customer Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </section>

                
                <section className="modern-cta-section">
                    <div className="container">
                        <div className="modern-cta-box">
                            <h2 className="cta-title-modern">Ready to hire the smart, reverse way?</h2>
                            <p className="cta-subtitle-modern">
                                It takes under 90 seconds to publish your requirement. Receive competitive quotations from verified local professionals today with zero obligation.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <Link to="#" className="btn btn-primary btn-lg">
                                    <i className="fas fa-plus-circle mr-1"></i> Post Your Requirement Free
                                </Link>
                                <Link to="/register" className="btn btn-secondary btn-lg">
                                    <i className="fas fa-briefcase mr-1"></i> Join as a Provider
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                
                <footer className="footer-modern">
                    <div className="container">
                        <div className="footer-grid-modern mb-8">
                            <div>
                                <Link to="/" className="logo mb-4" style={{ display: 'inline-flex' }}>
                                    <i className="fas fa-layer-group text-primary"></i>
                                    <span>ReverseMarket</span>
                                </Link>
                                <p className="text-secondary text-sm mb-4" style={{ maxWidth: '320px', lineHeight: '1.6' }}>
                                    The reverse service marketplace that puts you in control. Post requirements, get competitive quotes, compare transparently, and hire verified pros.
                                </p>
                                <div className="flex items-center gap-2">
                                    <Link to="#" className="social-btn" aria-label="Twitter"><i className="fab fa-twitter"></i></Link>
                                    <Link to="#" className="social-btn" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></Link>
                                    <Link to="#" className="social-btn" aria-label="Instagram"><i className="fab fa-instagram"></i></Link>
                                    <Link to="#" className="social-btn" aria-label="Facebook"><i className="fab fa-facebook-f"></i></Link>
                                </div>
                            </div>

                            <div>
                                <h4 className="footer-heading">Top Categories</h4>
                                <div className="footer-links">
                                    <Link to="#">Plumbing Services</Link>
                                    <Link to="#">AC Repair & Gas Refill</Link>
                                    <Link to="#">Electrical Maintenance</Link>
                                    <Link to="#">Home Deep Cleaning</Link>
                                    <Link to="#">Interior Painting</Link>
                                    <Link to="#">Carpentry & Furniture</Link>
                                </div>
                            </div>

                            <div>
                                <h4 className="footer-heading">Customer Portal</h4>
                                <div className="footer-links">
                                    <Link to="/dashboard">Customer Dashboard</Link>
                                    <Link to="#">Post a Requirement</Link>
                                    <Link to="#">Track Active Requests</Link>
                                    <Link to="#">Compare Quotations</Link>
                                    <Link to="#">Manage Bookings</Link>
                                    <Link to="#">AI Assistant</Link>
                                </div>
                            </div>

                            <div>
                                <h4 className="footer-heading">For Providers</h4>
                                <div className="footer-links">
                                    <Link to="/register">Become a Provider</Link>
                                    <Link to="/register">Provider Login</Link>
                                    <Link to="#">Browse Job Requests</Link>
                                    <Link to="#">My Quotation Bids</Link>
                                    <Link to="//dashboard">Payouts & Earnings</Link>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center flex-wrap gap-4 pt-6 border-top text-xs text-secondary">
                            <div>&copy; 2026 ReverseMarket Inc. All rights reserved. Vetted and verified marketplace.</div>
                            <div className="flex items-center gap-4">
                                <Link to="#" className="text-secondary">Privacy Policy</Link>
                                <Link to="#" className="text-secondary">Terms of Service</Link>
                                <Link to="#" className="text-secondary">Trust & Security</Link>
                                <Link to="#" className="text-secondary">Sitemap</Link>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </main>
    </div>

    
    
    
    
    

    </>
  );
}
