import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  return (
    <div className="profile-premium-wrapper">
      {/* Top Gradient/Image Banner */}
      <div className="profile-banner"></div>

      <div className="profile-content-grid">
        {/* LEFT SIDEBAR */}
        <div className="flex flex-col gap-6 w-full">
          <div className="profile-card-modern w-full">
            <div className="floating-avatar">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80" alt="Arjun Menon" />
              <button type="button" className="avatar-edit-badge" title="Change Photo">
                <i className="fas fa-camera"></i>
              </button>
            </div>

            <h2 className="h4 mb-1">Arjun Menon</h2>
            <span className="badge badge-warning text-xs mb-3">
              <i className="fas fa-shield-alt mr-1"></i> Level 3 Master Pro
            </span>
            <p className="text-secondary text-xs">Apex Plumbing & HVAC • Joined <strong>Jan 2025</strong></p>

            <div className="profile-stats-modern">
              <div className="stat-box">
                <span className="stat-value">142</span>
                <span className="stat-label"><i className="fas fa-briefcase text-primary mr-1"></i> Jobs</span>
              </div>
              <div className="stat-box">
                <span className="stat-value text-warning">4.92</span>
                <span className="stat-label"><i className="fas fa-star text-warning mr-1"></i> Rating</span>
              </div>
            </div>
          </div>

          {/* Verification Badges Card */}
          <div className="form-card-modern p-5 w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="h6 mb-0">Verification Badges</h3>
              <span className="badge badge-success text-xs">All Clear</span>
            </div>
            
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-success text-lg"></i>
                    <div>
                        <div className="font-bold text-sm text-text">Government Aadhaar ID</div>
                        <div className="text-xs text-secondary">Verified</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-success text-lg"></i>
                    <div>
                        <div className="font-bold text-sm text-text">Sanitary Trade Diploma</div>
                        <div className="text-xs text-secondary">Verified</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-success text-lg"></i>
                    <div>
                        <div className="font-bold text-sm text-text">HVAC Refrigeration License</div>
                        <div className="text-xs text-secondary">Verified</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-success text-lg"></i>
                    <div>
                        <div className="font-bold text-sm text-text">Bank Account</div>
                        <div className="text-xs text-secondary">Verified</div>
                    </div>
                </div>
            </div>
          </div>

          {/* Marketplace Track Record Card */}
          <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="h6 mb-0">Marketplace Track Record</h3>
              </div>
              
              <div className="mb-4">
                  <div className="text-3xl font-black text-warning">4.92</div>
                  <div className="text-warning text-sm mt-1 mb-1">
                      <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                  <div className="font-bold text-text text-sm">Master Rating</div>
                  <p className="text-xs text-secondary mt-1 mb-0">Based on 186 verified client ratings in Mumbai</p>
              </div>

              <div className="flex flex-col gap-3 border-t border-surface-variant pt-4 mb-4">
                  <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-secondary">Job Completion Rate</span>
                      <span className="text-sm font-bold text-success">99.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-secondary">On-Time Arrival</span>
                      <span className="text-sm font-bold text-success">98.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-secondary">5-Star Review Ratio</span>
                      <span className="text-sm font-bold text-warning">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-secondary">Quote Response Speed</span>
                      <span className="text-sm font-bold text-text">8 Min Avg</span>
                  </div>
              </div>

              <button className="btn btn-outline btn-block text-sm">
                  <i className="fas fa-comment-dots mr-2"></i> Read All 186 Reviews
              </button>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="profile-main-content">
          
          {/* About Section */}
          <div className="form-card-modern mb-6">
            <div className="flex justify-between items-center mb-4 pb-4 border-bottom">
              <div>
                  <h3 className="h4 mb-0">About & Trade Background</h3>
                  <span className="badge badge-primary text-xs mt-2">10+ Years Experience</span>
              </div>
              <button className="btn btn-outline btn-sm"><i className="fas fa-edit mr-1"></i> Edit</button>
            </div>
            <p className="text-sm text-secondary leading-relaxed m-0 mt-2">
              Licensed master technician with a decade of hands-on expertise specializing in multi-storey residential leak diagnostics, concealed sanitary overhaul, high-pressure CPVC piping, and inverter air conditioner servicing. Equipped with state-of-the-art ultrasonic acoustic leak listening sensors and digital manifold gauges for zero-destruction troubleshooting.
            </p>

            {/* Credentials Micro Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-4 bg-surface-hover p-4 rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                        <i className="fas fa-certificate"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1 text-text">ITI Trade Certified</h4>
                        <p className="text-xs text-secondary mb-0">Govt Sanitary & HVAC</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-surface-hover p-4 rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center text-xl shrink-0">
                        <i className="fas fa-award"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1 text-text">Top 1% Rated Pro</h4>
                        <p className="text-xs text-secondary mb-0">Mumbai Metro Region</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Specialized Technical Skills */}
          <div className="form-card-modern mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-bottom">
              <div>
                  <h3 className="h4 mb-0">Specialized Technical Skills</h3>
                  <span className="text-xs text-secondary block mt-1">6 Core Competencies</span>
              </div>
              <button className="btn btn-outline btn-sm"><i className="fas fa-plus mr-1"></i> Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline px-3 py-2 text-sm"><i className="fas fa-search text-xs mr-1"></i> Concealed Leak Detection</span>
              <span className="badge badge-outline px-3 py-2 text-sm"><i className="fas fa-gas-pump text-xs mr-1"></i> R32 & R410A Refrigerant</span>
              <span className="badge badge-outline px-3 py-2 text-sm"><i className="fas fa-fire text-xs mr-1"></i> CPVC / PPR Heat Welding</span>
              <span className="badge badge-outline px-3 py-2 text-sm"><i className="fas fa-tachometer-alt text-xs mr-1"></i> Pressure Pump Overhaul</span>
              <span className="badge badge-outline px-3 py-2 text-sm"><i className="fas fa-sliders-h text-xs mr-1"></i> Thermostatic Valve Balancing</span>
              <span className="badge badge-outline px-3 py-2 text-sm"><i className="fas fa-spray-can text-xs mr-1"></i> Anti-Bacterial Jet Washing</span>
            </div>
          </div>

          {/* Active Services Section */}
          <div className="form-card-modern mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-bottom">
              <h3 className="h4 mb-0">Active Service Categories</h3>
              <Link to="/provider/settings" className="btn btn-outline btn-sm">Manage Rates</Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-xl border border-border bg-surface-hover flex justify-between items-center transition-all hover:border-primary">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0"><i className="fas fa-faucet"></i></div>
                    <div className="font-bold text-text">Residential Plumbing</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-secondary mb-1">94 Completed Jobs</div>
                  <div className="font-bold text-text">From ?1,200</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface-hover flex justify-between items-center transition-all hover:border-primary">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0"><i className="fas fa-snowflake"></i></div>
                    <div className="font-bold text-text">AC Repair & Maintenance</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-secondary mb-1">38 Completed Jobs</div>
                  <div className="font-bold text-text">From ?1,800</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface-hover flex justify-between items-center transition-all hover:border-primary">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0"><i className="fas fa-bolt"></i></div>
                    <div className="font-bold text-text">Appliance Electricals</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-secondary mb-1">10 Completed Jobs</div>
                  <div className="font-bold text-text">From ?800</div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Job Portfolio */}
          <div className="form-card-modern mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-bottom">
              <div>
                  <h3 className="h4 mb-0">Completed Job Portfolio</h3>
                  <p className="text-xs text-secondary mt-1 mb-0">Verified before & after work showcases attached to quotation proposals</p>
              </div>
              <button className="btn btn-outline btn-sm"><i className="fas fa-plus mr-1"></i> Add Project</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-border bg-surface relative group cursor-pointer">
                    <div className="h-40 relative">
                        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80" alt="Concealed Pipe Repair" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                            <i className="fas fa-check mr-1"></i> 90-Day Warranty
                        </span>
                    </div>
                    <div className="p-3">
                        <div className="font-bold text-sm text-text mb-1 truncate">Concealed Sink Manifold</div>
                        <div className="flex justify-between text-xs text-secondary">
                            <span>Andheri West</span>
                            <span>Oct 2026</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border bg-surface relative group cursor-pointer">
                    <div className="h-40 relative">
                        <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80" alt="AC Coil Jet Cleaning" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                            <i className="fas fa-snowflake mr-1"></i> Deep Sanitized
                        </span>
                    </div>
                    <div className="p-3">
                        <div className="font-bold text-sm text-text mb-1 truncate">Split AC Foam Jet Wash</div>
                        <div className="flex justify-between text-xs text-secondary">
                            <span>Bandra West</span>
                            <span>Sep 2026</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border bg-surface relative group cursor-pointer">
                    <div className="h-40 relative">
                        <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop&q=80" alt="Brass Diverter Assembly" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                            <i className="fas fa-certificate mr-1"></i> OEM Brass
                        </span>
                    </div>
                    <div className="p-3">
                        <div className="font-bold text-sm text-text mb-1 truncate">Brass Diverter Assembly</div>
                        <div className="flex justify-between text-xs text-secondary">
                            <span>Borivali East</span>
                            <span>Aug 2026</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-border bg-surface relative group cursor-pointer">
                    <div className="h-40 relative">
                        <img src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=600&auto=format&fit=crop&q=80" alt="Copper Coil Wiring" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                            <i className="fas fa-bolt mr-1"></i> Polycab Wire
                        </span>
                    </div>
                    <div className="p-3">
                        <div className="font-bold text-sm text-text mb-1 truncate">Copper Coil Wiring</div>
                        <div className="flex justify-between text-xs text-secondary">
                            <span>Goregaon</span>
                            <span>Jul 2026</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
