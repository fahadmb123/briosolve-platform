import {
    usePushSubscriptionStatus,
    useSubscribePush,
    useUnsubscribePush,
    isPushNotificationSupported,
    getPushPermissionState,
} from "../../../../shared/hooks/usePushNotifications";

export const BrowserPushNotificationToggle = () => {
    const { data: pushStatus, isLoading } = usePushSubscriptionStatus();
    const subscribePush = useSubscribePush();
    const unsubscribePush = useUnsubscribePush();

    const isSupported = isPushNotificationSupported();
    const permission = pushStatus?.permission ?? getPushPermissionState();
    const isSubscribed = Boolean(pushStatus?.isSubscribed);
    const isPending = subscribePush.isPending || unsubscribePush.isPending;
    const isBlocked = isSupported && permission === "denied";

    const handleTogglePush = () => {
        if (isBlocked || !isSupported) return;
        if (isSubscribed) {
            unsubscribePush.mutate();
        } else {
            subscribePush.mutate();
        }
    };

    return (
        <div className="p-4 rounded-xl border border-surface-variant bg-surface-container mb-6 flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-xl">notifications_active</span>
                </div>
                <div>
                    <div className="font-semibold text-sm text-on-surface flex items-center gap-2">
                        <span>Browser Push Notifications</span>
                        {!isSupported ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[11px] font-medium">
                                Unsupported
                            </span>
                        ) : isBlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] font-medium">
                                Permission Blocked
                            </span>
                        ) : isSubscribed ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-bold">
                                Active
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-medium">
                                Disabled
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-on-surface-variant m-0 mt-0.5">
                        {!isSupported
                            ? "Push notifications require a secure context (HTTPS or localhost) and a compatible browser."
                            : isBlocked
                            ? "Notifications are blocked in your browser site settings. Click the site settings/lock icon in your address bar to allow them."
                            : isSubscribed
                            ? "Live browser push notifications are active for this device."
                            : "Receive instant notifications even when your browser tab is in background."}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className={`relative inline-flex items-center ${!isSupported || isBlocked || isLoading || isPending ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                    <input
                        type="checkbox"
                        checked={isSubscribed}
                        disabled={!isSupported || isBlocked || isLoading || isPending}
                        onChange={handleTogglePush}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>
        </div>
    );
};

