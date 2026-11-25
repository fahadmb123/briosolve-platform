import './Profile.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../../../shared/styles/location-picker.css';
import { nameSchema, type NameInputType } from '../../schemas/customerProfile.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useUpdateProfile } from '../../hooks/customer/useUpdateProfile';
import { useGetProfile } from '../../hooks/customer/useGetProfile';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { ImageCropModal } from '../../../../shared/components/ui/ImageCropModal/ImageCropModal';
import { useUpdateProfileImage } from '../../hooks/customer/useUpdateProfileImage';
import { useDeleteProfileImage } from '../../hooks/customer/useDeleteProfileImage';
import { useGetMyServiceRequests } from '../../../service-requests/hooks/useServiceRequestMutations';
import { useGetCustomerBookings } from '../../../bookings/hooks/useBookingMutations';
import { useMyReviewsQuery } from '../../../reviews';
import type { CustomerProfile } from '../../types/profile.types';

export default function Profile() {
  const user = useAuthStore(state => state.user);
  const profile = useAuthStore(state => state.profile);
  const fetchUser = useAuthStore(state => state.fetchUser);
  const customerProfile = profile as CustomerProfile | null;

  const defaultAddress = user?.current_address_id;
  const customerVerifiedCount = [
    Boolean(user?.email_verified),
    Boolean(user?.phone_verified),
    Boolean(defaultAddress)
  ].filter(Boolean).length;
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(customerProfile?.profile_image || null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { mutate: updateProfileImage, isPending: isImageUploading } = useUpdateProfileImage();
  const { mutate: deleteProfileImage, isPending: isImageDeleting } = useDeleteProfileImage();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NameInputType>({
    resolver: zodResolver(nameSchema),
    mode: "onChange",
    defaultValues: { name: user?.name || '', about: customerProfile?.about || '' }
  });

  const { mutate: updateProfile, isPending } = useUpdateProfile();
  useGetProfile();

  const { data: requestsRes, isLoading: isLoadingRequests } = useGetMyServiceRequests({ page: 1, limit: 1 });
  const { data: bookingsRes, isLoading: isLoadingBookings } = useGetCustomerBookings({ page: 1, limit: 1 });
  const { data: reviewsRes, isLoading: isLoadingReviews } = useMyReviewsQuery({ page: 1, limit: 1 });

  const requestsTotal = requestsRes?.data?.total ?? 0;
  const activeRequestsCount =
    (requestsRes?.data?.counts?.OPEN ?? 0) +
    (requestsRes?.data?.counts?.QUOTED ?? 0) +
    (requestsRes?.data?.counts?.IN_PROGRESS ?? 0);
  const bookingsTotal = bookingsRes?.data?.total ?? 0;
  const completedBookings = bookingsRes?.data?.counts?.COMPLETED ?? 0;
  const reviewsTotal = reviewsRes?.data?.totalReviews ?? 0;
  const avgReviewRating = reviewsRes?.data?.averageRating ?? 0;

  useEffect(() => {
    (()=>{
      if (customerProfile?.profile_image) {
        setProfileImage(customerProfile.profile_image);
      } else {
        setProfileImage(null);
      }
    })()
  }, [customerProfile?.profile_image]);

  useEffect(() => {
    if (user?.name !== undefined || customerProfile?.about !== undefined) {
      reset({
        name: user?.name || '',
        about: customerProfile?.about || ''
      });
    }
  }, [user?.name, customerProfile?.about, reset]);

  const onSubmitForm = (data: NameInputType) => {
    updateProfile(data, {
      onSuccess: (response) => {
        fetchUser();
        toast.success(response.message);
      }
    });
  };

  const handleCropComplete = (croppedFile: File) => {
    updateProfileImage(croppedFile, {
      onSuccess: (res) => {
        setIsImageModalOpen(false);
        setProfileImage(res.data?.profile_image || null);
        fetchUser();
        toast.success(res.message || "Profile image updated successfully!");
      }
    });
  };

  const handleDeleteImage = () => {
    deleteProfileImage(profileImage || undefined, {
      onSuccess: (res) => {
        setIsImageModalOpen(false);
        setProfileImage(null);
        fetchUser();
        toast.success(res.message || "Profile image deleted successfully!");
      }
    });
  };

  return (
    <>
      <div className="profile-premium-wrapper">
        {/* Top Gradient/Image Banner */}
        <div className="profile-banner"></div>

        <div className="profile-content-grid">
          {/* LEFT SIDEBAR */}
          <div className="flex flex-col gap-6 w-full">
            <div className="profile-card-modern w-full">
              <div className="floating-avatar">
                <img 
                  src={
                    profileImage 
                      ? `${profileImage.startsWith('http') ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}${profileImage}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff&size=140`
                  } 
                  onError={(e) => {
                    e.currentTarget.onerror = null; // Prevent infinite loop
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff&size=140`;
                  }}
                  alt={user?.name || 'User'} 
                />
                <button type="button" className="avatar-edit-badge" title="Change Photo" onClick={() => setIsImageModalOpen(true)}>
                  <i className="fas fa-camera"></i>
                </button>
              </div>

              <h2 className="h4 mb-1">{user?.name || 'Customer'}</h2>
              <div className="flex justify-center mb-3">
                <span className={`verification-pill ${customerVerifiedCount === 3 ? 'verified' : 'pending'}`}>
                  <i className={`fas ${customerVerifiedCount === 3 ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  {customerVerifiedCount === 3 ? 'Verified Customer' : `${customerVerifiedCount}/3 Verified`}
                </span>
              </div>
              <p className="text-secondary text-xs">Customer Member &bull; Joined <strong>Jan 2025</strong></p>

              <div className="profile-stats-modern">
                <div className="stat-box">
                  <span className="stat-value">14</span>
                  <span className="stat-label"><i className="fas fa-file-alt text-primary mr-1"></i> Requests</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">12</span>
                  <span className="stat-label"><i className="fas fa-calendar-check text-success mr-1"></i> Bookings</span>
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
                    <p className="verification-item-subtext">Customer trust credentials</p>
                  </div>
                </div>
                <span className={`verification-card-overall-badge ${customerVerifiedCount === 3 ? 'complete' : 'progress'}`}>
                  <i className={`fas ${customerVerifiedCount === 3 ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  {customerVerifiedCount}/3 Verified
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
                    <div className={`verification-item-icon-box ${defaultAddress ? 'verified' : 'empty'}`}>
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="verification-item-text">
                      <span className="verification-item-label">Address</span>
                    </div>
                  </div>
                  <div
                    className={`verification-checkbox ${defaultAddress ? 'checked' : 'unchecked'}`}
                    title={defaultAddress ? 'Address Verified' : 'Address Not Configured'}
                  >
                    {defaultAddress ? (
                      <i className="fas fa-check text-white"></i>
                    ) : null}
                  </div>
                </div>
              </div>

              {customerVerifiedCount < 3 && (
                <Link to="/settings" className="verification-btn-action">
                  <i className="fas fa-shield-alt"></i> Complete Verifications
                </Link>
              )}
            </div>

            <div className="form-card-modern p-5 w-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="h6 mb-0">Default Location</h3>
                  <p className="text-xs text-secondary mb-0">Primary residence</p>
                </div>
                <span className="badge badge-verified text-xs"><i className="fas fa-home mr-1"></i>{user?.current_address_id?.type || 'Home'}</span>
              </div>

              <div className="location-premium-box">
                <div className="flex items-start gap-3">
                  <i className="fas fa-map-marker-alt text-primary mt-1 text-lg"></i>
                  <div>
                    {user?.current_address_id ? (
                      <>
                        <div className="font-bold text-sm text-text">{user?.current_address_id.area}, {user?.current_address_id.city}</div>
                        <div className="text-xs text-secondary mt-1">{user?.current_address_id.state}, {user?.current_address_id.country} {user?.current_address_id.latitude && user?.current_address_id.longitude ? `(${Number(user?.current_address_id.latitude).toFixed(4)}° N, ${Number(user?.current_address_id.longitude).toFixed(4)}° E)` : ''}</div>
                      </>
                    ) : (
                      <div className="font-bold text-sm text-secondary">No default location set</div>
                    )}
                  </div>
                </div>
              </div>

              <button type="button" className="btn btn-outline btn-sm w-full mb-4" onClick={() => setIsLocModalOpen(true)}>
                <i className="fas fa-eye mr-1"></i> View Location
              </button>

              <div className="mini-map-preview" id="profile-mini-map" style={{ position: 'relative', overflow: 'hidden' }}>
                {user?.current_address_id?.latitude && user?.current_address_id?.longitude && (
                  <iframe 
                    title="Location Map"
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    src={`https://maps.google.com/maps?q=${user?.current_address_id.latitude},${user?.current_address_id.longitude}&z=14&output=embed`}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, zIndex: 1 }}
                  ></iframe>
                )}
                <div className="mini-map-overlay-badge" style={{ position: 'absolute', zIndex: 2 }}>
                  <i className="fas fa-map-pin text-primary"></i>
                  <span>{user?.current_address_id?.type || 'Home'}: {user?.current_address_id?.area || 'Not Set'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT - EDIT FORM */}
          <div className="profile-main-content flex flex-col gap-6">
            <form onSubmit={handleSubmit(onSubmitForm)} className="form-card-modern">
              <div className="flex justify-between items-center mb-6 pb-4 border-bottom border-border">
                <div>
                  <h3 className="h5 mb-0.5 text-text font-bold">Personal Information</h3>
                  <p className="text-xs text-secondary mb-0">Update your name and household preferences for visiting contractors.</p>
                </div>
                <span className="badge badge-primary text-xs uppercase px-2.5 py-1">
                  <i className="fas fa-user-check mr-1"></i>Profile
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="modern-input-group">
                  <label htmlFor="prof-name">Full Name</label>
                  <input type="text" id="prof-name" className="form-control" {...register("name")} />
                  {errors.name && (
                    <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div className="modern-input-group">
                  <label>Phone Contact</label>
                  <div className="form-control-static">
                    <span>{user?.phone || "No phone added"}</span>
                    <span className={`badge ${user?.phone_verified ? "badge-success" : "badge-neutral"} text-2xs uppercase px-2 py-0.5 shrink-0`}>
                      {user?.phone_verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>

                {/*<div className="modern-input-group">
                  <label>Membership Tier</label>
                  <div className="form-control-static">
                    <span className="font-medium">Verified Customer</span>
                    <span className="badge badge-primary text-2xs uppercase px-2 py-0.5 shrink-0">Standard</span>
                  </div>
                </div>*/}
                <div className="modern-input-group">
                  <label>Email Address</label>
                  <div className="form-control-static">
                    <span className="truncate">{user?.email || "No email set"}</span>
                    <span className="badge badge-success text-2xs uppercase px-2 py-0.5 shrink-0">
                      <i className="fas fa-check-circle mr-1"></i> Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="modern-input-group">
                <label htmlFor="prof-headline">About / Household Notes</label>
                <textarea 
                  id="prof-headline" 
                  className="form-control modern-textarea" 
                  placeholder="Brief note about your preferences, parking, or pets for visiting providers..."
                  {...register("about")}
                ></textarea>
                {errors.about && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.about.message}</span>
                )}
                <p className="text-xs text-secondary mt-2 flex items-center gap-1.5 mb-0">
                  <i className="fas fa-info-circle text-primary"></i> 
                  <span>This information helps providers understand your household preferences before they arrive.</span>
                </p>
              </div>

              <div className="flex justify-end items-center gap-3 pt-5 mt-4 border-top border-border">
                <button type="submit" disabled={isPending} className="btn btn-primary px-8 shadow-sm">
                  {isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="form-card-modern">
              <div className="cust-activity-header">
                <div>
                  <h3 className="h5 mb-0.5 text-text font-bold">Activity &amp; Quick Shortcuts</h3>
                  <p className="text-xs text-secondary mb-0">Live summary of your marketplace activity and quick links.</p>
                </div>
              </div>

              <div className="cust-activity-grid">
                <Link to="/my-requests" className="cust-activity-card">
                  <div className="cust-activity-icon requests">
                    <i className="fas fa-file-invoice"></i>
                  </div>
                  <div className="cust-activity-body">
                    <div className="cust-activity-label">Service Requests</div>
                    {isLoadingRequests ? (
                      <div className="cust-activity-sk" />
                    ) : (
                      <>
                        <div className="cust-activity-val">{requestsTotal} Total</div>
                        <div className="cust-activity-sub">
                          {activeRequestsCount > 0 ? `${activeRequestsCount} active` : 'View all requests'}
                        </div>
                      </>
                    )}
                  </div>
                  <i className="fas fa-chevron-right cust-activity-arrow"></i>
                </Link>

                <Link to="/bookings" className="cust-activity-card">
                  <div className="cust-activity-icon bookings">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="cust-activity-body">
                    <div className="cust-activity-label">Bookings</div>
                    {isLoadingBookings ? (
                      <div className="cust-activity-sk" />
                    ) : (
                      <>
                        <div className="cust-activity-val">{completedBookings} Completed</div>
                        <div className="cust-activity-sub">{bookingsTotal} total bookings</div>
                      </>
                    )}
                  </div>
                  <i className="fas fa-chevron-right cust-activity-arrow"></i>
                </Link>

                <Link to="/reviews" className="cust-activity-card">
                  <div className="cust-activity-icon reviews">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="cust-activity-body">
                    <div className="cust-activity-label">Reviews Shared</div>
                    {isLoadingReviews ? (
                      <div className="cust-activity-sk" />
                    ) : (
                      <>
                        <div className="cust-activity-val">{reviewsTotal} {reviewsTotal === 1 ? 'Review' : 'Reviews'}</div>
                        <div className="cust-activity-sub">
                          {reviewsTotal > 0 ? `${avgReviewRating.toFixed(1)} ★ avg rating` : 'No reviews yet'}
                        </div>
                      </>
                    )}
                  </div>
                  <i className="fas fa-chevron-right cust-activity-arrow"></i>
                </Link>
              </div>

              <div className="cust-shortcuts-row">
                <Link to="/settings" className="cust-shortcut-btn">
                  <i className="fas fa-cog"></i>
                  <span>Account Settings</span>
                </Link>
                <Link to="/notifications" className="cust-shortcut-btn">
                  <i className="fas fa-bell"></i>
                  <span>Notification Preferences</span>
                </Link>
                <button type="button" onClick={() => setIsLocModalOpen(true)} className="cust-shortcut-btn">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>View Full Address Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCATION MODAL */}
      <div className={`loc-modal-overlay ${isLocModalOpen ? 'active' : ''}`} id="profileLocModal">
        <div className="loc-modal" style={{ maxWidth: '600px' }}>
          <div className="loc-modal-header">
            <div className="flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-primary"></i>
              <h3 className="h6 mb-0">Location Details</h3>
            </div>
            <button className="btn-icon" onClick={() => setIsLocModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="loc-modal-body p-6">
            {defaultAddress ? (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">Location Type</span>
                  <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant flex items-center gap-2 w-max shadow-sm">
                    <i className={`fas ${defaultAddress.type?.toLowerCase() === 'home' ? 'fa-home' : defaultAddress.type?.toLowerCase() === 'work' ? 'fa-briefcase' : 'fa-map-pin'} text-primary`}></i>
                    {defaultAddress.type}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">House/Flat No.</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.house_no || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">Area/Locality</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.area || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">City</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.city || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">District</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.district || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">State</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.state || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">Country</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.country || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">Pincode</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.pincode || 'N/A'}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1.5">Landmark</span>
                    <div className="font-medium text-text bg-surface-container px-3.5 py-2.5 rounded-lg border border-surface-variant shadow-sm">{defaultAddress.landmark || 'N/A'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-secondary">
                <i className="fas fa-map-marker-slash text-5xl mb-4 opacity-50"></i>
                <p className="font-medium">No default location set.</p>
              </div>
            )}
          </div>
          <div className="loc-modal-footer">
            <button type="button" className="btn btn-primary w-full shadow-md" onClick={() => setIsLocModalOpen(false)}>Close</button>
          </div>
        </div>
      </div>

      {/* CROP MODAL */}
      <ImageCropModal 
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        currentImageUrl={profileImage}
        onCropCompleteAction={handleCropComplete}
        onDeleteAction={handleDeleteImage}
        isLoading={isImageUploading || isImageDeleting}
      />
    </>
  );
}
