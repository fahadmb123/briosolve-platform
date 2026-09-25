import './ProviderRegister.css';


import { Link } from 'react-router-dom';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function ProviderRegister() {
  const { toggleTheme } = useTheme();
  return (
    <>
      
    <div className="register-pro-wrapper">
        
        <header className="register-pro-header">
            <Link to="/" className="logo">
                <i className="fas fa-tools text-primary"></i>
                <span>ReverseMarket <small className="text-xs text-primary font-bold ml-1">PRO</small></span>
            </Link>
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                    <i className="fas fa-sun"></i>
                </button>
                <div className="text-xs text-secondary">
                    Already registered?
                    <Link to="/login" className="font-bold text-primary ml-1">Sign In</Link>
                </div>
            </div>
        </header>

        
        <main className="register-main-container">
            
            <div className="onboarding-intro-card">
                <div>
                    <span className="badge badge-primary text-xs mb-2">⚡ Pro Onboarding • Zero Commission</span>
                    <h1 className="h3 mb-1">Create Your Professional Service Account</h1>
                    <p className="text-secondary text-sm mb-0">
                        Compete on merit, browse verified homeowner requests, and win projects directly.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="avatar avatar-sm"><i className="fas fa-shield-alt text-primary text-xl"></i></div>
                    <div className="text-xs text-secondary">
                        <strong className="text-text block">100% Free Registration</strong>
                        Get verified in under 24 hours
                    </div>
                </div>
            </div>

            <form id="provider-register-form" action="../dashboard/dashboard.html" method="GET">
                
                <div className="stepper-wrapper mb-6">
                    <div className="stepper-item active" id="step-1-indicator">
                        <div className="stepper-circle">1</div>
                        <div className="stepper-label text-xs">Basic Info</div>
                    </div>
                    <div className="stepper-item" id="step-2-indicator">
                        <div className="stepper-circle">2</div>
                        <div className="stepper-label text-xs">Services</div>
                    </div>
                    <div className="stepper-item" id="step-3-indicator">
                        <div className="stepper-circle">3</div>
                        <div className="stepper-label text-xs">Location</div>
                    </div>
                    <div className="stepper-item" id="step-4-indicator">
                        <div className="stepper-circle">4</div>
                        <div className="stepper-label text-xs">Schedule</div>
                    </div>
                    <div className="stepper-item" id="step-5-indicator">
                        <div className="stepper-circle">5</div>
                        <div className="stepper-label text-xs">Review</div>
                    </div>
                </div>

                
                <div className="form-step-card step-content active" id="step-1">
                    <div className="step-heading-row">
                        <div className="step-num-pill">1</div>
                        <div>
                            <h2 className="h5 mb-0">Account Information</h2>
                            <p className="text-xs text-secondary mb-0">Your primary login and operational contact credentials</p>
                        </div>
                    </div>

                    <div className="grid-2 gap-4 mb-4">
                        <div className="form-group">
                            <label className="form-label" htmlFor="full-name">Full Name <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-user input-icon"></i>
                                <input type="text" id="full-name" className="form-control" placeholder="e.g. Arjun Menon" required value="Arjun Menon" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Business / Personal Email <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" className="form-control" placeholder="arjun.menon@example.com" required value="arjun.menon@example.com" />
                            </div>
                        </div>
                    </div>

                    <div className="grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" id="password" className="form-control" placeholder="••••••••" required value="SecurePass2026!" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm-password">Confirm Password <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" id="confirm-password" className="form-control" placeholder="••••••••" required value="SecurePass2026!" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label" htmlFor="business-name">Business / Professional Name <span className="text-danger">*</span></label>
                        <div className="input-with-icon">
                            <i className="fas fa-briefcase input-icon"></i>
                            <input type="text" id="business-name" className="form-control" placeholder="e.g. Apex Plumbing Works" required value="Apex Plumbing & HVAC" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-primary" onClick={() => {  }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className="form-step-card step-content" id="step-2" style={{ display: 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">2</div>
                        <div>
                            <h2 className="h5 mb-0">Professional Trade & Experience</h2>
                            <p className="text-xs text-secondary mb-0">Help homeowners find your specialized technical skills</p>
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="experience-years">Years of Professional Experience <span className="text-danger">*</span></label>
                        <select id="experience-years" className="form-control" required style={{ maxWidth: '300px' }}>
                            <option value="1-3">1 - 3 Years</option>
                            <option value="4-7">4 - 7 Years</option>
                            <option value="8-12" selected>8 - 12 Years (Master Tech)</option>
                            <option value="12+">12+ Years (Industry Veteran)</option>
                        </select>
                    </div>

                    
                    <div className="form-group mb-4">
                        <label className="form-label">Select Specific Services You Provide <span className="text-danger">*</span></label>
                        
                        <div className="mb-3">
                            <h3 className="text-sm font-bold mb-2"><i className="fas fa-faucet text-primary mr-1"></i> Plumbing</h3>
                            <div className="category-chips-grid">
                                <label className="cat-check-chip selected">
                                    <input type="checkbox" name="services" value="srv_tap_replace" checked />
                                    <span>Tap Replacement</span>
                                </label>
                                <label className="cat-check-chip">
                                    <input type="checkbox" name="services" value="srv_pipeline_leak" />
                                    <span>Pipeline Leakage</span>
                                </label>
                                <label className="cat-check-chip selected">
                                    <input type="checkbox" name="services" value="srv_faucet_install" checked />
                                    <span>Faucet Installation</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <h3 className="text-sm font-bold mb-2"><i className="fas fa-tv text-primary mr-1"></i> Electronics</h3>
                            <div className="category-chips-grid">
                                <label className="cat-check-chip">
                                    <input type="checkbox" name="services" value="srv_tv_install" />
                                    <span>TV Installation</span>
                                </label>
                                <label className="cat-check-chip">
                                    <input type="checkbox" name="services" value="srv_tv_display" />
                                    <span>TV Display Problem</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    
                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="skills-input">Specific Trade Skills (Comma Separated)</label>
                        <input type="text" id="skills-input" className="form-control" placeholder="e.g. Concealed Leak Detection, R32 Gas Refill, Copper Brazing, CPVC Piping" value="Concealed Leak Detection, R32 Gas Refill, Copper Brazing, CPVC Piping, Pressure Testing" />
                    </div>

                    
                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="pro-bio">Professional Overview / Pitch to Clients</label>
                        <textarea id="pro-bio" className="form-control" rows={3} placeholder="Tell clients why they should choose your quotation...">Certified HVAC and licensed sanitary technician with 10+ years serving Mumbai residential complexes. Equipped with acoustic leak detectors and precision manifold gauges. Committed to transparent pricing and up to 180-day service warranties.</textarea>
                    </div>
                    
                    <div className="flex justify-between mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => {  }}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => {  }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className="form-step-card step-content" id="step-3" style={{ display: 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">3</div>
                        <div>
                            <h2 className="h5 mb-0">Service Location & Travel Radius</h2>
                            <p className="text-xs text-secondary mb-0">Set your operational dispatch base and how far you are willing to travel for customer jobs</p>
                        </div>
                    </div>

                    
                    <div id="pro-register-location-picker" className="mb-2"></div>

                    
                    <input type="hidden" id="pro-address" name="serviceAddress" value="Kodungallur, Thrissur, Kerala, India" />
                    <input type="hidden" id="pro-lat" name="serviceLatitude" value="10.2201" />
                    <input type="hidden" id="pro-lng" name="serviceLongitude" value="76.2002" />
                    <input type="hidden" id="pro-radius" name="serviceRadiusKm" value="20" />
                    
                    <div className="flex justify-between mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => {  }}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => {  }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className="form-step-card step-content" id="step-4" style={{ display: 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">4</div>
                        <div>
                            <h2 className="h5 mb-0">Availability & Working Schedule</h2>
                            <p className="text-xs text-secondary mb-0">When can customers book services with you?</p>
                        </div>
                    </div>

                    
                    <div className="mt-4 pt-3 border-top">
                        <h3 className="h6 mb-3">Weekly Working Schedule</h3>
                        <div id="weekly-schedule-container" className="schedule-days-container text-sm">
                            
                        </div>
                    </div>

                    
                    <div className="mt-4 pt-3 border-top">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="h6 mb-0">Specific Date Overrides</h3>
                            <button type="button" className="btn btn-outline btn-xs" onClick={() => {  }}>Add Date Override</button>
                        </div>
                        <p className="text-xs text-secondary mb-3">Set custom hours or take a specific day off. This overrides your weekly schedule.</p>
                        
                        <div id="date-overrides-container">
                            
                        </div>
                    </div>
                    
                    
                    <div className="mt-4 pt-3 border-top">
                        <div className="form-group mb-0">
                            <label className="form-label">Travel Buffer Time (Minutes)</label>
                            <p className="text-xs text-secondary mb-2">Time reserved between jobs to account for travel and delays.</p>
                            <select id="buffer-time-select" className="form-control text-sm" style={{ width: '150px' }}>
                                <option value="0">0 mins</option>
                                <option value="15">15 mins</option>
                                <option value="30">30 mins</option>
                                <option value="45">45 mins</option>
                                <option value="60">60 mins</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => {  }}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => {  }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className="form-step-card step-content" id="step-5" style={{ display: 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">5</div>
                        <div>
                            <h2 className="h5 mb-0">Review & Submit</h2>
                            <p className="text-xs text-secondary mb-0">Ensure all details are correct before submitting your application.</p>
                        </div>
                    </div>
                    
                    <div className="bg-surface rounded border p-4 mb-4 text-sm">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            <div>
                                <div className="text-xs text-secondary mb-1">Full Name</div>
                                <div className="font-medium">Arjun Menon</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Contact</div>
                                <div className="font-medium">+91 98201 44521 / arjun.menon@example.com</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Selected Services</div>
                                <div className="font-medium">Tap Replacement, Drain Cleaning</div>
                            </div>
                            <div>
                                <div className="text-xs text-secondary mb-1">Service Base Location</div>
                                <div className="font-medium">Kodungallur (20 km radius)</div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-xs text-secondary mb-1">KYC Status</div>
                                <div className="font-medium text-warning"><i className="fas fa-clock mr-1"></i> Will be uploaded after registration in Settings</div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="register-actions-footer bg-transparent p-0 border-0">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-secondary w-full justify-center mb-4">
                            <input type="checkbox" id="accept-terms" required checked className="w-4 h-4 accent-primary" />
                            <span>I accept the ReverseMarket <Link to="#" className="underline text-primary">Provider Service Terms</Link></span>
                        </label>

                        <div className="flex gap-3 w-full max-w-md mx-auto">
                            <button type="button" className="btn btn-secondary w-full" onClick={() => {  }}>
                                <i className="fas fa-arrow-left mr-2"></i> Back
                            </button>
                            <button type="button" className="btn btn-primary w-full" onClick={() => {  }}>
                                <i className="fas fa-check-circle mr-2"></i> Submit Application
                            </button>
                        </div>

                        <div className="text-xs text-secondary text-center mt-4 w-full">
                            Already have an account?
                            <Link to="/login" className="font-bold text-primary ml-1">Login to Portal</Link>
                        </div>
                    </div>
                </div>

            </form>
        </main>
    </div>

    
    
    
    
    
    

    </>
  );
}
