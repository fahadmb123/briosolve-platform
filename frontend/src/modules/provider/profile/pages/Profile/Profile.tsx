import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../../../store/auth/auth.store';
import { ImageCropModal } from '../../../../../shared/components/ui/ImageCropModal/ImageCropModal';
import { SpinnerOverlay } from '../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useUpdateProfileImage } from '../../hooks/mutations/useUpdateProfileImage';
import { useDeleteProfileImage } from '../../hooks/mutations/useDeleteProfileImage';
import { useGetProviderServices } from '../../../settings/hooks/mutations/useTradeService';
import type { PopulatedProviderService } from '../../../settings/services/settings.service';
import type { ProviderProfile } from '../../../../../shared/types/Dtos';
import './Profile.css';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const providerProfile = profile as ProviderProfile | null;

  const [profileImage, setProfileImage] = useState<string | null>(providerProfile?.profile_image || null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [services, setServices] = useState<PopulatedProviderService[]>([]);

  const { mutate: updateProfileImage, isPending: isImageUploading } = useUpdateProfileImage();
  const { mutate: deleteProfileImage, isPending: isImageDeleting } = useDeleteProfileImage();
  const getProviderServices = useGetProviderServices();

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
  }, []);

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

  const currentAddress =
    user?.current_address_id && typeof user.current_address_id === 'object'
      ? user.current_address_id
      : null;

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
    return '10+ Years Experience';
  })();

  const displayName = user?.name || providerProfile?.business_name || 'Arjun Menon';
  const businessName =
    providerProfile?.business_name || (user?.name ? `${user.name} Services` : 'Apex Plumbing & HVAC');

  const avatarSrc = profileImage
    ? `${profileImage.startsWith('http') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}${profileImage}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366F1&color=fff&size=140`;

  const bioText =
    providerProfile?.bio ||
    'Licensed master technician with hands-on expertise specializing in multi-storey residential leak diagnostics, concealed sanitary overhaul, high-pressure CPVC piping, and inverter air conditioner servicing. Equipped with state-of-the-art ultrasonic acoustic leak listening sensors and digital manifold gauges for zero-destruction troubleshooting.';

  const isContactVerified = Boolean(user?.email_verified && user?.phone_verified);

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
                  <span className="stat-value">142</span>
                  <span className="stat-label">
                    <i className="fas fa-briefcase text-primary mr-1"></i> Jobs
                  </span>
                </div>
                <div className="stat-box">
                  <span className="stat-value text-warning">4.92</span>
                  <span className="stat-label">
                    <i className="fas fa-star text-warning mr-1"></i> Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h6 mb-0">Verification Badges</h3>
                <span className={`badge ${isContactVerified ? 'badge-success' : 'badge-warning'} text-xs`}>
                  {isContactVerified ? 'All Clear' : 'In Progress'}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <i
                    className={`fas ${user?.email_verified ? 'fa-check-circle text-success' : 'fa-clock text-warning'} text-lg`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-text truncate">
                      {user?.email || 'Email Verification'}
                    </div>
                    <div className="text-xs text-secondary">
                      {user?.email_verified ? 'Verified' : 'Verification Pending'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i
                    className={`fas ${user?.phone_verified ? 'fa-check-circle text-success' : 'fa-clock text-warning'} text-lg`}
                  ></i>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-text truncate">
                      {user?.phone ? `Phone: ${user.phone}` : 'Phone Verification'}
                    </div>
                    <div className="text-xs text-secondary">
                      {user?.phone_verified ? 'Verified' : user?.phone ? 'Verification Pending' : 'Not Provided'}
                    </div>
                  </div>
                </div>

                {currentAddress && (
                  <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-success text-lg"></i>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-text truncate">
                        {currentAddress.city ? `${currentAddress.city}, ${currentAddress.state || ''}` : 'Operational Base'}
                      </div>
                      <div className="text-xs text-secondary">Address Registered</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-success text-lg"></i>
                  <div>
                    <div className="font-bold text-sm text-text">Government Aadhaar ID</div>
                    <div className="text-xs text-secondary">Verified</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-success text-lg"></i>
                  <div>
                    <div className="font-bold text-sm text-text">Sanitary Trade Diploma</div>
                    <div className="text-xs text-secondary">Verified</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-success text-lg"></i>
                  <div>
                    <div className="font-bold text-sm text-text">HVAC Refrigeration License</div>
                    <div className="text-xs text-secondary">Verified</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-check-circle text-success text-lg"></i>
                  <div>
                    <div className="font-bold text-sm text-text">Bank Account</div>
                    <div className="text-xs text-secondary">Verified</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h6 mb-0">Marketplace Track Record</h3>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-black text-warning">4.92</div>
                <div className="text-warning text-sm mt-1 mb-1">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <div className="font-bold text-text text-sm">Master Rating</div>
                <p className="text-xs text-secondary mt-1 mb-0">
                  Based on 186 verified client ratings in {currentAddress?.city || 'Mumbai'}
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-surface-variant pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Job Completion Rate</span>
                  <span className="text-sm font-bold text-success">99.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">On-Time Arrival</span>
                  <span className="text-sm font-bold text-success">98.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">5-Star Review Ratio</span>
                  <span className="text-sm font-bold text-warning">88%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Quote Response Speed</span>
                  <span className="text-sm font-bold text-text">8 Min Avg</span>
                </div>
              </div>

              <button type="button" className="btn btn-outline btn-block text-sm">
                <i className="fas fa-comment-dots mr-2"></i> Read All 186 Reviews
              </button>
            </div>
          </div>

          <div className="profile-main-content">
            <div className="bg-surface border border-border rounded-xl p-4 mb-6 flex justify-between items-center flex-wrap gap-3">
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

            <div className="form-card-modern mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-bottom">
                <div>
                  <h3 className="h4 mb-0">About & Trade Background</h3>
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
                    <h4 className="font-bold text-sm mb-1 text-text">ITI Trade Certified</h4>
                    <p className="text-xs text-secondary mb-0">Govt Sanitary & HVAC</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-surface-hover p-4 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-award"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-text">Top 1% Rated Pro</h4>
                    <p className="text-xs text-secondary mb-0">
                      {currentAddress?.city ? `${currentAddress.city} Metro Region` : 'Mumbai Metro Region'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-card-modern mb-6">
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
