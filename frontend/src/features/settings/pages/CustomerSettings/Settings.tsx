import { useState, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import './Settings.css';
import { SettingsMenuCard } from '../../components/common/SettingsMenuCard';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useAuthStore } from '../../../auth';

const Appearance = lazy(() => import('./views/Appearance/Appearance').then(m => ({ default: m.Appearance })));
const Contact = lazy(() => import('./views/Contact/Contact').then(m => ({ default: m.Contact })));
const Security = lazy(() => import('./views/Security/Security').then(m => ({ default: m.Security })));
const Notifications = lazy(() => import('./views/Notifications/Notifications').then(m => ({ default: m.Notifications })));
const Addresses = lazy(() => import('./views/Addresses/Addresses').then(m => ({ default: m.Addresses })));
const BecomeProvider = lazy(() => import('./views/BecomeProvider/BecomeProvider').then(m => ({ default: m.BecomeProvider })));

type SettingsView = 'menu' | 'appearance' | 'contact' | 'security' | 'notifications' | 'addresses' | 'become-provider';

export default function Settings() {
    const location = useLocation();
    const [activeView, setActiveView] = useState<SettingsView>(location.state?.activeView || 'menu');
    const user = useAuthStore((state) => state.user);
    const isContactVerified = user?.email_verified && user?.phone_verified;
    const currentAddress =
        user?.current_address_id && typeof user.current_address_id === 'object'
            ? user.current_address_id
            : null;

    const renderMenu = () => (
        <div className="settings-glass-grid">
            <SettingsMenuCard
                icon="fas fa-paint-brush"
                title="Theme & Appearance"
                description="Choose your preferred visual style across all customer screens."
                onClick={() => setActiveView('appearance')}
            />
            
            <SettingsMenuCard
                icon="fas fa-id-card"
                title="Account & Contact"
                description="Update your sign-in email and verified mobile number."
                onClick={() => setActiveView('contact')}
                badge={isContactVerified ? { text: 'Verified', type: 'success' } : { text: 'Action Required', type: 'warning' }}
            />

            <SettingsMenuCard
                icon="fas fa-shield-alt"
                title="Password & Security"
                description="Update your sign-in credentials to protect your marketplace account."
                onClick={() => setActiveView('security')}
            />

            <SettingsMenuCard
                icon="fas fa-bell"
                title="Notification Alerts"
                description="Configure which activity generates direct push or email alerts."
                onClick={() => setActiveView('notifications')}
            />


            <SettingsMenuCard
                icon="fas fa-map-pin"
                title="Manage Addresses"
                description="Save multiple addresses for quick booking and dispatch."
                onClick={() => setActiveView('addresses')}
                badge={currentAddress ? { text: 'Verified', type: 'success' } : { text: 'Action Required', type: 'warning' }}
            />

            <SettingsMenuCard
                icon="fas fa-store"
                title="Become a Provider"
                description="Switch your account and start offering services on the marketplace."
                onClick={() => setActiveView('become-provider')}
            />

        </div>
    );

    return (
        <div className="app-content">
            <div className="mb-6">
                <h1 className="h2 mb-1">Account & Application Settings</h1>
                <p className="text-secondary text-sm">
                    Manage theme preferences, security settings, alerts, and data privacy.
                </p>
            </div>

            {activeView !== 'menu' && (
                <div className="settings-header-back" onClick={() => setActiveView('menu')}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Settings Menu</span>
                </div>
            )}

            <div className="flex flex-col gap-6">
                {activeView === 'menu' && renderMenu()}
                <Suspense fallback={<SpinnerOverlay isLoading={true}/>}>
                    {activeView === 'appearance' && <Appearance />}
                    {activeView === 'contact' && <Contact />}
                    {activeView === 'security' && <Security />}
                    {activeView === 'notifications' && <Notifications />}
                    {activeView === 'addresses' && <Addresses />}
                    {activeView === 'become-provider' && <BecomeProvider />}
                </Suspense>
            </div>
        </div>
    );
}

