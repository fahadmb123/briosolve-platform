import React from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import type { User } from '../../../../shared/types/Dtos';
import type { Address } from '../../../addresses';
import './ProviderProfileView.css';

interface ProviderProfileViewProps {
    provider: User | null;
    isLoading?: boolean;
    customerAddress?: Address | null;
    onBack: () => void;
}

export const ProviderProfileView: React.FC<ProviderProfileViewProps> = React.memo(({
    provider,
    isLoading = false,
    customerAddress,
    onBack
}) => {
    const navigate = useNavigate();

    if (isLoading || !provider) {
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
                            <div className="provider-profile-hero-meta" style={{ minWidth: 280 }}>
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
            </div>
        );
    }

    const profile = provider.provider_profile;
    const providerAddress = typeof provider.current_address_id === 'object'
        ? (provider.current_address_id as Address | null)
        : null;

    const isKycApproved = profile?.kyc_status === 'APPROVED';
    const distance = (provider as User & { distance?: number }).distance;
    const avatarUrl = profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=FF7900&color=fff&size=240&bold=true`;

    const handleStartChat = () => {
        navigate(`/messages?recipientId=${provider.id}`, {
            state: { recipientId: provider.id, providerId: provider.id }
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
                    <span className="crumb-active">{provider.name}</span>
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
                                alt={provider.name}
                                className="provider-profile-avatar-img"
                            />
                            {isKycApproved && (
                                <span className="provider-profile-verified-badge" title="Government ID Verified Pro">
                                    <i className="fas fa-check" />
                                </span>
                            )}
                        </div>

                        <div className="provider-profile-hero-meta">
                            <h1 className="provider-profile-hero-name">{provider.name}</h1>
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
                            {provider.status === 'ACTIVE' ? 'Verified Active' : 'Available'}
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
                            {profile?.bio || `${provider.name} is a verified professional specialist offering dependable local services with certified expertise and direct transparent pricing.`}
                        </p>
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
                                <i className="fas fa-shield-check" />
                                <h3>Trust & Service Guarantees</h3>
                            </div>
                        </div>
                        <div className="provider-guarantees-list">
                            <div className="guarantee-badge-box">
                                <i className="fas fa-id-card" />
                                <span>Government ID Verified</span>
                            </div>
                            <div className="guarantee-badge-box">
                                <i className="fas fa-handshake" />
                                <span>Direct Upfront Pricing</span>
                            </div>
                            <div className="guarantee-badge-box">
                                <i className="fas fa-stopwatch" />
                                <span>Fast Response Times</span>
                            </div>
                            <div className="guarantee-badge-box">
                                <i className="fas fa-award" />
                                <span>Satisfaction Guaranteed</span>
                            </div>
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
                                    <p>Review quotes and chat directly with {provider.name}.</p>
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
                            Directly request a custom quote or schedule service with {provider.name}.
                        </p>
                       
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
                            {provider.email && (
                                <div className="contact-row" title={provider.email}>
                                    <i className="fas fa-envelope" />
                                    <span className="text-truncate">{provider.email}</span>
                                </div>
                            )}

                            {provider.phone && (
                                <div className="contact-row">
                                    <i className="fas fa-phone" />
                                    <span>{provider.phone}</span>
                                </div>
                            )}

                            <div className="contact-row">
                                <i className="fas fa-clock" />
                                <span>Mon - Sat: 08:00 AM - 07:00 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="provider-cta-banner">
                <div className="provider-cta-info">
                    <h3>Ready to work with {provider.name}?</h3>
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
                </div>
            </div>
        </div>
    );
});
