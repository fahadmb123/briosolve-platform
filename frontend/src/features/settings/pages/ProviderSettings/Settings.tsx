import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './Settings.css';
import { SettingsMenuCard } from '../../components/common/SettingsMenuCard';
import { ChangePasswordForm } from '../../components/provider/ChangePasswordForm';
import { ContactInfo } from '../../components/provider/ContactInfo';
import { BusinessProfileForm } from '../../components/provider/BusinessProfileForm';
import { TradeServices, useGetProviderServices } from '../../../service-catalog';
import { AvailabilitySettings } from '../../../availability';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { BecomeCustomer } from '../../components/provider/BecomeCustomer';
const Addresses = lazy(() => import('../CustomerSettings/views/Addresses/Addresses').then(m => ({ default: m.Addresses })));

export default function Settings() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [activeSection, setActiveSection] = useState((location.state as { activeSection?: string })?.activeSection || 'grid');
  const [tradeServicesInfo, setTradeServicesInfo] = useState<{ total: number; active: number } | null>(null);
  const getProviderServices = useGetProviderServices();

  useEffect(() => {
    getProviderServices.mutate(undefined, {
      onSuccess: (res) => {
        const services = res.data || [];
        const active = services.filter(
          (s) => s.service?.status === 'ACTIVE' && s.service?.category?.status === 'ACTIVE'
        ).length;
        setTradeServicesInfo({ total: services.length, active });
      }
    });
  }, []);

  const tradeServicesBadge = useMemo(() => {
    if (!tradeServicesInfo) return undefined;
    if (tradeServicesInfo.active > 0) {
      return { text: `${tradeServicesInfo.active} Active`, type: 'success' as const };
    }
    if (tradeServicesInfo.total > 0) {
      return { text: 'Inactive', type: 'warning' as const };
    }
    return { text: 'Action Required', type: 'warning' as const };
  }, [tradeServicesInfo]);

  useEffect(() => {
    (()=>{
        if ((location.state as { activeSection?: string })?.activeSection) {
            setActiveSection((location.state as { activeSection?: string }).activeSection!);
        }
    })()
  }, [location.state])

  const isContactVerified = Boolean(user?.email_verified && user?.phone_verified);
  const isAddressVerified = Boolean(user?.current_address_id);

  const contactBadge = useMemo(() => (
    isContactVerified ? { text: 'Verified', type: 'success' as const } : { text: 'Action Required', type: 'warning' as const }
  ), [isContactVerified]);

  const addressBadge = useMemo(() => (
    isAddressVerified ? { text: 'Verified', type: 'success' as const } : { text: 'Action Required', type: 'warning' as const }
  ), [isAddressVerified]);

  const handleSelectAccount = useCallback(() => setActiveSection('account'), []);
  const handleSelectBusiness = useCallback(() => setActiveSection('business'), []);
  const handleSelectServices = useCallback(() => setActiveSection('services'), []);
  const handleSelectAvailability = useCallback(() => setActiveSection('availability'), []);
  const handleSelectNotifications = useCallback(() => setActiveSection('notifications'), []);
  const handleSelectAddresses = useCallback(() => setActiveSection('addresses'), []);
  const handleBackToGrid = useCallback(() => setActiveSection('grid'), []);
  const handleBecomeCustomer = useCallback(() => setActiveSection('become-customer'), []);

  const handleServicesChange = useCallback((info: { total: number; active: number }) => {
    setTradeServicesInfo(info);
  }, []);

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
                </div>

                
                {activeSection === 'grid' && (
                <div id="settings-grid-view">
                    <div className="settings-glass-grid mb-6">
                        <SettingsMenuCard
                            icon="fas fa-user-shield"
                            title="Account & Security"
                            description="Configure your sign-in credentials and two-factor auth."
                            onClick={handleSelectAccount}
                            badge={contactBadge}
                        />
                        <SettingsMenuCard
                            icon="fas fa-briefcase"
                            title="Business Profile"
                            description="Update your business name, bio, and years of experience."
                            onClick={handleSelectBusiness}
                        />
                        <SettingsMenuCard
                            icon="fas fa-wrench"
                            title="Trade Services"
                            description="Manage the service categories you specialize in."
                            onClick={handleSelectServices}
                            badge={tradeServicesBadge}
                        />
                        <SettingsMenuCard
                            icon="fas fa-calendar-alt"
                            title="Working Availability"
                            description="Configure your daily business hours and specific days off."
                            onClick={handleSelectAvailability}
                        />
                        <SettingsMenuCard
                            icon="fas fa-bell"
                            title="Notification Triggers"
                            description="Choose which marketplace events send you push alerts."
                            onClick={handleSelectNotifications}
                        />
                        <SettingsMenuCard
                            icon="fas fa-map-pin"
                            title="Manage Addresses"
                            description="Save your business addresses for accurate local search matching."
                            onClick={handleSelectAddresses}
                            badge={addressBadge}
                        />
                        <SettingsMenuCard
                            icon="fas fa-store"
                            title="Become a Customer"
                            description="Switch your account and start requesting for the services on the marketplace."
                            onClick={handleBecomeCustomer}
                        />
                    </div>
                </div>
                )}

                
                {activeSection !== 'grid' && (
                <div id="settings-detail-view">
                    <div className="settings-header-back" onClick={handleBackToGrid}>
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
                            <TradeServices onServicesChange={handleServicesChange} />
                        </div>
                        )}

                        
                        {activeSection === 'availability' && (
                            <AvailabilitySettings />
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

                        {activeSection === 'addresses' && (
                            <Suspense fallback={<SpinnerOverlay isLoading={true} />}>
                                <Addresses />
                            </Suspense>
                        )}
                        {activeSection === 'become-customer' && (
                            <Suspense fallback={<SpinnerOverlay isLoading={true} />}>
                                <BecomeCustomer />
                            </Suspense>
                        )}
                        
                </div>
                )}
            </div>
    </>
  );
}
