import React from "react";
import type { User } from "../../types/profile.types";

interface ProviderRowProps {
    provider: User;
    onView: (provider: User) => void;
    onToggleStatus: (id: string, status: string) => void;
}

const ProviderRow = React.memo<ProviderRowProps>(({ provider, onView, onToggleStatus }) => {
    const profile = provider.provider_profile;
    const kycStatus = profile?.kyc_status || 'NOT_SUBMITTED';

    return (
        <tr style={provider.status === "BLOCKED" ? { backgroundColor: "rgba(239, 68, 68, 0.03)" } : {}}>
            <td>
                <div className="provider-info-cell flex items-center gap-2">
                    <img
                        src={profile?.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=6B7C98&color=fff`}
                        className="avatar avatar-sm rounded-full"
                        alt={provider.name}
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                    />
                    <div>
                        <div className="font-medium text-text">{provider.name}</div>
                        <div className="text-xs text-secondary">{profile?.business_name || 'Individual Provider'}</div>
                    </div>
                </div>
            </td>
            <td>{provider.email}</td>
            <td>{provider.phone || 'N/A'}</td>
            <td>
                <span className="font-medium text-text">
                    {profile?.completed_jobs ?? 0} jobs
                </span>
            </td>
            <td>
                <span className={`badge ${
                    kycStatus === 'APPROVED' ? 'badge-verified' : 
                    kycStatus === 'PENDING' ? 'badge-pending' : 
                    kycStatus === 'REJECTED' ? 'badge-danger-alert' : 
                    'badge-secondary'
                }`}>
                    <i className={`fas ${
                        kycStatus === 'APPROVED' ? 'fa-check-circle mr-1' :
                        kycStatus === 'PENDING' ? 'fa-clock mr-1' :
                        kycStatus === 'REJECTED' ? 'fa-times-circle mr-1' :
                        'fa-circle mr-1'
                    }`}></i>
                    {kycStatus === 'APPROVED' ? 'Verified' :
                     kycStatus === 'PENDING' ? 'In Review' :
                     kycStatus === 'REJECTED' ? 'Rejected' :
                     'Not Submitted'}
                </span>
            </td>
            <td>
                <span className={`badge ${provider.status === 'ACTIVE' ? 'badge-verified' : provider.status === 'BLOCKED' ? 'badge-danger-alert' : 'badge-pending'}`}>
                    {provider.status === 'ACTIVE' ? 'Active' : provider.status === 'BLOCKED' ? 'Suspended' : provider.status}
                </span>
            </td>
            <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <button className="btn btn-secondary text-xs py-1 px-2" onClick={() => onView(provider)}>View</button>
                    <button onClick={() => onToggleStatus(provider.id, provider.status)} className={`btn text-xs py-1 px-2 ${provider.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'}`}>
                        {provider.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default ProviderRow;
