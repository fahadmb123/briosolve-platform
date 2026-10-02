import { Link } from 'react-router-dom';

export const Location = () => {
    return (
        <div className="card p-6 fade-in">
            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h2 className="h5 mb-0">Location & Privacy Preferences</h2>
                <Link to="/profile" className="btn btn-outline btn-xs">
                    <i className="fas fa-edit mr-1"></i> Edit Profile Location
                </Link>
            </div>
            <p className="text-xs text-secondary mb-4">Manage default address auto-fill and browser GPS permission preferences.</p>
            <div className="flex flex-col gap-4">
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
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">Allow Browser Geolocation Detection</div>
                        <div className="text-xs text-secondary">Enables "Use My Current Location" button in service request creation</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" checked readOnly id="toggle-geo-perm" />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
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
    );
};
