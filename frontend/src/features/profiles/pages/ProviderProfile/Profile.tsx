import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { ImageCropModal } from '../../../../shared/components/ui/ImageCropModal/ImageCropModal';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useUpdateProfileImage } from '../../hooks/provider/useUpdateProfileImage';
import { useDeleteProfileImage } from '../../hooks/provider/useDeleteProfileImage';
import { useGetProviderServices } from '../../../service-catalog';
import { useGetProviderVerifications } from '../../../verification/hooks/mutations/useVerification';
import { getAddresses, type Address } from '../../../addresses';
import type { PopulatedProviderService, ProviderProfile } from '../../types/profile.types';
import type { response } from '../../../../shared/types/Dtos';
import type { VerificationDocument } from '../../../verification/types/kyc.types';
import './Profile.css';

const formatDocType = (type: string): string =>
  type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const providerProfile = profile as ProviderProfile | null;

  const [profileImage, setProfileImage] = useState<string | null>(providerProfile?.profile_image || null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [services, setServices] = useState<PopulatedProviderService[]>([]);
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [address, setAddress] = useState<Address | null>(
    user?.current_address_id && typeof user.current_address_id === 'object'
      ? (user.current_address_id as Address)
      : null
  );

  const { mutate: updateProfileImage, isPending: isImageUploading } = useUpdateProfileImage();
  const { mutate: deleteProfileImage, isPending: isImageDeleting } = useDeleteProfileImage();
  const getProviderServices = useGetProviderServices();
  const getProviderVerifications = useGetProviderVerifications();

  useEffect(() => {
    if (!user || !profile) {
      fetchUser();
    }
  }, [user, profile, fetchUser]);

  useEffect(() => {
    getProviderServices.mutate(undefined, {
      onSuccess: (res) => {
        if (res.data) {
          setServices(res.data);
        }
      }
    });

    getProviderVerifications.mutate(undefined, {
      onSuccess: (res: response<VerificationDocument[]>) => {
        if (res.data) {
          setDocuments(res.data);
        }
      }
    });

    if (!address) {
      getAddresses({ page: 1, limit: 5, search: '' })
        .then((res: response<{ addresses: Address[]; total: number; totalPages: number }>) => {
          if (res.data?.addresses && res.data.addresses.length > 0) {
            setAddress(res.data.addresses[0]);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (user?.current_address_id && typeof user.current_address_id === 'object') {
      setAddress(user.current_address_id as Address);
    }
  }, [user?.current_address_id]);

  useEffect(() => {
    if (providerProfile?.profile_image) {
      setProfileImage(providerProfile.profile_image);
    } else {
      setProfileImage(null);
    }
  }, [providerProfile?.profile_image]);

  const handleCropComplete = (croppedFile: File) => {
    updateProfileImage(croppedFile, {
      onSuccess: (res) => {
        setIsImageModalOpen(false);
        setProfileImage(res.data?.profile_image || null);
        fetchUser();
        toast.success(res.message || 'Profile image updated successfully!');
      }
    });
  };

  const handleDeleteImage = () => {
    deleteProfileImage(profileImage || undefined, {
      onSuccess: (res) => {
        setIsImageModalOpen(false);
        setProfileImage(null);
        fetchUser();
        toast.success(res.message || 'Profile image deleted successfully!');
      }
    });
  };

  const joinedDate = (() => {
    const rawDate = user?.created_at || providerProfile?.created_at;
    if (!rawDate) return 'Jan 2025';
    try {
      const d = new Date(rawDate.toString());
      if (isNaN(d.getTime())) return 'Jan 2025';
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return 'Jan 2025';
    }
  })();

  const experienceText = (() => {
    if (providerProfile?.experience) {
      const exp = providerProfile.experience.trim();
      if (exp.toLowerCase().includes('year')) return exp;
      return `${exp} Experience`;
    }
    return 'Experience N/A';
  })();

  const displayName = user?.name || providerProfile?.business_name || 'Provider';
  const businessName =
    providerProfile?.business_name || (user?.name ? `${user.name} Services` : 'Provider Business');

  const avatarSrc = profileImage
    ? `${profileImage.startsWith('http') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}${profileImage}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366F1&color=fff&size=140`;

  const bioText =
    providerProfile?.bio ||
    'No professional bio provided yet. Update your business profile in Settings.';

  const hasIdentityApproved = documents.some((d) => d.document_type === 'IDENTITY' && d.status === 'APPROVED');
  const hasCertApproved = documents.some((d) => d.document_type === 'CERTIFICATE' && d.status === 'APPROVED');
  const bothKycApproved = hasIdentityApproved && hasCertApproved;
  const allDocsRejected = documents.length > 0 && documents.every((d) => d.status === 'REJECTED');

  const kycStatus = documents.length === 0
    ? (providerProfile?.kyc_status || 'NOT_SUBMITTED')
    : bothKycApproved
    ? 'APPROVED'
    : allDocsRejected
    ? 'REJECTED'
    : 'PENDING';

  const isAllVerified = Boolean(
    user?.email_verified &&
    user?.phone_verified &&
    Boolean(address) &&
    kycStatus === 'APPROVED' &&
    (documents.length === 0 || bothKycApproved)
  );

  return (
    <>
      <SpinnerOverlay isLoading={isImageUploading || isImageDeleting} />

      <div className="profile-premium-wrapper">
        <div className="profile-banner flex items-start justify-end p-4">
          
        </div>

        <div className="profile-content-grid">
          <div className="flex flex-col gap-6 w-full">
            <div className="profile-card-modern w-full">
              <div className="floating-avatar">
                <img
                  src={avatarSrc}
                  alt={displayName}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366F1&color=fff&size=140`;
                  }}
                />
                <button
                  type="button"
                  className="avatar-edit-badge"
                  title="Change Photo"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <i className="fas fa-camera"></i>
                </button>
              </div>

              <h2 className="h4 mb-1">{displayName}</h2>
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {providerProfile?.service_radius_km ? (
                  <span className="badge badge-primary text-xs">
                    <i className="fas fa-map-marker-alt mr-1"></i> {providerProfile.service_radius_km} km Radius
                  </span>
                ) : null}
              </div>
              <p className="text-secondary text-xs">
                {businessName} &bull; Joined <strong>{joinedDate}</strong>
              </p>

              <div className="profile-stats-modern">
                <div className="stat-box">
                  <span className="stat-value">{providerProfile?.completed_jobs ?? 0}</span>
                  <span className="stat-label">
                    <i className="fas fa-briefcase text-primary mr-1"></i> Jobs
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-value text-warning">5.0</span>
                  <span className="stat-label">
                    <i className="fas fa-star text-warning mr-1"></i> Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h6 mb-0">Verification Badges</h3>
                <span className={`badge ${isAllVerified ? 'badge-success' : 'badge-warning'} text-xs font-semibold px-2 py-0.5`}>
                  {isAllVerified ? 'All Verified' : 'In Progress'}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <i
                    className={`fas ${user?.email_verified ? 'fa-check-circle text-success' : 'fa-clock text-warning'} text-lg mt-0.5`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm text-text truncate">
                        {user?.email || 'Email Address'}
                      </div>
                      <span className={`badge ${user?.email_verified ? 'badge-success' : 'badge-warning'} text-2xs uppercase px-2 py-0.5`}>
                        {user?.email_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      {user?.email_verified ? 'Email address verified' : 'Verification pending'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i
                    className={`fas ${user?.phone_verified ? 'fa-check-circle text-success' : 'fa-clock text-warning'} text-lg mt-0.5`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm text-text truncate">
                        {user?.phone ? user.phone : 'Phone Number'}
                      </div>
                      <span className={`badge ${user?.phone_verified ? 'badge-success' : 'badge-warning'} text-2xs uppercase px-2 py-0.5`}>
                        {user?.phone_verified ? 'Verified' : user?.phone ? 'Pending' : 'Not Added'}
                      </span>
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      {user?.phone_verified
                        ? 'Phone number verified'
                        : user?.phone
                        ? 'Verification pending'
                        : 'No phone number provided'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i
                    className={`fas ${address ? 'fa-check-circle text-success' : 'fa-clock text-warning'} text-lg mt-0.5`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm text-text truncate">
                        {address
                          ? [address.area, address.city, address.state].filter(Boolean).join(', ')
                          : 'Operating Address'}
                      </div>
                      <span className={`badge ${address ? 'badge-success' : 'badge-warning'} text-2xs uppercase px-2 py-0.5`}>
                        {address ? 'Verified' : 'Action Required'}
                      </span>
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      {address
                        ? address.pincode ? `Postal Code: ${address.pincode}` : 'Operational base registered'
                        : 'No default address configured'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i
                    className={`fas ${
                      kycStatus === 'APPROVED'
                        ? 'fa-check-circle text-success'
                        : kycStatus === 'REJECTED'
                        ? 'fa-times-circle text-danger'
                        : kycStatus === 'PENDING'
                        ? 'fa-clock text-warning'
                        : 'fa-shield-alt text-secondary'
                    } text-lg mt-0.5`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm text-text truncate">
                        KYC & Identity Verification
                      </div>
                      <span
                        className={`badge ${
                          kycStatus === 'APPROVED'
                            ? 'badge-success'
                            : kycStatus === 'REJECTED'
                            ? 'badge-danger'
                            : kycStatus === 'PENDING'
                            ? 'badge-warning'
                            : 'badge-neutral'
                        } text-2xs uppercase px-2 py-0.5`}
                      >
                        {kycStatus === 'APPROVED'
                          ? 'Approved'
                          : kycStatus === 'REJECTED'
                          ? 'Rejected'
                          : kycStatus === 'PENDING'
                          ? 'In Review'
                          : 'Not Submitted'}
                      </span>
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      {kycStatus === 'APPROVED'
                        ? 'Government & professional identity verified'
                        : kycStatus === 'REJECTED'
                        ? 'Documents rejected, update required'
                        : kycStatus === 'PENDING'
                        ? 'Submitted credentials under admin review'
                        : 'Submit verification documents to get verified badge'}
                    </div>
                  </div>
                </div>

                {documents.length > 0 && (
                  <div className="mt-1 pt-3 border-t border-surface-variant flex flex-col gap-2.5">
                    <span className="text-2xs font-semibold text-secondary uppercase tracking-wider">
                      Submitted Documents ({documents.length})
                    </span>
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-surface border border-border">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <i className="fas fa-file-contract text-primary text-xs shrink-0"></i>
                          <div className="truncate">
                            <span className="text-xs font-medium text-text block truncate">
                              {doc.document_name}
                            </span>
                            <span className="text-2xs text-secondary block truncate">
                              {formatDocType(doc.document_type)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`badge ${
                            doc.status === 'APPROVED'
                              ? 'badge-success'
                              : doc.status === 'REJECTED'
                              ? 'badge-danger'
                              : 'badge-warning'
                          } text-2xs uppercase px-2 py-0.5 shrink-0`}
                        >
                          {doc.status === 'APPROVED' ? 'Verified' : doc.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {kycStatus !== 'APPROVED' && (
                  <Link
                    to="/provider/verification"
                    className="btn btn-outline btn-sm w-full mt-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-shield-alt text-primary"></i>
                    <span>{documents.length > 0 ? 'Manage Verification Documents' : 'Submit KYC Documents'}</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h6 mb-0">Marketplace Track Record</h3>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-warning">5.0</div>
                <div className="text-warning text-sm mt-1 mb-1">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <div className="font-bold text-text text-sm">Provider Rating</div>
                <p className="text-xs text-secondary mt-1 mb-0">
                  {address?.city ? `Operational in ${address.city}` : 'Marketplace Verified Provider'}
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-surface-variant pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Job Completion Rate</span>
                  <span className="text-sm font-bold text-success">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">On-Time Arrival</span>
                  <span className="text-sm font-bold text-success">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Service Quality</span>
                  <span className="text-sm font-bold text-warning">Verified</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-main-content flex flex-col gap-6">
            <div className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <i className="fas fa-user-cog"></i>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">Want to edit your profile?</div>
                  <div className="text-xs text-secondary">If you want to edit your profile details, business name, bio, or working availability, visit <Link to="/provider/settings" className="text-primary font-medium hover:underline">Settings</Link>.</div>
                </div>
              </div>
              <Link to="/provider/settings" className="btn btn-outline btn-sm">
                <i className="fas fa-cog mr-1"></i> Visit Settings
              </Link>
            </div>

            <div className="form-card-modern">
              <div className="flex justify-between items-center mb-4 pb-4 border-bottom">
                <div>
                  <h3 className="h4 mb-0">About &amp; Trade Background</h3>
                  <span className="badge badge-primary text-xs mt-2">{experienceText}</span>
                </div>
              </div>
              <p className="text-sm text-secondary leading-relaxed m-0 mt-2">{bioText}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-4 bg-surface-hover p-4 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-text">
                      {kycStatus === 'APPROVED' ? 'Verified Credentials' : 'Identity Verification'}
                    </h4>
                    <p className="text-xs text-secondary mb-0">
                      {kycStatus === 'APPROVED' ? 'KYC Compliance Approved' : 'Verification In Progress'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-surface-hover p-4 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-text">Service Region</h4>
                    <p className="text-xs text-secondary mb-0">
                      {address?.city ? `${address.city} Region` : 'Operational Region'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card-modern">
              <div className="flex justify-between items-center mb-6 pb-4 border-bottom">
                <h3 className="h4 mb-0">Active Service Categories</h3>
              </div>
              <div className="flex flex-col gap-3">
                {services.length > 0 ? (
                  services.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-border bg-surface-hover flex items-center justify-between transition-all hover:border-primary"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl shrink-0">
                          <i className="fas fa-tools"></i>
                        </div>
                        <div className="font-bold text-text">
                          {item.service?.name || 'Service'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-secondary text-sm py-4 text-center">
                    No active services found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageCropModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentImageUrl={
          profileImage
            ? `${profileImage.startsWith('http') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}${profileImage}`
            : null
        }
        onCropCompleteAction={handleCropComplete}
        onDeleteAction={handleDeleteImage}
        isLoading={isImageUploading || isImageDeleting}
      />
    </>
  );
}
