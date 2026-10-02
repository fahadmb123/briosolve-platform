export const Notifications = () => {
    return (
        <div className="card p-6 fade-in">
            <h2 className="h5 mb-2">Notification Alerts</h2>
            <p className="text-xs text-secondary mb-4">Configure which activity generates direct push or email alerts.</p>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">New Quotation Alerts</div>
                        <div className="text-xs text-secondary">Get notified instantly when a provider bids on your request</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" checked readOnly />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">Booking Milestones & Status Updates</div>
                        <div className="text-xs text-secondary">Receive alerts when a provider accepts, starts, or completes work</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" checked readOnly />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">Direct Messages</div>
                        <div className="text-xs text-secondary">Notify when a contractor sends a message regarding an active request</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" checked readOnly />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="flex justify-between items-center py-2">
                    <div>
                        <div className="font-semibold text-xs text-text">Review & Rating Reminders</div>
                        <div className="text-xs text-secondary">Periodic prompts to rate providers after booking completion</div>
                    </div>
                    <label className="toggle-switch">
                        <input type="checkbox" checked readOnly />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    );
};
