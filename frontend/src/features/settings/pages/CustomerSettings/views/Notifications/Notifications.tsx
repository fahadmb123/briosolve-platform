import { BrowserPushNotificationToggle } from "../../../../components/common/BrowserPushNotificationToggle";

export const Notifications = () => {
    return (
        <div className="card p-6 fade-in">
            <h2 className="h5 mb-2">Notification Alerts</h2>
            <p className="text-xs text-secondary mb-5">Configure which activity generates direct push or email alerts.</p>

            <BrowserPushNotificationToggle />
        </div>
    );
};
