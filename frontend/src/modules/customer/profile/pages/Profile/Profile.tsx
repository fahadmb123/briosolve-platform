import { useState } from 'react';
import './Profile.css';
import '../../../../../shared/styles/location-picker.css';

export default function Profile() {
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);

  return (
    <>
      <div className="profile-premium-wrapper">
        {/* Top Gradient/Image Banner */}
        <div className="profile-banner"></div>

        <div className="profile-content-grid">
          {/* LEFT SIDEBAR - PROFILE CARD */}
          <div className="profile-sidebar">
            <div className="profile-card-modern">
              <div className="floating-avatar">
                <img src="https://ui-avatars.com/api/?name=Aarav+Sharma&background=6366F1&color=fff&size=140" alt="Aarav Sharma" />
                <button className="avatar-edit-badge" title="Change Photo">
                  <i className="fas fa-camera"></i>
                </button>
              </div>

              <h2 className="h4 mb-1">Aarav Sharma</h2>
              <span className="badge badge-success text-xs mb-3">
                <i className="fas fa-check-circle mr-1"></i> Email Verified
              </span>
              <p className="text-secondary text-xs">Customer Member • Joined <strong>Jan 2025</strong></p>

              <div className="profile-stats-modern">
                <div className="stat-box">
                  <span className="stat-value">14</span>
                  <span className="stat-label"><i className="fas fa-file-alt text-primary mr-1"></i> Requests</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">12</span>
                  <span className="stat-label"><i className="fas fa-calendar-check text-success mr-1"></i> Bookings</span>
                </div>
              </div>
            </div>

            {/* DEFAULT LOCATION CARD */}
            <div className="card form-card-modern mt-6 p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="h6 mb-0">Default Location</h3>
                  <p className="text-xs text-secondary mb-0">Primary residence</p>
                </div>
                <span className="badge badge-verified text-xs"><i className="fas fa-home mr-1"></i>Home</span>
              </div>

              <div className="location-premium-box">
                <div className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt text-primary mt-1 text-lg"></i>
                  <div>
                    <div className="font-bold text-sm text-text">Kodungallur, Thrissur</div>
                    <div className="text-xs text-secondary mt-1">Kerala, India (10.2201° N, 76.2002° E)</div>
                  </div>
                </div>
              </div>

              <button type="button" className="btn btn-outline btn-sm w-full mb-4" onClick={() => setIsLocModalOpen(true)}>
                <i className="fas fa-edit mr-1"></i> Change Location
              </button>

              <div className="mini-map-preview" id="profile-mini-map">
                <div className="mini-map-overlay-badge">
                  <i className="fas fa-map-pin text-primary"></i>
                  <span>Home: Kodungallur</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT - EDIT FORM */}
          <div className="profile-main-content">
            <form action="#" className="form-card-modern flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-4 border-bottom">
                <h3 className="h4 mb-0">Personal Information</h3>
                <button type="button" className="btn btn-secondary btn-sm">
                  <i className="fas fa-undo mr-1"></i> Reset
                </button>
              </div>

              <div className="form-row-2 mb-2">
                <div className="modern-input-group">
                  <label htmlFor="prof-fname">First Name</label>
                  <input type="text" id="prof-fname" className="form-control" defaultValue="Aarav" />
                </div>
                <div className="modern-input-group">
                  <label htmlFor="prof-lname">Last Name</label>
                  <input type="text" id="prof-lname" className="form-control" defaultValue="Sharma" />
                </div>
              </div>

              <div className="modern-input-group flex-grow">
                <label htmlFor="prof-headline">About / Household Notes</label>
                <textarea 
                  id="prof-headline" 
                  className="form-control modern-textarea" 
                  defaultValue="Homeowner in Lokhandwala, Andheri West. High priority on punctual service and transparent quotations."
                  placeholder="Brief note about your preferences or pets for visiting providers..."
                ></textarea>
                <p className="text-xs text-secondary mt-2">
                  <i className="fas fa-info-circle mr-1"></i> 
                  This information helps providers understand your household preferences before they arrive.
                </p>
              </div>

              <div className="flex justify-end items-center gap-3 mt-auto pt-6 border-top">
                <button type="submit" className="btn btn-primary btn-lg px-8 shadow-lg">
                  <i className="fas fa-check mr-2"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* LOCATION MODAL */}
      <div className={`loc-modal-overlay ${isLocModalOpen ? 'active' : ''}`} id="profileLocModal">
        <div className="loc-modal" style={{ maxWidth: '600px' }}>
          <div className="loc-modal-header">
            <div className="flex items-center gap-2">
              <i className="fas fa-home text-primary"></i>
              <h3 className="h6 mb-0">Update Default Profile Location</h3>
            </div>
            <button className="btn-icon" onClick={() => setIsLocModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="loc-modal-body">
            <div id="profile-location-picker"></div>
          </div>
          <div className="loc-modal-footer">
            <button type="button" className="btn btn-secondary text-xs" onClick={() => setIsLocModalOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary text-xs" onClick={() => setIsLocModalOpen(false)}>Save Default Location</button>
          </div>
        </div>
      </div>
    </>
  );
}
