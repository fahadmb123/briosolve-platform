// @ts-nocheck
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import './Settings.css';
import { SettingsMenuCard } from '../../components/SettingsMenuCard';
import { ChangePasswordForm } from '../../components/ChangePasswordForm';
import { ContactInfo } from '../../components/ContactInfo';
import { BusinessProfileForm } from '../../components/BusinessProfileForm';
import { TradeServices } from '../../components/TradeServices';
import { SpinnerOverlay } from '../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useAuthStore } from '../../../../../store/auth/auth.store';

const Addresses = lazy(() => import('../../../../customer/settings/pages/Settings/views/Addresses/Addresses').then(m => ({ default: m.Addresses })));

export default function Settings() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [isLocating, setIsLocating] = useState(false);
  const [activeSection, setActiveSection] = useState((location.state as any)?.activeSection || 'grid');

  useEffect(() => {
    if ((location.state as any)?.activeSection) {
      setActiveSection((location.state as any).activeSection);
    }
  }, [location.state]);

  const isContactVerified = Boolean(user?.email_verified && user?.phone_verified);
  const isAddressVerified = Boolean(user?.current_address_id);

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
<div className="app-content">
                
                <div className="flex justify-between items-end flex-wrap gap-4 mb-5">
                    <div>
                        <h1 className="h2 mb-1">Provider Settings</h1>
                        <p className="text-secondary text-sm mb-0">
                            Configure your account security, working schedule availability, lead notification triggers, and operational privacy.
                        </p>
                    </div>
                    <div className="flex items-center">
                        <div id="save-toast" className="text-success text-sm font-bold mr-3" style={{"display":"none"}}><i className="fas fa-check-circle mr-1"></i> Availability saved</div>
                        <button className="btn btn-primary" onClick={() => {}}>
                            <i className="fas fa-save mr-1"></i> Save Changes
                        </button>
                    </div>
                </div>

                
                {activeSection === 'grid' && (
                <div id="settings-grid-view">
                    <div className="settings-glass-grid mb-6">
                        <SettingsMenuCard
                            icon="fas fa-user-shield"
                            title="Account & Security"
                            description="Configure your sign-in credentials and two-factor auth."
                            onClick={() => setActiveSection('account')}
                            badge={isContactVerified ? { text: 'Verified', type: 'success' } : { text: 'Action Required', type: 'warning' }}
                        />
                        <SettingsMenuCard
                            icon="fas fa-briefcase"
                            title="Business Profile"
                            description="Update your business name, bio, and years of experience."
                            onClick={() => setActiveSection('business')}
                        />
                        <SettingsMenuCard
                            icon="fas fa-wrench"
                            title="Trade Services"
                            description="Manage the service categories you specialize in."
                            onClick={() => setActiveSection('services')}
                        />
                        <SettingsMenuCard
                            icon="fas fa-calendar-alt"
                            title="Working Availability"
                            description="Configure your daily business hours and specific days off."
                            onClick={() => setActiveSection('availability')}
                        />
                        <SettingsMenuCard
                            icon="fas fa-bell"
                            title="Notification Triggers"
                            description="Choose which marketplace events send you push alerts."
                            onClick={() => setActiveSection('notifications')}
                        />
                        <SettingsMenuCard
                            icon="fas fa-map-marked-alt"
                            title="Service Area & Radius"
                            description="Define your operating radius to only receive local jobs."
                            onClick={() => setActiveSection('service-area')}
                        />
                        <SettingsMenuCard
                            icon="fas fa-user-lock"
                            title="Privacy & Sessions"
                            description="Manage logged-in devices and public portfolio visibility."
                            onClick={() => setActiveSection('privacy')}
                        />
                        <SettingsMenuCard
                            icon="fas fa-map-pin"
                            title="Manage Addresses"
                            description="Save your business addresses for accurate local search matching."
                            onClick={() => setActiveSection('addresses')}
                            badge={isAddressVerified ? { text: 'Verified', type: 'success' } : { text: 'Action Required', type: 'warning' }}
                        />
                        <SettingsMenuCard
                            icon="fas fa-exclamation-triangle"
                            title="Danger Zone"
                            description="Deactivate your account and remove your active profile."
                            onClick={() => setActiveSection('danger')}
                            danger={true}
                        />
                    </div>
                </div>
                )}

                
                {activeSection !== 'grid' && (
                <div id="settings-detail-view">
                    <div className="settings-header-back" onClick={() => setActiveSection('grid')}>
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Settings Menu</span>
                    </div>
                    
                        {activeSection === 'account' && (
                        <div className="settings-card-panel" id="sec-account">
                            <div className="mb-5 flex justify-between items-center">
                                <div>
                                    <h2 className="h5 mb-1">Account &amp; Security</h2>
                                    <p className="text-xs text-secondary">Manage your verified contact info, mobile alerts, and sign-in credentials.</p>
                                </div>
                                <span className={`badge badge-${isContactVerified ? 'success' : 'warning'} text-xs font-semibold px-2.5 py-1`}>
                                    {isContactVerified ? 'Verified' : 'Action Required'}
                                </span>
                            </div>

                            {/* Email and Mobile in two separate cards/tables */}
                            <ContactInfo />

                            {/* Password in two separate cards/tables */}
                            <div className="pt-4 border-top">
                                <h3 className="h6 mb-4 font-bold">Change Account Password</h3>
                                <ChangePasswordForm />
                            </div>
                        </div>
                        )}

                        
                        {activeSection === 'business' && (
                        <div className="settings-card-panel" id="sec-business">
                            <div className="mb-5">
                                <h2 className="h5 mb-1">Business Profile</h2>
                                <p className="text-xs text-secondary">Manage your public business identity, trade credentials, and client pitch.</p>
                            </div>
                            <BusinessProfileForm />
                        </div>
                        )}

                        
                        {activeSection === 'services' && (
                        <div className="settings-card-panel" id="sec-services">
                            <div className="mb-5">
                                <h2 className="h5 mb-1">Trade &amp; Services</h2>
                                <p className="text-xs text-secondary">Manage your trade categories, specialized skills, and active service offerings.</p>
                            </div>
                            <TradeServices />
                        </div>
                        )}

                        
                        {activeSection === 'availability' && (
                        <div className="settings-card-panel" id="sec-availability">
                            <h2 className="h5 mb-2">Availability &amp; Work Status</h2>
                            <p className="text-xs text-secondary mb-4">Pause lead invitations when you are fully booked or on leave</p>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Accepting New Service Leads</div>
                                    <div className="text-xs text-secondary">Your profile appears in local homeowner search results</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Emergency Callout Dispatch</div>
                                    <div className="text-xs text-secondary">Receive urgent high-priority plumbing leak notices after 8:00 PM</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            
                            <div className="mt-4 pt-3 border-top">
                                <h3 className="h6 mb-3">Weekly Working Schedule</h3>
                                <div id="weekly-schedule-container" className="schedule-days-container text-sm">
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

                            
                            <div className="mt-4 pt-3 border-top">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="h6 mb-0">Specific Date Overrides</h3>
                                    <button className="btn btn-outline btn-xs" onClick={() => {}}>Add Date Override</button>
                                </div>
                                <p className="text-xs text-secondary mb-3">Set custom hours or take a specific day off. This overrides your weekly schedule.</p>
                                
                                <div id="date-overrides-container">
                                    <div className="text-center p-5 border rounded-lg" style={{ borderColor: 'var(--border)', borderStyle: 'dashed', backgroundColor: 'transparent' }}>
                                        <i className="fas fa-calendar-times text-secondary mb-2 text-xl opacity-50"></i>
                                        <p className="text-xs text-secondary mb-0">No overrides added yet. Click "Add Date Override" to set holidays or custom off-days.</p>
                                    </div>
                                </div>
                            </div>
                            
                            
                            <div className="mt-4 pt-3 border-top">
                                <div className="form-group mb-0">
                                    <label className="form-label">Travel Buffer Time (Minutes)</label>
                                    <p className="text-xs text-secondary mb-2">Time reserved between jobs to account for travel and delays.</p>
                                    <select id="buffer-time-select" className="form-control text-sm" style={{"width":"150px"}}>
                                        <option value="0">0 mins</option>
                                        <option value="15">15 mins</option>
                                        <option value="30">30 mins</option>
                                        <option value="45">45 mins</option>
                                        <option value="60">60 mins</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        )}

                        
                        {activeSection === 'notifications' && (
                        <div className="settings-card-panel" id="sec-notifications">
                            <h2 className="h5 mb-2">Notification Preferences</h2>
                            <p className="text-xs text-secondary mb-4">Choose which marketplace events trigger real-time push alerts</p>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">New Matching Request Alerts</div>
                                    <div className="text-xs text-secondary">Instant alerts when a customer posts a plumbing/AC request within 15 km</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Quotation Acceptance &amp; Updates</div>
                                    <div className="text-xs text-secondary">Notify immediately when a homeowner accepts or views your quotation</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Customer Chat Messages</div>
                                    <div className="text-xs text-secondary">Notify when a client sends an in-app message</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">New Reviews &amp; Ratings</div>
                                    <div className="text-xs text-secondary">Notify when a client writes a review after job completion</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>
                        </div>
                        )}

                        
                        {activeSection === 'service-area' && (
                        <div className="settings-card-panel" id="sec-service-area">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <h2 className="h5 mb-0">Service Area &amp; Travel Radius</h2>
                                <button type="button" className="btn btn-primary btn-sm" onClick={() => {}}>
                                    <i className="fas fa-map-pin mr-1"></i> Manage Service Area
                                </button>
                            </div>
                            <p className="text-xs text-secondary mb-4">Define your central dispatch location and maximum travel radius for receiving local customer requests.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-surface-elevated rounded border">
                                    <div className="text-xs text-secondary mb-1">Base Dispatch Location</div>
                                    <div className="font-bold text-sm text-text" id="settings-base-loc">Kodungallur, Thrissur, Kerala</div>
                                    <div className="text-xs text-muted mt-1" id="settings-base-coords">Coordinates: 10.2201° N, 76.2002° E</div>
                                </div>

                                <div className="p-3 bg-surface-elevated rounded border">
                                    <div className="text-xs text-secondary mb-1">Maximum Service Radius</div>
                                    <div className="font-bold text-sm text-primary" id="settings-radius-display">20 km Travel Radius</div>
                                    <div className="text-xs text-muted mt-1">Lead alerts enabled within this perimeter</div>
                                </div>
                            </div>
                        </div>
                        )}

                        
                        {activeSection === 'privacy' && (
                        <div className="settings-card-panel" id="sec-privacy">
                            <h2 className="h5 mb-4">Privacy &amp; Security Sessions</h2>

                            <div className="toggle-switch-row">
                                <div>
                                    <div className="font-bold text-sm text-text">Public Portfolio Visibility</div>
                                    <div className="text-xs text-secondary">Display your past job photographs to prospective clients</div>
                                </div>
                                <label className="switch-slider-ctrl">
                                    <input type="checkbox" checked />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <h3 className="h6 mb-2 mt-4 pt-3 border-top">Active Logged-in Devices</h3>
                            <div className="session-device-row">
                                <div>
                                    <strong className="text-text block">Windows Chrome (Current Session)</strong>
                                    <span className="text-xs text-muted">Mumbai, India • Active Now</span>
                                </div>
                                <span className="badge badge-success text-xs">Current</span>
                            </div>
                            <div className="session-device-row">
                                <div>
                                    <strong className="text-text block">Android Mobile App</strong>
                                    <span className="text-xs text-muted">Mumbai, India • Last active 1 hour ago</span>
                                </div>
                                <button className="btn btn-outline btn-xs" onClick={() => {}}>Revoke</button>
                            </div>

                            <div className="mt-3">
                                <button className="btn btn-outline text-xs text-danger" onClick={() => {}}>
                                    <i className="fas fa-sign-out-alt mr-1"></i> Log Out from All Other Devices
                                </button>
                            </div>
                        </div>
                        )}

                        
                        {activeSection === 'danger' && (
                        <div className="settings-card-panel danger-zone-box" id="sec-danger">
                            <h2 className="h5 text-danger mb-1">Danger Zone</h2>
                            <p className="text-xs text-secondary mb-3">
                                Deactivating your provider account will permanently withdraw all active quotations and unlist your verified profile.
                            </p>
                            <button className="btn btn-outline text-xs text-danger" onClick={() => {}}>
                                <i className="fas fa-trash-alt mr-1"></i> Deactivate Provider Account
                            </button>
                        </div>
                        )}

                        {activeSection === 'addresses' && (
                            <Suspense fallback={<SpinnerOverlay isLoading={true} />}>
                                <Addresses />
                            </Suspense>
                        )}
                </div>
                )}
            </div>
    
    <div className="loc-modal-overlay" id="settingsLocModal">
        <div className="loc-modal" style={{"maxWidth":"600px"}}>
            <div className="loc-modal-header">
                <div className="flex items-center gap-2">
                    <i className="fas fa-map-marked-alt text-primary"></i>
                    <h3 className="h6 mb-0">Configure Service Area &amp; Coverage</h3>
                </div>
                <button className="btn-icon" onClick={() => {}}><i className="fas fa-times"></i></button>
            </div>
            <div className="loc-modal-body">
                <div id="settings-location-picker" className="p-5">
                    <div className="location-picker-card">
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
                </div>
            </div>
            <div className="loc-modal-footer">
                <button type="button" className="btn btn-secondary text-xs" onClick={() => {}}>Cancel</button>
                <button type="button" className="btn btn-primary text-xs" onClick={() => {}}>Save Preferences</button>
            </div>
        </div>
    </div>




    
    
    
    
    </>
  );
}
