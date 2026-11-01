import { BrowserPushNotificationToggle } from "../../../../components/common/BrowserPushNotificationToggle";

export const Notifications = () => {
    return (
        <div className="card p-6 fade-in">
            <h2 className="h5 mb-2">Notification Alerts</h2>
            <p className="text-xs text-secondary mb-5">Configure which activity generates direct push or email alerts.</p>

            <BrowserPushNotificationToggle />

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">New Quotation Alerts</div>
                        <div className="text-xs text-secondary">Get notified instantly when a provider bids on your request</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">Booking Milestones & Status Updates</div>
                        <div className="text-xs text-secondary">Receive alerts when a provider accepts, starts, or completes work</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="flex justify-between items-center py-2 border-bottom">
                    <div>
                        <div className="font-semibold text-xs text-text">Direct Messages</div>
                        <div className="text-xs text-secondary">Notify when a contractor sends a message regarding an active request</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
                <div className="flex justify-between items-center py-2">
                    <div>
                        <div className="font-semibold text-xs text-text">Review & Rating Reminders</div>
                        <div className="text-xs text-secondary">Periodic prompts to rate providers after booking completion</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};
