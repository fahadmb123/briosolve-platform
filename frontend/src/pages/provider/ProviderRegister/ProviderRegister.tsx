import './ProviderRegister.css';


import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function ProviderRegister() {
  const { toggleTheme } = useTheme();
  const [activeStep, setActiveStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
      setIsLocating(true);
      
      if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setTimeout(() => {
                      setIsLocating(false);
                      const input = document.getElementById('location-search-input') as HTMLInputElement;
                      if (input) {
                          input.value = `Current Location (Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)})`;
                      }
                  }, 600);
              },
              (error) => {
                  setIsLocating(false);
                  alert("Could not access your location. Please check browser permissions.");
              }
          );
      } else {
          setIsLocating(false);
          alert("Geolocation is not supported by your browser.");
      }
  };

  const handleChangeLocation = () => {
      const input = document.getElementById('location-search-input') as HTMLInputElement;
      if (input) {
          input.value = '';
          input.focus();
      }
  };

  return (
    <>
      
    <div className="register-pro-wrapper">
        
        <header className="register-pro-header" style={{ position: 'relative' }}>
            <Link to="/" className="logo text-3xl font-black tracking-wide text-text" style={{ fontWeight: 900 }}>
                Provider Registration
            </Link>
            
            <div className="navbar-center hide-mobile" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2rem' }}>
                <Link to="/" className="nav-item-link font-medium hover:text-primary transition-colors">Home</Link>
                <Link to="/register" className="nav-item-link font-medium hover:text-primary transition-colors">Sign Up</Link>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                    <i className="fas fa-sun"></i>
                </button>
            </div>
        </header>

        
        <main className="register-main-container">
            
            <div className="mb-8 text-center">
                <h1 className="h3 mb-2 font-bold">Create Your Professional Account</h1>
                <p className="text-secondary text-sm">Fill in your details below to get started.</p>
            </div>

            <form id="provider-register-form" action="../dashboard/dashboard.html" method="GET">
                
                <div className="stepper-wrapper mb-6">
                    <div className={`stepper-item ${activeStep >= 1 ? 'active' : ''}`} id="step-1-indicator">
                        <div className="stepper-circle">1</div>
                        <div className="stepper-label text-xs">Basic Info</div>
                    </div>
                    <div className={`stepper-item ${activeStep >= 2 ? 'active' : ''}`} id="step-2-indicator">
                        <div className="stepper-circle">2</div>
                        <div className="stepper-label text-xs">Services</div>
                    </div>
                    <div className={`stepper-item ${activeStep >= 3 ? 'active' : ''}`} id="step-3-indicator">
                        <div className="stepper-circle">3</div>
                        <div className="stepper-label text-xs">Location</div>
                    </div>
                    <div className={`stepper-item ${activeStep >= 4 ? 'active' : ''}`} id="step-4-indicator">
                        <div className="stepper-circle">4</div>
                        <div className="stepper-label text-xs">Schedule</div>
                    </div>
                    <div className={`stepper-item ${activeStep >= 5 ? 'active' : ''}`} id="step-5-indicator">
                        <div className="stepper-circle">5</div>
                        <div className="stepper-label text-xs">Review</div>
                    </div>
                </div>

                
                <div className={`form-step-card step-content ${activeStep === 1 ? 'active' : ''}`} id="step-1" style={{ display: activeStep === 1 ? 'block' : 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">1</div>
                        <div>
                            <h2 className="h5 mb-0">Account Information</h2>
                            <p className="text-xs text-secondary mb-0">Your primary login and operational contact credentials</p>
                        </div>
                    </div>

                    <div className="grid-2 gap-4 mb-6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="full-name">Full Name <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-user input-icon"></i>
                                <input type="text" id="full-name" className="form-control" placeholder="e.g. Arjun Menon" required defaultValue="Arjun Menon" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Business / Personal Email <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" className="form-control" placeholder="arjun.menon@example.com" required defaultValue="arjun.menon@example.com" />
                            </div>
                        </div>
                    </div>

                    <div className="grid-2 gap-4">
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" id="password" className="form-control" placeholder="••••••••" required defaultValue="SecurePass2026!" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm-password">Confirm Password <span className="text-danger">*</span></label>
                            <div className="input-with-icon">
                                <i className="fas fa-lock input-icon"></i>
                                <input type="password" id="confirm-password" className="form-control" placeholder="••••••••" required defaultValue="SecurePass2026!" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label className="form-label" htmlFor="business-name">Business / Professional Name <span className="text-danger">*</span></label>
                        <div className="input-with-icon">
                            <i className="fas fa-briefcase input-icon"></i>
                            <input type="text" id="business-name" className="form-control" placeholder="e.g. Apex Plumbing Works" required defaultValue="Apex Plumbing & HVAC" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                        <button type="button" className="btn btn-primary" onClick={() => setActiveStep(prev => prev + 1)}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className={`form-step-card step-content ${activeStep === 2 ? 'active' : ''}`} id="step-2" style={{ display: activeStep === 2 ? 'block' : 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">2</div>
                        <div>
                            <h2 className="h5 mb-0">Professional Trade & Experience</h2>
                            <p className="text-xs text-secondary mb-0">Help homeowners find your specialized technical skills</p>
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="experience-years">Years of Professional Experience <span className="text-danger">*</span></label>
                        <select id="experience-years" className="form-control" required>
                            <option value="1-3">1 - 3 Years</option>
                            <option value="4-7">4 - 7 Years</option>
                            <option value="8-12" selected>8 - 12 Years (Master Tech)</option>
                            <option value="12+">12+ Years (Industry Veteran)</option>
                        </select>
                    </div>

                    
                    <div className="form-group mb-6">
                        <label className="form-label">Select Specific Services You Provide <span className="text-danger">*</span></label>
                        
                        <div className="mb-6">
                            <h3 className="text-sm font-bold mb-4 ml-1"><i className="fas fa-faucet text-primary mr-2"></i> Plumbing</h3>
                            <div className="category-chips-grid">
                                <label className="cat-check-chip">
                                    <input type="checkbox" name="services" value="srv_tap_replace" defaultChecked />
                                    <span>Tap Replacement</span>
                                </label>
                                <label className="cat-check-chip">
                                    <input type="checkbox" name="services" value="srv_pipeline_leak" />
                                    <span>Pipeline Leakage</span>
                                </label>
                                <label className="cat-check-chip">
                                    <input type="checkbox" name="services" value="srv_faucet_install" defaultChecked />
                                    <span>Faucet Installation</span>
                                </label>
                            </div>
                        </div>

                        <div className="mb-2">
                            <h3 className="text-sm font-bold mb-4 ml-1"><i className="fas fa-tv text-primary mr-2"></i> Electronics</h3>
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

                    
                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="skills-input">Specific Trade Skills (Comma Separated)</label>
                        <input type="text" id="skills-input" className="form-control" placeholder="e.g. Concealed Leak Detection, R32 Gas Refill, Copper Brazing, CPVC Piping" defaultValue="Concealed Leak Detection, R32 Gas Refill, Copper Brazing, CPVC Piping, Pressure Testing" />
                    </div>

                    
                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="pro-bio">Professional Overview / Pitch to Clients</label>
                        <textarea id="pro-bio" className="form-control" rows={3} placeholder="Tell clients why they should choose your quotation...">Certified HVAC and licensed sanitary technician with 10+ years serving Mumbai residential complexes. Equipped with acoustic leak detectors and precision manifold gauges. Committed to transparent pricing and up to 180-day service warranties.</textarea>
                    </div>
                    
                    <div className="flex justify-between mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setActiveStep(prev => prev - 1)}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => setActiveStep(prev => prev + 1)}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className={`form-step-card step-content ${activeStep === 3 ? 'active' : ''}`} id="step-3" style={{ display: activeStep === 3 ? 'block' : 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">3</div>
                        <div>
                            <h2 className="h5 mb-0">Service Location & Travel Radius</h2>
                            <p className="text-xs text-secondary mb-0">Set your operational dispatch base and how far you are willing to travel for customer jobs</p>
                        </div>
                    </div>

                    <div className="location-picker-card border rounded-lg p-5 mb-6" style={{ borderColor: 'var(--border)' }}>
                        {/* Search Bar */}
                        <div className="input-with-icon mb-4">
                            <i className="fas fa-search input-icon text-secondary" style={{ left: '1.25rem' }}></i>
                            <input type="text" id="location-search-input" className="form-control" placeholder="Search city, locality, or landmark (e.g. Kodungallur, Thrissur, Kochi...)" style={{ backgroundColor: 'var(--surface-elevated)', border: 'none', paddingLeft: '3rem', borderRadius: 'var(--radius-md)' }} />
                        </div>
                        
                        {/* Current Location & Hint */}
                        <div className="flex justify-between items-center mb-4">
                            <button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={handleUseCurrentLocation}
                                disabled={isLocating}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem', backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
                            >
                                {isLocating ? (
                                    <><i className="fas fa-spinner fa-spin mr-1"></i> Locating...</>
                                ) : (
                                    <><i className="fas fa-crosshairs mr-1"></i> Use My Current Location</>
                                )}
                            </button>
                            <span className="text-xs text-secondary flex items-center">
                                <i className="fas fa-info-circle mr-1"></i> Click map to adjust pin position
                            </span>
                        </div>
                        
                        <hr className="mt-4 mb-4" style={{ borderColor: 'var(--border)', opacity: 0.5 }} />
                        
                        {/* Selected Location Box */}
                        <div className="selected-location-box rounded-lg p-4 flex justify-between items-center mb-4" style={{ backgroundColor: 'var(--surface-elevated)', border: '1px solid var(--border)' }}>
                            <div className="flex items-start gap-3">
                                <i className="fas fa-map-marker-alt text-primary text-xl mt-1"></i>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">Kodungallur, Thrissur</h4>
                                    <p className="text-xs text-secondary mb-0">Kerala, India</p>
                                </div>
                            </div>
                            <div className="flex">
                                <button type="button" className="btn btn-outline" onClick={handleChangeLocation} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem', backgroundColor: 'transparent', border: '1px solid var(--border)' }}>
                                    <i className="fas fa-edit mr-1"></i> Change Location
                                </button>
                                <button type="button" className="btn btn-primary ml-2" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}>
                                    <i className="fas fa-check mr-1"></i> Confirm Location
                                </button>
                            </div>
                        </div>
                        
                        <hr className="mt-4 mb-4" style={{ borderColor: 'var(--border)', opacity: 0.5 }} />
                        
                        {/* Radius Section */}
                        <div className="radius-section mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-medium text-sm text-secondary">Service Coverage Radius</span>
                                <span className="font-bold text-primary">20 km</span>
                            </div>
                            
                            <input type="range" className="custom-range-slider mb-2" min="5" max="50" defaultValue="20" style={{ width: '100%' }} />
                            
                            <div className="flex justify-between text-xs text-secondary mb-4 mt-2">
                                <span>5 km (Local)</span>
                                <span>25 km (Regional)</span>
                                <span>50 km (Metro)</span>
                            </div>
                            
                            <div className="text-xs text-secondary flex items-center">
                                <i className="fas fa-compass mr-2"></i>
                                <span>I provide services within <strong className="text-text font-bold ml-1 mr-1">20 km</strong> of my location.</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setActiveStep(prev => prev - 1)}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => setActiveStep(prev => prev + 1)}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className={`form-step-card step-content ${activeStep === 4 ? 'active' : ''}`} id="step-4" style={{ display: activeStep === 4 ? 'block' : 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">4</div>
                        <div>
                            <h2 className="h5 mb-0">Availability & Working Schedule</h2>
                            <p className="text-xs text-secondary mb-0">When can customers book services with you?</p>
                        </div>
                    </div>

                    
                    <div className="mt-4 border-top" style={{ paddingTop: "1.25rem" }}>
                        <h3 className="h6 mb-4">Weekly Working Schedule</h3>
                        <div className="schedule-days-container text-sm">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
                                <div key={day} className="flex justify-between items-center p-3 mb-2 rounded-lg border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}>
                                    <label className="flex items-center cursor-pointer mb-0" style={{ flex: '1', gap: '0.75rem' }}>
                                        <input type="checkbox" style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }} defaultChecked={true} />
                                        <span className="font-medium text-text">{day}</span>
                                    </label>
                                    <div className="flex items-center justify-end" style={{ flex: '2', gap: '0.5rem' }}>
                                        <input type="time" defaultValue="09:00" className="form-control" style={{ padding: '0.35rem 0.5rem', width: '110px', backgroundColor: 'var(--surface)', fontSize: '0.8125rem' }} />
                                        <span className="text-secondary text-xs font-medium">to</span>
                                        <input type="time" defaultValue="17:00" className="form-control" style={{ padding: '0.35rem 0.5rem', width: '110px', backgroundColor: 'var(--surface)', fontSize: '0.8125rem' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    
                    <div className="mt-4 border-top" style={{ paddingTop: "1.25rem" }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="h6 mb-0">Specific Date Overrides</h3>
                            <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => {  }}>Add Date Override</button>
                        </div>
                        <p className="text-xs text-secondary mb-4">Set custom hours or take a specific day off. This overrides your weekly schedule.</p>
                        
                        <div id="date-overrides-container">
                            <div className="text-center p-5 border rounded-lg" style={{ borderColor: 'var(--border)', borderStyle: 'dashed', backgroundColor: 'transparent' }}>
                                <i className="fas fa-calendar-times text-secondary mb-2 text-xl opacity-50"></i>
                                <p className="text-xs text-secondary mb-0">No overrides added yet. Click "Add Date Override" to set holidays or custom off-days.</p>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="mt-4 border-top" style={{ paddingTop: "1.25rem" }}>
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
                    
                    <div className="flex justify-between mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setActiveStep(prev => prev - 1)}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => setActiveStep(prev => prev + 1)}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                
                <div className={`form-step-card step-content ${activeStep === 5 ? 'active' : ''}`} id="step-5" style={{ display: activeStep === 5 ? 'block' : 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">5</div>
                        <div>
                            <h2 className="h5 mb-0">Review & Submit</h2>
                            <p className="text-xs text-secondary mb-0">Ensure all details are correct before submitting your application.</p>
                        </div>
                    </div>
                    
                    <div className="bg-surface rounded border p-4 mb-4 text-sm" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}>
                        <div className="grid grid-cols-2" style={{ display: 'grid', rowGap: '1.5rem', columnGap: '2rem' }}>
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
                            <input type="checkbox" id="accept-terms" required defaultChecked className="w-4 h-4 accent-primary" />
                            <span>I accept the ReverseMarket <Link to="#" className="underline text-primary">Provider Service Terms</Link></span>
                        </label>

                        <div className="flex gap-3 w-full max-w-md mx-auto">
                            <button type="button" className="btn btn-secondary w-full" onClick={() => setActiveStep(prev => prev - 1)}>
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

        {/* Floating Sign-In Box */}
        <div className="navbar-action-box always-visible" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
            <span className="text-sm font-medium text-text px-1 hide-mobile">Already registered?</span>
            <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
            </Link>
        </div>
    </div>

    
    
    
    
    
    

    </>
  );
}
