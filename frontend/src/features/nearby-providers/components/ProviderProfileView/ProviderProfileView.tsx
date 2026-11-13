import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import type { User } from '../../../../shared/types/Dtos';
import type { Address } from '../../../addresses';
import { useGetProviderPublicProfile } from '../../hooks/mutations/useGetProviderPublicProfile';
import type { ProviderPublicProfileData } from '../../services/nearbyProviders.service';
import './ProviderProfileView.css';

interface ProviderProfileViewProps {
    providerId?: string;
    initialProvider?: User | null;
    customerAddress?: Address | null;
    onBack: () => void;
}

const WEEKDAYS_MAP = [
    { key: 'MONDAY', label: 'Monday', jsDay: 1 },
    { key: 'TUESDAY', label: 'Tuesday', jsDay: 2 },
    { key: 'WEDNESDAY', label: 'Wednesday', jsDay: 3 },
    { key: 'THURSDAY', label: 'Thursday', jsDay: 4 },
    { key: 'FRIDAY', label: 'Friday', jsDay: 5 },
    { key: 'SATURDAY', label: 'Saturday', jsDay: 6 },
    { key: 'SUNDAY', label: 'Sunday', jsDay: 0 }
];

export const ProviderProfileView: React.FC<ProviderProfileViewProps> = React.memo(({
    providerId,
    initialProvider,
    customerAddress,
    onBack
}) => {
    const navigate = useNavigate();

    const targetId = providerId || initialProvider?.id;
    const [profileData, setProfileData] = useState<ProviderPublicProfileData | null>(null);
    const getProfileMut = useGetProviderPublicProfile();

    useEffect(() => {
        if (!targetId) return;
        getProfileMut.mutate(targetId, {
            onSuccess: (res) => {
                if (res.data) {
                    setProfileData(res.data);
                }
            }
        });
    }, [targetId]);

    const isLoading = getProfileMut.isPending && !profileData;

    const activeProviderName = profileData?.name || initialProvider?.name || 'Provider';
    const profile = profileData?.provider_profile || initialProvider?.provider_profile;
    const providerAddress = typeof (profileData?.current_address_id || initialProvider?.current_address_id) === 'object'
        ? ((profileData?.current_address_id || initialProvider?.current_address_id) as Address | null)
        : null;

    const isKycApproved = profile?.kyc_status === 'APPROVED';
    const distance = profileData?.distance != null
        ? profileData.distance
        : (initialProvider as User & { distance?: number })?.distance;

    const avatarUrl = profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeProviderName)}&background=FF7900&color=fff&size=240&bold=true`;

    const handleStartChat = () => {
        if (!targetId) return;
        navigate(`/messages?recipientId=${targetId}`, {
            state: { recipientId: targetId, providerId: targetId }
        });
    };

    const handleRequestService = () => {
        if (!targetId) return;
        navigate('/request-service', {
            state: {
                preferredProviderId: targetId,
                preferredProviderName: activeProviderName
            }
        });
    };

    const defaultSkills = [
        'Diagnostics & Repair',
        'Installation & Setup',
        'Preventive Maintenance',
        'Emergency Service',
        'Inspection & Testing'
    ];

    const skillsArray = profile?.skills
        ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : defaultSkills;

    const todayJsDay = new Date().getDay();

    const formattedSchedule = useMemo(() => {
        const availList = profileData?.availability || [];
        return WEEKDAYS_MAP.map((dayItem) => {
            const slot = availList.find((s) => s.day_of_week === dayItem.key);
            const isToday = dayItem.jsDay === todayJsDay;
            return {
                dayName: dayItem.label,
                isToday,
                isOpen: Boolean(slot),
                timeRange: slot ? `${slot.start_time} - ${slot.end_time}` : 'Unavailable'
            };
        });
    }, [profileData?.availability, todayJsDay]);

    if (isLoading && !profileData) {
        return (
            <div className="provider-profile-view fade-in">
                <div className="provider-profile-nav-bar">
                    <button type="button" onClick={onBack} className="provider-back-btn">
                        <i className="fas fa-arrow-left" />
                        <span>Back to Nearby Providers</span>
                    </button>
                </div>

                <div className="provider-profile-hero-card">
                    <div className="provider-profile-banner" />
                    <div className="provider-profile-hero-content">
                        <div className="provider-profile-hero-left">
                            <div className="provider-profile-avatar-box">
                                <Skeleton circle width={140} height={140} />
                            </div>
                            <div className="provider-profile-hero-meta" style={{ minWidth: 280, flex: 1 }}>
                                <Skeleton width={260} height={36} style={{ marginBottom: 8 }} />
                                <Skeleton width={180} height={22} style={{ marginBottom: 12 }} />
                                <Skeleton width={320} height={28} borderRadius={9999} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="provider-stats-grid">
                    <Skeleton height={90} borderRadius={16} />
                    <Skeleton height={90} borderRadius={16} />
                    <Skeleton height={90} borderRadius={16} />
                    <Skeleton height={90} borderRadius={16} />
                </div>

                <div className="provider-profile-layout">
                    <div className="provider-profile-main-col">
                        <Skeleton height={180} borderRadius={18} />
                        <Skeleton height={240} borderRadius={18} />
                        <Skeleton height={140} borderRadius={18} />
                    </div>
                    <div className="provider-profile-side-col">
                        <Skeleton height={180} borderRadius={18} />
                        <Skeleton height={320} borderRadius={18} />
                        <Skeleton height={140} borderRadius={18} />
                    </div>
                </div>
            </div>
        );
    }

    const servicesList = profileData?.services || [];

    return (
        <div className="provider-profile-view fade-in">
            <div className="provider-profile-nav-bar">
                <button type="button" onClick={onBack} className="provider-back-btn">
                    <i className="fas fa-arrow-left" />
                    <span>Back to Nearby Providers</span>
                </button>

                <div className="provider-profile-breadcrumb">
                    <span>Providers</span>
                    <i className="fas fa-chevron-right text-xs" />
                    <span className="crumb-active">{activeProviderName}</span>
                </div>
            </div>

            <div className="provider-profile-hero-card">
                <div className="provider-profile-banner">
                    <div className="provider-profile-banner-pattern" />
                </div>

                <div className="provider-profile-hero-content">
                    <div className="provider-profile-hero-left">
                        <div className="provider-profile-avatar-box">
                            <img
                                src={avatarUrl}
                                alt={activeProviderName}
                                className="provider-profile-avatar-img"
                            />
                            {isKycApproved && (
                                <span className="provider-profile-verified-badge" title="Government ID Verified Pro">
                                    <i className="fas fa-check" />
                                </span>
                            )}
                        </div>

                        <div className="provider-profile-hero-meta">
                            <h1 className="provider-profile-hero-name">{activeProviderName}</h1>
                            <div className="provider-profile-hero-business">
                                <i className="fas fa-briefcase" />
                                <span>{profile?.business_name || 'Independent Specialist'}</span>
                            </div>

                            <div className="provider-profile-badges-row">
                                {isKycApproved && (
                                    <span className="profile-pill-badge verified">
                                        <i className="fas fa-shield-halved" />
                                        <span>KYC Verified Pro</span>
                                    </span>
                                )}

                                {profile?.service_radius_km && (
                                    <span className="profile-pill-badge coverage">
                                        <i className="fas fa-route" />
                                        <span>{profile.service_radius_km} km Service Radius</span>
                                    </span>
                                )}

                                {distance != null && (
                                    <span className="profile-pill-badge distance">
                                        <i className="fas fa-location-crosshairs" />
                                        <span>{distance} km away</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="provider-profile-hero-actions">
                        <button
                            type="button"
                            onClick={handleStartChat}
                            className="provider-profile-btn-secondary"
                        >
                            <i className="fas fa-comment-dots" />
                            <span>Message</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleRequestService}
                            className="provider-profile-btn-primary"
                        >
                            <i className="fas fa-paper-plane" />
                            <span>Request Service</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="provider-stats-grid">
                <div className="provider-stat-card">
                    <div className="provider-stat-icon-wrap">
                        <i className="fas fa-check-double" />
                    </div>
                    <div className="provider-stat-data">
                        <span className="provider-stat-num">{profile?.completed_jobs ?? 0}</span>
                        <span className="provider-stat-lbl">Jobs Completed</span>
                    </div>
                </div>

                <div className="provider-stat-card">
                    <div className="provider-stat-icon-wrap">
                        <i className="fas fa-medal" />
                    </div>
                    <div className="provider-stat-data">
                        <span className="provider-stat-num">{profile?.experience || 'Experienced'}</span>
                        <span className="provider-stat-lbl">Experience</span>
                    </div>
                </div>

                <div className="provider-stat-card">
                    <div className="provider-stat-icon-wrap">
                        <i className="fas fa-compass" />
                    </div>
                    <div className="provider-stat-data">
                        <span className="provider-stat-num">
                            {profile?.service_radius_km ? `${profile.service_radius_km} km` : 'Local Area'}
                        </span>
                        <span className="provider-stat-lbl">Operating Radius</span>
                    </div>
                </div>

                <div className="provider-stat-card">
                    <div className="provider-stat-icon-wrap">
                        <i className="fas fa-circle-check" />
                    </div>
                    <div className="provider-stat-data">
                        <span className="provider-stat-num" style={{ fontSize: '1.15rem', color: '#10B981' }}>
                            {profileData?.status === 'ACTIVE' || initialProvider?.status === 'ACTIVE' ? 'Verified Active' : 'Available'}
                        </span>
                        <span className="provider-stat-lbl">Platform Status</span>
                    </div>
                </div>
            </div>

            <div className="provider-profile-layout">
                <div className="provider-profile-main-col">
                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-user" />
                                <h3>About the Specialist</h3>
                            </div>
                        </div>
                        <p className="provider-bio-paragraph">
                            {profile?.bio || `${activeProviderName} is a verified professional specialist offering dependable local services with certified expertise and direct transparent pricing.`}
                        </p>
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-layer-group" />
                                <h3>Specialist Offered Services</h3>
                            </div>
                            <span className="text-xs font-semibold text-secondary">
                                {servicesList.length} services available
                            </span>
                        </div>

                        {servicesList.length > 0 ? (
                            <div className="provider-services-grid">
                                {servicesList.map((item) => (
                                    <div key={item.id} className="provider-service-card-item">
                                        <div className="provider-service-top-row">
                                            {item.service?.category?.name && (
                                                <span className="provider-service-cat-badge">
                                                    <i className="fas fa-tag" />
                                                    <span>{item.service.category.name}</span>
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="provider-service-item-title">
                                            {item.service?.name || 'Professional Service'}
                                        </h4>
                                        <p className="provider-service-item-desc">
                                            {item.service?.description || 'Custom quotes and on-demand scheduling provided.'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-secondary text-sm mb-0">
                                This specialist is available for custom quote requests across their core trade.
                            </p>
                        )}
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-tools" />
                                <h3>Specializations & Skills</h3>
                            </div>
                        </div>
                        <div className="provider-skills-chips">
                            {skillsArray.map((skill, index) => (
                                <span key={index} className="provider-skill-pill">
                                    <i className="fas fa-check-circle text-xs" style={{ color: '#FF7900' }} />
                                    <span>{skill}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-list-check" />
                                <h3>How Working Together Works</h3>
                            </div>
                        </div>
                        <div className="provider-steps-grid">
                            <div className="provider-step-item">
                                <div className="provider-step-num">1</div>
                                <div className="provider-step-content">
                                    <h4>Submit Request</h4>
                                    <p>Describe your job requirements and schedule.</p>
                                </div>
                            </div>
                            <div className="provider-step-item">
                                <div className="provider-step-num">2</div>
                                <div className="provider-step-content">
                                    <h4>Get Direct Bid</h4>
                                    <p>Review quotes and chat directly with {activeProviderName}.</p>
                                </div>
                            </div>
                            <div className="provider-step-item">
                                <div className="provider-step-num">3</div>
                                <div className="provider-step-content">
                                    <h4>Service Delivered</h4>
                                    <p>Specialist arrives and completes the work with care.</p>
                                </div>
                            </div>
                            <div className="provider-step-item">
                                <div className="provider-step-num">4</div>
                                <div className="provider-step-content">
                                    <h4>Review & Pay</h4>
                                    <p>Release payment only when you are 100% satisfied.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="provider-profile-side-col">
                    <div className="provider-info-card" style={{ background: 'linear-gradient(135deg, rgba(255, 121, 0, 0.08) 0%, rgba(255, 230, 66, 0.05) 100%)', borderColor: 'rgba(255, 121, 0, 0.3)' }}>
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-bolt" />
                                <h3>Book Specialist</h3>
                            </div>
                        </div>
                        <p className="text-secondary text-sm mb-3">
                            Directly request a custom quote or schedule service with {activeProviderName}.
                        </p>
                        <button
                            type="button"
                            onClick={handleRequestService}
                            className="provider-profile-btn-primary w-100 mb-2"
                        >
                            <i className="fas fa-paper-plane" />
                            <span>Request a Service</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleStartChat}
                            className="provider-profile-btn-secondary w-100"
                        >
                            <i className="fas fa-comment-dots" />
                            <span>Chat with Provider</span>
                        </button>
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-calendar-week" />
                                <h3>Weekly Working Hours</h3>
                            </div>
                        </div>
                        <div className="provider-schedule-list">
                            {formattedSchedule.map((sched, idx) => (
                                <div key={idx} className={`schedule-day-row ${sched.isToday ? 'is-today' : ''}`}>
                                    <div className="schedule-day-name-box">
                                        <span>{sched.dayName}</span>
                                        {sched.isToday && <span className="schedule-today-tag">Today</span>}
                                    </div>
                                    <div className={`schedule-time-badge ${!sched.isOpen ? 'is-closed' : ''}`}>
                                        {sched.isOpen ? (
                                            <>
                                                <i className="fas fa-clock text-xs" style={{ color: '#10B981' }} />
                                                <span>{sched.timeRange}</span>
                                            </>
                                        ) : (
                                            <span>Unavailable</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-map-location-dot" />
                                <h3>Operating Coverage</h3>
                            </div>
                        </div>
                        <div className="provider-coverage-box">
                            <div className="coverage-item">
                                <i className="fas fa-location-dot" />
                                <div>
                                    <div className="coverage-item-title">Base City & Area</div>
                                    <div className="coverage-item-desc">
                                        {providerAddress
                                            ? `${providerAddress.area ? `${providerAddress.area}, ` : ''}${providerAddress.city}, ${providerAddress.state}`
                                            : 'Location details available on request'}
                                    </div>
                                </div>
                            </div>

                            <div className="coverage-item">
                                <i className="fas fa-route" />
                                <div>
                                    <div className="coverage-item-title">Operating Radius</div>
                                    <div className="coverage-item-desc">
                                        Within {profile?.service_radius_km ?? 20} km
                                    </div>
                                </div>
                            </div>

                            {customerAddress && (
                                <div className="coverage-highlight-banner">
                                    <i className="fas fa-shield-heart" />
                                    <span>
                                        Mutual coverage confirmed: You and this provider are within range.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="provider-info-card">
                        <div className="provider-info-header">
                            <div className="provider-info-header-title">
                                <i className="fas fa-address-card" />
                                <h3>Contact Details</h3>
                            </div>
                        </div>
                        <div className="provider-contact-list">
                            {(profileData?.email || initialProvider?.email) && (
                                <div className="contact-row" title={profileData?.email || initialProvider?.email}>
                                    <i className="fas fa-envelope" />
                                    <span className="text-truncate">{profileData?.email || initialProvider?.email}</span>
                                </div>
                            )}

                            {(profileData?.phone || initialProvider?.phone) && (
                                <div className="contact-row">
                                    <i className="fas fa-phone" />
                                    <span>{profileData?.phone || initialProvider?.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="provider-cta-banner">
                <div className="provider-cta-info">
                    <h3>Ready to work with {activeProviderName}?</h3>
                    <p>Post a service request to receive upfront estimates, or message them right away.</p>
                </div>
                <div className="provider-cta-actions">
                    <button
                        type="button"
                        onClick={handleStartChat}
                        className="provider-profile-btn-secondary"
                    >
                        <i className="fas fa-comment-dots" />
                        <span>Send Message</span>
                    </button>
                    <button
                        type="button"
                        onClick={handleRequestService}
                        className="provider-profile-btn-primary"
                    >
                        <i className="fas fa-paper-plane" />
                        <span>Request Service Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
});
