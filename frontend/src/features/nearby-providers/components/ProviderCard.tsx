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
    const avatarUrl = profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=FF7900&color=fff&size=200&bold=true`;

    return (
        <div 
            className="card provider-clean-card fade-in"
            onClick={() => onViewDetails(provider)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewDetails(provider);
                }
            }}
        >
            <div className="provider-clean-avatar-wrap">
                <img
                    src={avatarUrl}
                    alt={provider.name}
                    className="provider-clean-avatar-img"
                />
                {isKycApproved && (
                    <span className="provider-clean-verified" title="Verified Professional">
                        <i className="fas fa-check" />
                    </span>
                )}
            </div>

            <div className="provider-clean-info">
                <h3 className="provider-clean-name" title={provider.name}>
                    {provider.name}
                </h3>

                <p className="provider-clean-business" title={profile?.business_name || 'Independent Specialist'}>
                    <i className="fas fa-briefcase" />
                    <span>{profile?.business_name || 'Independent Specialist'}</span>
                </p>

                <div className="provider-clean-radius-badge">
                    <i className="fas fa-location-dot" />
                    <span>{profile?.service_radius_km ? `${profile.service_radius_km} km Service Radius` : (distance != null ? `${distance} km away` : 'Local Coverage')}</span>
                </div>
            </div>

            <div className="provider-clean-footer">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(provider);
                    }}
                    className="provider-clean-btn"
                >
                    <span>View Profile</span>
                    <i className="fas fa-arrow-right" />
                </button>
            </div>
        </div>
    );
});

