import React from 'react';

export default function ProviderRegister() {
  return (
    <>
      
    <div className="register-pro-wrapper">
        {/*  Minimal Onboarding Topbar  */}
        <header className="register-pro-header">
            <a href="../../user/home/home.html" className="logo">
                <i className="fas fa-tools text-primary"></i>
                <span>ReverseMarket <small className="text-xs text-primary font-bold ml-1">PRO</small></span>
            </a>
            <div className="flex items-center gap-4">
                <button id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                    <i className="fas fa-sun"></i>
                </button>
                <div className="text-xs text-secondary">
                    Already registered?
                    <a href="../../user/login/login.html" className="font-bold text-primary ml-1">Sign In</a>
                </div>
            </div>
        </header>

        {/*  Main Form Container  */}
        <main className="register-main-container">
            {/*  Intro Banner  */}
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
                {/*  Stepper Progress Bar  */}
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

                {/*  STEP 1: Account Information  */}
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
                        <button type="button" className="btn btn-primary" onClick={() => { /* nextStep(2) */ }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                {/*  STEP 2: Professional Information  */}
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

                    {/*  Service Selection by Category  */}
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

                    {/*  Skills Tags  */}
                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="skills-input">Specific Trade Skills (Comma Separated)</label>
                        <input type="text" id="skills-input" className="form-control" placeholder="e.g. Concealed Leak Detection, R32 Gas Refill, Copper Brazing, CPVC Piping" value="Concealed Leak Detection, R32 Gas Refill, Copper Brazing, CPVC Piping, Pressure Testing" />
                    </div>

                    {/*  Short Professional Bio  */}
                    <div className="form-group mb-0">
                        <label className="form-label" htmlFor="pro-bio">Professional Overview / Pitch to Clients</label>
                        <textarea id="pro-bio" className="form-control" rows="3" placeholder="Tell clients why they should choose your quotation...">Certified HVAC and licensed sanitary technician with 10+ years serving Mumbai residential complexes. Equipped with acoustic leak detectors and precision manifold gauges. Committed to transparent pricing and up to 180-day service warranties.</textarea>
                    </div>
                    
                    <div className="flex justify-between mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => { /* prevStep(1) */ }}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => { /* nextStep(3) */ }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                {/*  STEP 3: Service Area & Coverage  */}
                <div className="form-step-card step-content" id="step-3" style={{ display: 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">3</div>
                        <div>
                            <h2 className="h5 mb-0">Service Location & Travel Radius</h2>
                            <p className="text-xs text-secondary mb-0">Set your operational dispatch base and how far you are willing to travel for customer jobs</p>
                        </div>
                    </div>

                    {/*  Interactive Provider Location & Radius Component  */}
                    <div id="pro-register-location-picker" className="mb-2"></div>

                    {/*  Structured Provider Location Hidden Inputs  */}
                    <input type="hidden" id="pro-address" name="serviceAddress" value="Kodungallur, Thrissur, Kerala, India" />
                    <input type="hidden" id="pro-lat" name="serviceLatitude" value="10.2201" />
                    <input type="hidden" id="pro-lng" name="serviceLongitude" value="76.2002" />
                    <input type="hidden" id="pro-radius" name="serviceRadiusKm" value="20" />
                    
                    <div className="flex justify-between mt-5 pt-4 border-top">
                        <button type="button" className="btn btn-secondary" onClick={() => { /* prevStep(2) */ }}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => { /* nextStep(4) */ }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                {/*  STEP 4: Availability & Working Hours  */}
                <div className="form-step-card step-content" id="step-4" style={{ display: 'none' }}>
                    <div className="step-heading-row">
                        <div className="step-num-pill">4</div>
                        <div>
                            <h2 className="h5 mb-0">Availability & Working Schedule</h2>
                            <p className="text-xs text-secondary mb-0">When can customers book services with you?</p>
                        </div>
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
                            <button type="button" className="btn btn-outline btn-xs" onClick={() => { /* addDateOverride() */ }}>Add Date Override</button>
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
                        <button type="button" className="btn btn-secondary" onClick={() => { /* prevStep(3) */ }}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                        <button type="button" className="btn btn-primary" onClick={() => { /* nextStep(5) */ }}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
                    </div>
                </div>

                {/*  STEP 5: Review & Submit  */}
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

                    {/*  Terms & Submit Button  */}
                    <div className="register-actions-footer bg-transparent p-0 border-0">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-secondary w-full justify-center mb-4">
                            <input type="checkbox" id="accept-terms" required checked className="w-4 h-4 accent-primary" />
                            <span>I accept the ReverseMarket <a href="../../user/terms/terms.html" className="underline text-primary">Provider Service Terms</a></span>
                        </label>

                        <div className="flex gap-3 w-full max-w-md mx-auto">
                            <button type="button" className="btn btn-secondary w-full" onClick={() => { /* prevStep(4) */ }}>
                                <i className="fas fa-arrow-left mr-2"></i> Back
                            </button>
                            <button type="button" className="btn btn-primary w-full" onClick={() => { /* submitRegistration() */ }}>
                                <i className="fas fa-check-circle mr-2"></i> Submit Application
                            </button>
                        </div>

                        <div className="text-xs text-secondary text-center mt-4 w-full">
                            Already have an account?
                            <a href="../../user/login/login.html" className="font-bold text-primary ml-1">Login to Portal</a>
                        </div>
                    </div>
                </div>

            </form>
        </main>
    </div>

    {/*  Main JavaScript  */}
    <script src="../../assets/js/main.js"></script>
    {/*  Leaflet & Location Picker JS  */}
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="../../assets/js/location-picker.js"></script>
    <script>
        // Interactive Category Chips
        document.querySelectorAll('.cat-check-chip input').forEach(input => {
            input.addEventListener('change', function() {
                this.closest('.cat-check-chip').classList.toggle('selected', this.checked);
            });
        });

        // Interactive Day Chips
        document.querySelectorAll('.day-pill-check input').forEach(input => {
            input.addEventListener('change', function() {
                this.closest('.day-pill-check').classList.toggle('active', this.checked);
            });
        });

        // Initialize Provider Location & Radius Picker
        document.addEventListener('DOMContentLoaded', function() {
            new LocationPicker({
                containerId: 'pro-register-location-picker',
                initialLocation: {
                    name: "Kodungallur",
                    city: "Thrissur",
                    state: "Kerala",
                    country: "India",
                    lat: 10.2201,
                    lng: 76.2002,
                    full: "Kodungallur, Thrissur, Kerala, India"
                },
                showRadius: true,
                initialRadiusKm: 20,
                onConfirm: function(data) {
                    document.getElementById('pro-address').value = data.address;
                    document.getElementById('pro-lat').value = data.latitude;
                    document.getElementById('pro-lng').value = data.longitude;
                    document.getElementById('pro-radius').value = data.serviceRadiusKm;
                    alert('Service Base Confirmed:\n' + data.address + '\nCoverage Radius: ' + data.serviceRadiusKm + ' km');
                },
                onChange: function(data) {
                    document.getElementById('pro-address').value = data.address;
                    document.getElementById('pro-lat').value = data.latitude;
                    document.getElementById('pro-lng').value = data.longitude;
                    document.getElementById('pro-radius').value = data.serviceRadiusKm;
                }
            });

            // Init Availability UI
            renderWeeklySchedule();
            renderOverrides();
            document.getElementById('buffer-time-select').value = providerAvail.bufferMinutes;
        });

        // --- AVAILABILITY LOGIC ---

        const defaultSchedule = {
            "Monday": [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }],
            "Tuesday": [{ start: "09:00", end: "13:00" }],
            "Wednesday": [],
            "Thursday": [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }],
            "Friday": [{ start: "09:00", end: "18:00" }],
            "Saturday": [{ start: "10:00", end: "14:00" }],
            "Sunday": []
        };

        let providerAvail = {
            weeklySchedule: defaultSchedule,
            dateOverrides: [],
            bufferMinutes: 30
        };

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        function renderWeeklySchedule() {
            const container = document.getElementById('weekly-schedule-container');
            container.innerHTML = '';
            
            days.forEach(day => {
                const ranges = providerAvail.weeklySchedule[day];
                const isOff = ranges.length === 0;

                const dayDiv = document.createElement('div');
                dayDiv.className = 'flex items-center gap-4 mb-3 pb-3 border-bottom';
                dayDiv.style.borderBottom = '1px solid var(--color-border)';
                
                let rangesHtml = '';
                if (isOff) {
                    rangesHtml = `<div className="flex-1 text-muted text-xs italic">Day Off</div>`;
                } else {
                    let rowsHtml = '';
                    ranges.forEach((r, idx) => {
                        rowsHtml += `
                            <div className="flex items-center gap-2 mb-2">
                                <input type="time" className="form-control text-xs" style={{ width: '110px' }} value="${r.start}" onchange="updateTime('${day}', ${idx}, 'start', this.value)" />
                                <span>to</span>
                                <input type="time" className="form-control text-xs" style={{ width: '110px' }} value="${r.end}" onchange="updateTime('${day}', ${idx}, 'end', this.value)" />
                                <button type="button" className="btn-icon text-danger" onClick={() => { /* removeRange('${day}', ${idx}) */ }}><i className="fas fa-times"></i></button>
                            </div>
                        `;
                    });
                    rangesHtml = `<div className="flex-1">${rowsHtml}</div>`;
                }

                dayDiv.innerHTML = `
                    <div style={{ width: '80px' }}>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" ${!isOff ? 'checked' : ''} onchange="toggleDayOff('${day}', this.checked)" />
                            <span className="font-medium ${isOff ? 'text-muted' : ''}">${day.substring(0,3)}</span>
                        </label>
                    </div>
                    ${rangesHtml}
                    ${!isOff ? `<button type="button" className="btn-icon text-primary" onClick={() => { /* addRange('${day}') */ }}><i className="fas fa-plus"></i></button>` : ''}
                `;
                container.appendChild(dayDiv);
            });
        }

        function toggleDayOff(day, isChecked) {
            if (isChecked) {
                providerAvail.weeklySchedule[day] = [{ start: "09:00", end: "17:00" }];
            } else {
                providerAvail.weeklySchedule[day] = [];
            }
            renderWeeklySchedule();
        }

        function addRange(day) {
            providerAvail.weeklySchedule[day].push({ start: "09:00", end: "17:00" });
            renderWeeklySchedule();
        }

        function removeRange(day, idx) {
            providerAvail.weeklySchedule[day].splice(idx, 1);
            renderWeeklySchedule();
        }

        function updateTime(day, idx, field, val) {
            providerAvail.weeklySchedule[day][idx][field] = val;
        }

        function renderOverrides() {
            const container = document.getElementById('date-overrides-container');
            container.innerHTML = '';
            
            if (providerAvail.dateOverrides.length === 0) {
                container.innerHTML = `<div className="text-xs text-muted mb-2">No overrides set.</div>`;
            }

            providerAvail.dateOverrides.forEach((ov, idx) => {
                const div = document.createElement('div');
                div.className = 'p-3 bg-surface-elevated rounded border border-warning mb-2 flex justify-between items-center';
                
                let detailHtml = '';
                if (ov.status === 'OFF') {
                    detailHtml = `<div className="text-xs text-danger font-bold mt-1">OFF (Holiday)</div>`;
                } else {
                    let rr = ov.ranges.map(r => `${r.start} - ${r.end}`).join(', ');
                    detailHtml = `<div className="text-xs text-primary mt-1">Custom Hours: ${rr}</div>`;
                }

                div.innerHTML = `
                    <div>
                        <div className="font-medium text-text text-sm">${ov.date}</div>
                        ${detailHtml}
                    </div>
                    <button type="button" className="btn-icon text-danger" onClick={() => { /* removeOverride(${idx}) */ }}><i className="fas fa-trash-alt"></i></button>
                `;
                container.appendChild(div);
            });
        }

        function addDateOverride() {
            const dateStr = prompt("Enter date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
            if (!dateStr) return;
            const statusStr = confirm("Mark as completely OFF? (OK = OFF, Cancel = Custom Hours)");
            
            if (statusStr) {
                providerAvail.dateOverrides.push({ date: dateStr, status: 'OFF', ranges: [] });
            } else {
                providerAvail.dateOverrides.push({
                    date: dateStr,
                    status: 'CUSTOM',
                    ranges: [{ start: "10:00", end: "15:00" }]
                });
            }
            renderOverrides();
        }

        function removeOverride(idx) {
            providerAvail.dateOverrides.splice(idx, 1);
            renderOverrides();
        }

        // Stepper Navigation Logic
        function showStep(step) {
            for(let i=1; i<=5; i++) {
                const stepEl = document.getElementById('step-'+i);
                if(stepEl) stepEl.style.display = (i === step) ? 'block' : 'none';
                
                const indicator = document.getElementById('step-'+i+'-indicator');
                if (indicator) {
                    if (i < step) {
                        indicator.className = 'stepper-item completed';
                        indicator.querySelector('.stepper-circle').innerHTML = '<i className="fas fa-check"></i>';
                    } else if (i === step) {
                        indicator.className = 'stepper-item active';
                        indicator.querySelector('.stepper-circle').innerHTML = i;
                    } else {
                        indicator.className = 'stepper-item';
                        indicator.querySelector('.stepper-circle').innerHTML = i;
                    }
                }
            }
            window.scrollTo(0,0);
        }
        function nextStep(step) { showStep(step); }
        function prevStep(step) { showStep(step); }

        function submitRegistration() {
            // Save state
            providerAvail.bufferMinutes = parseInt(document.getElementById('buffer-time-select').value) || 0;
            
            // Get selected granular services
            const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value);
            providerAvail.services = selectedServices;
            
            localStorage.setItem('providerAvailability', JSON.stringify(providerAvail));
            
            // Activate the provider capability conceptually without duplicate user creation
            localStorage.setItem('providerActive', 'true');
            
            // Show success alert and redirect to dashboard with pending state
            alert("Registration Submitted Successfully!\nPlease complete your Profile and KYC verification in settings.");
            window.location.href = '../dashboard/dashboard.html?status=pending_verification';
        }

        document.getElementById('provider-register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration();
        });
    </script>

    </>
  );
}
