import React from 'react';
import type { User } from '../../../../shared/types/Dtos';
import type { Address } from '../../../../shared/Dtos/address';

interface ProviderDetailsModalProps {
    provider: User | null;
    onClose: () => void;
}

export const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = React.memo(({ provider, onClose }) => {
    if (!provider) return null;

    const profile = provider.provider_profile;
    const address = typeof provider.current_address_id === 'object' ? (provider.current_address_id as Address | null) : null;
    const isKycApproved = profile?.kyc_status === 'APPROVED';

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card fade-in" style={{ maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex items-center justify-between pb-4 border-bottom mb-4">
                    <h2 className="h5 mb-0">Provider Details</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-icon"
                        aria-label="Close"
                    >
                        <i className="fas fa-times" />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-5">
                    <img
                        src={profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=05AD98&color=fff&size=160&bold=true`}
                        alt={provider.name}
                        className="rounded-full object-cover"
                        style={{ width: '68px', height: '68px', border: '3px solid var(--border)' }}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="h6 mb-0 font-bold">{profile?.business_name || provider.name}</h3>
                            {isKycApproved && (
                                <span className="badge badge-success text-xs font-semibold">
                                    <i className="fas fa-check-circle mr-1" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-secondary mb-1">{provider.name}</p>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-secondary">
                                <i className="fas fa-briefcase text-primary mr-1" />
                                {profile?.experience || 'Experienced'}
                            </span>
                            <span>•</span>
                            <span className="text-secondary">
                                <i className="fas fa-check-circle text-success mr-1" />
                                {profile?.completed_jobs ?? 0} jobs completed
                            </span>
                        </div>
                    </div>
                </div>

                {profile?.bio && (
                    <div className="mb-4">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-1">About</label>
                        <p className="text-sm text-text leading-relaxed bg-surface p-3 rounded border">
                            {profile.bio}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-surface rounded border">
                        <span className="text-xs text-secondary block mb-1">
                            <i className="fas fa-map-marked-alt text-primary mr-1" />
                            Location
                        </span>
                        <span className="text-sm font-medium text-text">
                            {address ? `${address.area}, ${address.city}, ${address.state}` : 'Location on request'}
                        </span>
                    </div>

                    <div className="p-3 bg-surface rounded border">
                        <span className="text-xs text-secondary block mb-1">
                            <i className="fas fa-route text-primary mr-1" />
                            Service Coverage
                        </span>
                        <span className="text-sm font-medium text-text">
                            {profile?.service_radius_km ? `Within ${profile.service_radius_km} km` : 'Local Area'}
                        </span>
                    </div>

                    {provider.email && (
                        <div className="p-3 bg-surface rounded border">
                            <span className="text-xs text-secondary block mb-1">
                                <i className="fas fa-envelope text-primary mr-1" />
                                Email
                            </span>
                            <span className="text-sm font-medium text-text text-truncate block">
                                {provider.email}
                            </span>
                        </div>
                    )}

                    {provider.phone && (
                        <div className="p-3 bg-surface rounded border">
                            <span className="text-xs text-secondary block mb-1">
                                <i className="fas fa-phone text-primary mr-1" />
                                Contact
                            </span>
                            <span className="text-sm font-medium text-text">
                                {provider.phone}
                            </span>
                        </div>
                    )}
                </div>

                {profile?.skills && (
                    <div className="mb-5">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-2">Specializations</label>
                        <div className="flex flex-wrap gap-1.5">
                            {profile.skills.split(',').map((skill, idx) => (
                                <span key={idx} className="badge badge-secondary text-xs px-2.5 py-1">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-top">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary btn-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
});
