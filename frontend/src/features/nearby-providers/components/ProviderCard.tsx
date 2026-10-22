import React from 'react';
import type { User } from '../../../shared/types/Dtos';
import type { Address } from '../../addresses';

interface ProviderCardProps {
    provider: User;
    customerAddress?: Address | null;
    onViewDetails: (provider: User) => void;
}

function getDistance(lat1?: number | null, lon1?: number | null, lat2?: number | null, lon2?: number | null): number | null {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
}

export const ProviderCard: React.FC<ProviderCardProps> = React.memo(({ provider, customerAddress, onViewDetails }) => {
    const profile = provider.provider_profile;
    const providerAddress = typeof provider.current_address_id === 'object' ? (provider.current_address_id as Address | null) : null;

    const distance = provider.distance != null
        ? provider.distance
        : getDistance(
            customerAddress?.latitude,
            customerAddress?.longitude,
            providerAddress?.latitude,
            providerAddress?.longitude
        );

    const isKycApproved = profile?.kyc_status === 'APPROVED';
    const avatarUrl = profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=05AD98&color=fff&size=160&bold=true`;

    return (
        <div className="card provider-card fade-in">
            <div className="provider-card-cover">
                <div className="provider-cover-overlay" />
                <div className="provider-cover-top">
                    {distance != null ? (
                        <span className="provider-distance-chip">
                            <i className="fas fa-location-arrow" />
                            {distance} km away
                        </span>
                    ) : profile?.service_radius_km ? (
                        <span className="provider-distance-chip">
                            <i className="fas fa-compass" />
                            {profile.service_radius_km} km radius
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="provider-avatar-row">
                <div className="provider-avatar-wrapper">
                    <img
                        src={avatarUrl}
                        alt={provider.name}
                        className="provider-avatar-img"
                    />
                    {isKycApproved && (
                        <span className="provider-verified-badge" title="Verified Professional">
                            <i className="fas fa-check" />
                        </span>
                    )}
                </div>

                <div className="provider-header-meta">
                    <h3 className="provider-business-name" title={profile?.business_name || provider.name}>
                        {profile?.business_name || provider.name}
                    </h3>
                    <p className="provider-user-name">
                        <i className="fas fa-user-circle" />
                        {provider.name}
                    </p>
                </div>
            </div>

            <div className="provider-card-body">
                <div className="provider-location-meta">
                    {providerAddress?.city && (
                        <span className="location-pill">
                            <i className="fas fa-map-marker-alt" />
                            {providerAddress.city}{providerAddress.state ? `, ${providerAddress.state}` : ''}
                        </span>
                    )}
                    {profile?.service_radius_km && (
                        <span className="radius-pill">
                            <i className="fas fa-crosshairs" />
                            Serves {profile.service_radius_km} km radius
                        </span>
                    )}
                </div>

                <div className="provider-stats-bar">
                    <div className="provider-stat-item">
                        <span className="stat-value">{profile?.completed_jobs ?? 0}</span>
                        <span className="stat-label">Jobs Done</span>
                    </div>
                    <div className="provider-stat-divider" />
                    <div className="provider-stat-item">
                        <span className="stat-value">{profile?.experience || '1+ Yrs'}</span>
                        <span className="stat-label">Experience</span>
                    </div>
                    <div className="provider-stat-divider" />
                    <div className="provider-stat-item">
                        <span className="stat-value highlight">{isKycApproved ? 'Verified' : 'Active'}</span>
                        <span className="stat-label">KYC Status</span>
                    </div>
                </div>

                {profile?.bio && (
                    <p className="provider-bio-text">
                        {profile.bio}
                    </p>
                )}

                {profile?.skills && (
                    <div className="provider-skills-list">
                        {profile.skills.split(',').slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="provider-skill-tag">
                                {skill.trim()}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="provider-card-footer">
                <button
                    type="button"
                    onClick={() => onViewDetails(provider)}
                    className="btn btn-primary w-100 provider-details-btn"
                >
                    <span>View Profile & Details</span>
                    <i className="fas fa-arrow-right" />
                </button>
            </div>
        </div>
    );
});

