import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { ImageCropModal } from '../../../../shared/components/ui/ImageCropModal/ImageCropModal';
import { useUpdateProfileImage } from '../../hooks/provider/useUpdateProfileImage';
import { useDeleteProfileImage } from '../../hooks/provider/useDeleteProfileImage';
import { useGetProviderServices } from '../../../service-catalog';
import { useGetProviderVerifications } from '../../../verification/hooks/mutations/useVerification';
import { useProviderReviewsQuery } from '../../../reviews';
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

const getServiceImageUrl = (image?: string | null, catImage?: string | null): string | null => {
  const target = image || catImage;
  if (!target) return null;
  if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('blob:')) {
    return target;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase.replace(/\/$/, '')}/${target.replace(/^\//, '')}`;
};

const getCategoryIcon = (categoryName?: string): string => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('plumb')) return 'fa-faucet';
  if (name.includes('electr')) return 'fa-bolt';
  if (name.includes('clean')) return 'fa-broom';
  if (name.includes('paint')) return 'fa-paint-roller';
  if (name.includes('carpenter') || name.includes('wood')) return 'fa-hammer';
  if (name.includes('appliance') || name.includes('ac') || name.includes('repair')) return 'fa-tools';
  if (name.includes('garden') || name.includes('lawn')) return 'fa-leaf';
  if (name.includes('pest')) return 'fa-bug';
  if (name.includes('auto') || name.includes('mechanic')) return 'fa-car';
  return 'fa-wrench';
};

function ProfileServiceCard({ item }: { item: PopulatedProviderService }) {
  const [imgError, setImgError] = useState(false);
  const serviceName = item.service?.name || 'Service';
  const categoryName = item.service?.category?.name || 'Trade Category';
  const description = item.service?.description || 'Professional service delivered by verified trade specialist.';
  const rawImageUrl = item.service?.image || item.service?.category?.image;
  const imageUrl = useMemo(() => getServiceImageUrl(rawImageUrl), [rawImageUrl]);
  const iconClass = useMemo(() => getCategoryIcon(categoryName), [categoryName]);
  const hasValidImage = Boolean(imageUrl && !imgError);

  return (
    <div className="profile-service-card">
      <div className="profile-service-card-media">
        {hasValidImage ? (
          <img
            src={imageUrl!}
            alt={serviceName}
            onError={() => setImgError(true)}
            className="profile-service-card-img"
            loading="lazy"
          />
        ) : (
          <div className="profile-service-card-placeholder">
            <div className="profile-service-placeholder-icon">
              <i className={`fas ${iconClass}`}></i>
            </div>
          </div>
        )}
        <div className="profile-service-media-overlay" />
        <span className="profile-service-category-badge" title={categoryName}>
          {categoryName}
        </span>
        <span className="profile-service-status-pill">
          <i className="fas fa-check-circle mr-1"></i> Active
        </span>
      </div>

      <div className="profile-service-card-body">
        <h4 className="profile-service-card-title" title={serviceName}>
          {serviceName}
        </h4>
        <p className="profile-service-card-desc" title={description}>
          {description}
        </p>
      </div>
    </div>
  );
}

function ProfileServiceCardSkeleton() {
  return (
    <div className="profile-service-card" aria-hidden="true">
      <div className="profile-service-card-media profile-service-skeleton-media">
        <Skeleton width="100%" height="100%" borderRadius={0} />
      </div>
      <div className="profile-service-card-body">
        <Skeleton width="65%" height={18} borderRadius={4} />
        <div className="w-full flex flex-col items-center gap-1.5 mt-1">
          <Skeleton width="90%" height={12} borderRadius={4} />
          <Skeleton width="70%" height={12} borderRadius={4} />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const providerProfile = profile as ProviderProfile | null;

  const [profileImage, setProfileImage] = useState<string | null>(providerProfile?.profile_image || null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [services, setServices] = useState<PopulatedProviderService[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [address, setAddress] = useState<Address | null>(
    user?.current_address_id && typeof user.current_address_id === 'object'
      ? (user.current_address_id as Address)
      : null
  );

  const { mutate: updateProfileImage, isPending: isImageUploading } = useUpdateProfileImage();
  const { mutate: deleteProfileImage, isPending: isImageDeleting } = useDeleteProfileImage();
  const { data: providerServicesRes, isLoading: isLoadingServices } = useGetProviderServices();
  const { data: verificationsRes } = useGetProviderVerifications();
  const { data: reviewsSummaryRes, isLoading: isLoadingReviews } = useProviderReviewsQuery(
    providerProfile?.id,
    { page: 1, limit: 12 }
  );

  const groupedServices = useMemo(() => {
    const groups = new Map<string, PopulatedProviderService[]>();
    for (const item of services) {
      const catName = item.service?.category?.name?.trim() || 'Other Services';
      const existing = groups.get(catName);
      if (existing) {
        existing.push(item);
      } else {
        groups.set(catName, [item]);
      }
    }
    return Array.from(groups.entries()).map(([categoryName, items]) => ({
      categoryName,
      items
    }));
  }, [services]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const averageRating = reviewsSummaryRes?.data?.averageRating ?? 0;
  const totalReviews = reviewsSummaryRes?.data?.totalReviews ?? 0;
  const bestReviews = useMemo(() => {
    const list = reviewsSummaryRes?.data?.reviews || [];
    return [...list]
      .sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [reviewsSummaryRes?.data?.reviews]);

  useEffect(() => {
    if (!user || !profile) {
      fetchUser();
    }
  }, [user, profile, fetchUser]);

  useEffect(() => {
    if (providerServicesRes?.data) {
      setServices(providerServicesRes.data);
    }
  }, [providerServicesRes]);

  useEffect(() => {
    if (verificationsRes?.data) {
      setDocuments(verificationsRes.data);
    }
  }, [verificationsRes]);

  useEffect(() => {
    if (!address) {
      getAddresses({ page: 1, limit: 5, search: '' })
        .then((res: response<{ addresses: Address[]; total: number; totalPages: number }>) => {
          if (res.data?.addresses && res.data.addresses.length > 0) {
            setAddress(res.data.addresses[0]);
          }
        })
        .catch(() => { });
    }
  }, [address]);

  useEffect(() => {
    (() => {
      if (user?.current_address_id && typeof user.current_address_id === 'object') {
        setAddress(user.current_address_id as Address);
      }
    })()
  }, [user?.current_address_id]);

  useEffect(() => {
    (() => {
      if (providerProfile?.profile_image) {
        setProfileImage(providerProfile.profile_image);
      } else {
        setProfileImage(null);
      }
    })()
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

  const verifiedCount = [
    Boolean(user?.email_verified),
    Boolean(user?.phone_verified),
    Boolean(address),
    kycStatus === 'APPROVED'
  ].filter(Boolean).length;

  return (
    <>
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
                  <span className="stat-value text-warning">
                    {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
                  </span>
                  <span className="stat-label">
                    <i className="fas fa-star text-warning mr-1"></i> Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="verification-badge-card">
              <div className="verification-card-header">
                <div className="verification-card-title-group">
                  <div className="verification-card-shield">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <h3 className="verification-card-title">Verification Badges</h3>
                    <p className="verification-item-subtext">Security & trust credentials</p>
                  </div>
                </div>
                <span className={`verification-card-overall-badge ${isAllVerified ? 'complete' : 'progress'}`}>
                  <i className={`fas ${isAllVerified ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  {verifiedCount}/4 Verified
                </span>
              </div>

              <div className="verification-items-list">
                <div className="verification-item-row">
                  <div className="verification-item-left">
                    <div className={`verification-item-icon-box ${user?.email_verified ? 'verified' : 'pending'}`}>
                      <i className={`fas ${user?.email_verified ? 'fa-envelope-open-text' : 'fa-envelope'}`}></i>
                    </div>
                    <div className="verification-item-text">
                      <span className="verification-item-label">Email</span>
                    </div>
                  </div>
                  <div
                    className={`verification-checkbox ${user?.email_verified ? 'checked' : 'pending'}`}
                    title={user?.email_verified ? 'Email Verified' : 'Email Pending'}
                  >
                    {user?.email_verified ? (
                      <i className="fas fa-check text-white"></i>
                    ) : (
                      <i className="fas fa-clock text-2xs"></i>
                    )}
                  </div>
                </div>

                <div className="verification-item-row">
                  <div className="verification-item-left">
                    <div className={`verification-item-icon-box ${user?.phone_verified ? 'verified' : user?.phone ? 'pending' : 'empty'}`}>
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="verification-item-text">
                      <span className="verification-item-label">Phone</span>
                    </div>
                  </div>
                  <div
                    className={`verification-checkbox ${user?.phone_verified ? 'checked' : user?.phone ? 'pending' : 'unchecked'}`}
                    title={user?.phone_verified ? 'Phone Verified' : user?.phone ? 'OTP Pending' : 'Phone Not Added'}
                  >
                    {user?.phone_verified ? (
                      <i className="fas fa-check text-white"></i>
                    ) : user?.phone ? (
                      <i className="fas fa-clock text-2xs"></i>
                    ) : null}
                  </div>
                </div>

                <div className="verification-item-row">
                  <div className="verification-item-left">
                    <div className={`verification-item-icon-box ${address ? 'verified' : 'empty'}`}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="verification-item-text">
                      <span className="verification-item-label">Address</span>
                    </div>
                  </div>
                  <div
                    className={`verification-checkbox ${address ? 'checked' : 'unchecked'}`}
                    title={address ? 'Address Verified' : 'Address Not Configured'}
                  >
                    {address ? (
                      <i className="fas fa-check text-white"></i>
                    ) : null}
                  </div>
                </div>

                <div className="verification-item-row">
                  <div className="verification-item-left">
                    <div className={`verification-item-icon-box ${kycStatus === 'APPROVED' ? 'verified' : kycStatus === 'REJECTED' ? 'rejected' : kycStatus === 'PENDING' ? 'pending' : 'empty'
                      }`}>
                      <i className="fas fa-id-card"></i>
                    </div>
                    <div className="verification-item-text">
                      <span className="verification-item-label">KYC</span>
                    </div>
                  </div>
                  <div
                    className={`verification-checkbox ${kycStatus === 'APPROVED' ? 'checked' : kycStatus === 'REJECTED' ? 'rejected' : kycStatus === 'PENDING' ? 'pending' : 'unchecked'
                      }`}
                    title={
                      kycStatus === 'APPROVED'
                        ? 'KYC Verified'
                        : kycStatus === 'REJECTED'
                          ? 'KYC Rejected'
                          : kycStatus === 'PENDING'
                            ? 'KYC In Review'
                            : 'KYC Not Submitted'
                    }
                  >
                    {kycStatus === 'APPROVED' ? (
                      <i className="fas fa-check text-white"></i>
                    ) : kycStatus === 'REJECTED' ? (
                      <i className="fas fa-times text-white text-xs"></i>
                    ) : kycStatus === 'PENDING' ? (
                      <i className="fas fa-clock text-2xs"></i>
                    ) : null}
                  </div>
                </div>
              </div>

              {documents.length > 0 && (
                <div className="verification-docs-box">
                  <div className="verification-docs-title">
                    Submitted Documents ({documents.length})
                  </div>
                  {documents.map((doc) => (
                    <div key={doc.id} className="verification-doc-item">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <i className="fas fa-file-contract text-primary text-xs shrink-0"></i>
                        <div className="truncate">
                          <span className="text-xs font-semibold text-text block truncate">
                            {doc.document_name}
                          </span>
                          <span className="text-2xs text-secondary block truncate">
                            {formatDocType(doc.document_type)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`verification-checkbox ${doc.status === 'APPROVED' ? 'checked' : doc.status === 'REJECTED' ? 'rejected' : 'pending'
                          }`}
                        style={{ width: '22px', height: '22px', minWidth: '22px', borderRadius: '6px', fontSize: '0.7rem' }}
                        title={doc.status === 'APPROVED' ? 'Verified' : doc.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                      >
                        {doc.status === 'APPROVED' ? (
                          <i className="fas fa-check text-white"></i>
                        ) : doc.status === 'REJECTED' ? (
                          <i className="fas fa-times text-white text-2xs"></i>
                        ) : (
                          <i className="fas fa-clock text-2xs"></i>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {kycStatus !== 'APPROVED' && (
                <Link to="/provider/verification" className="verification-btn-action">
                  <i className="fas fa-shield-alt"></i> Complete Verifications
                </Link>
              )}
            </div>

            <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h6 mb-0">Marketplace Track Record</h3>
                <Link to="/provider/reviews" className="text-xs font-semibold text-primary hover:underline">
                  View All Reviews
                </Link>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-warning">
                  {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
                </div>
                <div className="text-warning text-sm mt-1 mb-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={
                        totalReviews > 0 && averageRating >= star - 0.25
                          ? 'fas fa-star'
                          : 'far fa-star opacity-40'
                      }
                    ></i>
                  ))}
                </div>
                <div className="font-bold text-text text-sm">
                  {totalReviews > 0
                    ? `${totalReviews} Customer Review${totalReviews === 1 ? '' : 's'}`
                    : 'No reviews yet'}
                </div>
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
              <div className="flex justify-between items-center mb-6 pb-4 border-bottom flex-wrap gap-2">
                <div>
                  <h3 className="h4 mb-0">Business &amp; Profile Details</h3>
                </div>
                <span className="badge badge-primary text-xs font-semibold px-2.5 py-1">
                  {experienceText}
                </span>
              </div>

              <div className="profile-fields-grid">
                <div className="modern-input-group">
                  <label>Business Name</label>
                  <div className="form-control-static">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <i className="fas fa-store text-primary text-sm"></i>
                      <span className="truncate">{businessName}</span>
                    </span>
                    <i className="fas fa-lock text-secondary text-xs opacity-50" title="Non-editable"></i>
                  </div>
                </div>

                <div className="modern-input-group">
                  <label>Email Address</label>
                  <div className="form-control-static">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <i className="fas fa-envelope text-primary text-sm"></i>
                      <span className="truncate">{user?.email || "Not provided"}</span>
                    </span>
                    {user?.email_verified ? (
                      <span className="badge badge-success text-2xs uppercase px-2 py-0.5">Verified</span>
                    ) : (
                      <i className="fas fa-lock text-secondary text-xs opacity-50" title="Non-editable"></i>
                    )}
                  </div>
                </div>

                <div className="modern-input-group">
                  <label>Mobile Number</label>
                  <div className="form-control-static">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <i className="fas fa-phone-alt text-primary text-sm"></i>
                      <span className="truncate">{user?.phone || "Not provided"}</span>
                    </span>
                    {user?.phone_verified ? (
                      <span className="badge badge-success text-2xs uppercase px-2 py-0.5">Verified</span>
                    ) : (
                      <i className="fas fa-lock text-secondary text-xs opacity-50" title="Non-editable"></i>
                    )}
                  </div>
                </div>

                <div className="modern-input-group">
                  <label>Service Region</label>
                  <div className="form-control-static">
                    <span className="flex items-center gap-2 truncate font-medium">
                      <i className="fas fa-map-marker-alt text-primary text-sm"></i>
                      <span className="truncate">{address?.city ? `${address.city}, ${address.state || ""}` : (address?.area || "Operational Region")}</span>
                    </span>
                    {providerProfile?.service_radius_km ? (
                      <span className="badge badge-primary text-2xs px-2 py-0.5">{providerProfile.service_radius_km} km</span>
                    ) : (
                      <i className="fas fa-lock text-secondary text-xs opacity-50" title="Non-editable"></i>
                    )}
                  </div>
                </div>
              </div>

              <div className="modern-input-group mb-0">
                <label>Description &amp; About</label>
                <div className="form-control-static form-control-static-bio">
                  <p className="text-sm text-text leading-relaxed m-0">{bioText}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-border">
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
              <div className="flex justify-between items-center mb-6 pb-4 border-bottom flex-wrap gap-2">
                <div>
                  <h3 className="h4 mb-0">Services Offered</h3>
                </div>
                <div className="flex items-center gap-2">
                  {isLoadingServices ? (
                    <Skeleton width={80} height={24} borderRadius={9999} />
                  ) : (
                    <>
                      <span className="badge badge-primary text-xs font-semibold px-2.5 py-1">
                        {services.length} {services.length === 1 ? 'Service' : 'Services'}
                      </span>
                      <Link to="/provider/settings" state={{ activeSection: 'services' }} className="btn btn-outline btn-xs">
                        <i className="fas fa-sliders-h mr-1"></i> Manage
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {isLoadingServices ? (
                <div className="profile-services-grid">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <ProfileServiceCardSkeleton key={`service-skeleton-${index}`} />
                  ))}
                </div>
              ) : groupedServices.length > 0 ? (
                <div className="profile-cat-accordion-list">
                  {groupedServices.map((group) => {
                    const isOpen = Boolean(expandedCategories[group.categoryName]);
                    const iconClass = getCategoryIcon(group.categoryName);
                    return (
                      <div key={group.categoryName} className={`profile-cat-accordion ${isOpen ? 'is-open' : ''}`}>
                        <button
                          type="button"
                          className="profile-cat-accordion-trigger"
                          onClick={() => toggleCategory(group.categoryName)}
                          aria-expanded={isOpen}
                        >
                          <div className="profile-cat-accordion-left">
                            <div className="profile-cat-accordion-icon">
                              <i className={`fas ${iconClass}`}></i>
                            </div>
                            <div className="profile-cat-accordion-meta">
                              <span className="profile-cat-accordion-name">{group.categoryName}</span>
                              <span className="profile-cat-accordion-count">
                                {group.items.length} {group.items.length === 1 ? 'service' : 'services'}
                              </span>
                            </div>
                          </div>
                          <i className={`fas fa-chevron-down profile-cat-accordion-chevron ${isOpen ? 'rotate' : ''}`}></i>
                        </button>
                        <div className={`profile-cat-accordion-collapse ${isOpen ? 'is-open' : ''}`}>
                          <div className="profile-cat-accordion-inner">
                            <div className="profile-cat-accordion-body">
                              <div className="profile-services-grid">
                                {group.items.map((item) => (
                                  <ProfileServiceCard key={item.id} item={item} />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="profile-services-empty-state">
                  <img
                    src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
                    alt="No data found"
                    className="profile-services-empty-img"
                  />
                  <h4 className="profile-services-empty-title">No Active Services Added</h4>
                  <p className="profile-services-empty-desc">
                    Add the trade services and skill categories you specialize in to start receiving leads from customers.
                  </p>
                  <Link to="/provider/settings" state={{ activeSection: 'services' }} className="btn btn-primary btn-sm">
                    <i className="fas fa-plus mr-1.5"></i> Manage Services in Settings
                  </Link>
                </div>
              )}
            </div>

            <div className="form-card-modern">
              <div className="flex justify-between items-center mb-6 pb-4 border-bottom flex-wrap gap-2">
                <div>
                  <h3 className="h4 mb-0">Top Customer Reviews</h3>
                </div>
                <div className="flex items-center gap-2">
                  {totalReviews > 0 && (
                    <span className="badge badge-warning text-xs font-semibold px-2.5 py-1">
                      <i className="fas fa-star mr-1"></i>
                      {averageRating.toFixed(1)} ({totalReviews})
                    </span>
                  )}
                  <Link to="/provider/reviews" className="btn btn-outline btn-xs">
                    View All Reviews
                  </Link>
                </div>
              </div>

              {isLoadingReviews ? (
                <div className="profile-best-reviews-grid">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <div key={`rev-skel-${idx}`} className="profile-best-review-card">
                      <div className="flex items-center gap-3 mb-3">
                        <Skeleton circle width={38} height={38} />
                        <div className="flex-1">
                          <Skeleton width="55%" height={14} />
                          <Skeleton width="35%" height={11} />
                        </div>
                      </div>
                      <Skeleton width="40%" height={14} className="mb-2" />
                      <Skeleton count={2} height={12} />
                    </div>
                  ))}
                </div>
              ) : bestReviews.length > 0 ? (
                <>
                  <div className="profile-best-reviews-grid">
                    {bestReviews.map((review) => {
                      const customerName = review.customerName || 'Customer';
                      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=0f172a&color=fff&size=120&bold=true`;
                      return (
                        <div key={review.id} className="profile-modern-review-card">
                          <div className="profile-modern-review-top">
                            <img
                              src={review.customerAvatar || fallbackAvatar}
                              alt={customerName}
                              className="profile-modern-review-avatar"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
                              }}
                            />
                            <div className="profile-modern-review-meta">
                              <div className="profile-modern-review-name" title={customerName}>
                                {customerName}
                              </div>
                              <div className="profile-modern-review-rating">
                                <span className="profile-modern-review-score">
                                  {review.rating.toFixed(1)}
                                </span>
                                <div className="profile-modern-review-stars">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`fa${star <= Math.round(review.rating) ? 's' : 'r'} fa-star`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <i className="fas fa-quote-right profile-modern-review-quote" aria-hidden="true" />
                          </div>
                          <p className="profile-modern-review-text" title={review.comment}>
                            {review.comment}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="profile-best-reviews-footer">
                    <Link to="/provider/reviews" className="btn btn-outline btn-sm">
                      <span>View All Reviews</span>
                      <i className="fas fa-arrow-right ml-1.5"></i>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="profile-services-empty-state">
                  <img
                    src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
                    alt="No reviews yet"
                    className="profile-services-empty-img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/no-data.png';
                    }}
                  />
                  <h4 className="profile-services-empty-title">No Customer Reviews Yet</h4>
                  <p className="profile-services-empty-desc">
                    Your highest-rated customer reviews will be highlighted here once customers rate completed bookings.
                  </p>
                </div>
              )}
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
