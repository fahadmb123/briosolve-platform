import { useState, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import './Settings.css';
import { SettingsMenuCard } from '../../components/SettingsMenuCard';
import { SpinnerOverlay } from '../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useAuthStore } from '../../../../../store/auth/auth.store';

const Appearance = lazy(() => import('./views/Appearance/Appearance').then(m => ({ default: m.Appearance })));
const Contact = lazy(() => import('./views/Contact/Contact').then(m => ({ default: m.Contact })));
const Security = lazy(() => import('./views/Security/Security').then(m => ({ default: m.Security })));
const Notifications = lazy(() => import('./views/Notifications/Notifications').then(m => ({ default: m.Notifications })));
const Location = lazy(() => import('./views/Location/Location').then(m => ({ default: m.Location })));
const Privacy = lazy(() => import('./views/Privacy/Privacy').then(m => ({ default: m.Privacy })));
const Addresses = lazy(() => import('./views/Addresses/Addresses').then(m => ({ default: m.Addresses })));
const Danger = lazy(() => import('./views/Danger/Danger').then(m => ({ default: m.Danger })));


type SettingsView = 'menu' | 'appearance' | 'contact' | 'security' | 'notifications' | 'location' | 'privacy' | 'danger' | 'addresses';

export default function Settings() {
    const location = useLocation();
    const [activeView, setActiveView] = useState<SettingsView>(location.state?.activeView || 'menu');
    const user = useAuthStore((state) => state.user);
    const isContactVerified = user?.email_verified && user?.phone_verified;

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
                icon="fas fa-map-marker-alt"
                title="Location Preferences"
                description="Manage default address auto-fill and browser GPS permission preferences."
                onClick={() => setActiveView('location')}
            />

            <SettingsMenuCard
                icon="fas fa-laptop-house"
                title="Privacy & Sessions"
                description="Manage connected devices and data visibility."
                onClick={() => setActiveView('privacy')}
            />
            
            <SettingsMenuCard
                icon="fas fa-map-marked-alt"
                title="Manage Addresses"
                description="Save multiple addresses for quick booking and dispatch."
                onClick={() => setActiveView('addresses')}
            />
            
            <SettingsMenuCard
                icon="fas fa-exclamation-triangle"
                title="Danger Zone"
                description="Permanently close your customer account and cancel all active requests."
                onClick={() => setActiveView('danger')}
                danger={true}
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
                    {activeView === 'location' && <Location />}
                    {activeView === 'addresses' && <Addresses />}
                    {activeView === 'privacy' && <Privacy />}
                    {activeView === 'danger' && <Danger />}
                </Suspense>
            </div>
        </div>
    );
}

