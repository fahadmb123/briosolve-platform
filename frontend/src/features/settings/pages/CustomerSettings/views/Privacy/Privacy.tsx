export const Privacy = () => {
    return (
        <div className="card p-6 fade-in">
            <h2 className="h5 mb-2">Privacy & Active Sessions</h2>
            <p className="text-xs text-secondary mb-4">Manage connected devices and data visibility.</p>
            <div className="p-4 bg-surface-elevated rounded border flex justify-between items-center flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <i className="fas fa-laptop text-primary text-xl"></i>
                    <div>
                        <div className="font-semibold text-xs text-text">Chrome on Windows 11 (Current Device)</div>
                        <div className="text-xs text-muted">Mumbai, India • Active right now</div>
                    </div>
                </div>
                <span className="badge badge-success text-xs">This Session</span>
            </div>
            <button className="btn btn-secondary btn-sm">
                <i className="fas fa-sign-out-alt mr-1"></i> Log Out of All Other Devices
            </button>
        </div>
    );
};
