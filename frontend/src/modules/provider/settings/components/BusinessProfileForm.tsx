import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { businessProfileSchema, type BusinessProfileInputType } from '../schemas/validation';
import { useUpdateBusinessProfile } from '../hooks/mutations/useUpdateBusinessProfile';
import { useAuthStore } from '../../../../store/auth/auth.store';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import type { ProviderProfile } from '../../../../shared/types/Dtos';

export const BusinessProfileForm: React.FC = () => {
    const updateProfile = useUpdateBusinessProfile();
    const { user, profile, fetchUser } = useAuthStore();
    const providerProfile = profile as ProviderProfile | null;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<BusinessProfileInputType>({
        resolver: zodResolver(businessProfileSchema),
        mode: "onChange",
        defaultValues: {
            name: user?.name || "",
            businessName: providerProfile?.business_name || "",
            experience: providerProfile?.experience || "",
            bio: providerProfile?.bio || ""
        }
    });

    const watchBio = watch("bio", "");

    useEffect(() => {
        if (!profile) {
            fetchUser();
        }
    }, [profile, fetchUser]);

    useEffect(() => {
        if (providerProfile || user) {
            reset({
                name: user?.name || "",
                businessName: providerProfile?.business_name || "",
                experience: providerProfile?.experience || "",
                bio: providerProfile?.bio || ""
            });
        }
    }, [providerProfile, user, reset]);

    const onSubmit = (formData: BusinessProfileInputType) => {
        updateProfile.mutate(formData, {
            onSuccess: (response) => {
                fetchUser();
                toast.success(response.message || "Business profile updated successfully");
            }
        });
    };

    return (
        <>
            <SpinnerOverlay isLoading={updateProfile.isPending} />
            <form onSubmit={handleSubmit(onSubmit)} className="fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="card p-6 flex flex-col h-full">
                        <div className="mb-4 border-bottom" style={{ paddingBottom: '16px' }}>
                            <h2 className="h5 mb-0 font-bold">Business Credentials</h2>
                        </div>
                        <p className="text-xs text-secondary mb-4">Set up your business name and industry experience.</p>

                        <div className="form-group mb-4">
                            <label className="form-label text-xs block mb-2" htmlFor="provider-name">
                                Full Name <span className="text-danger">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-user"></i>
                                <input
                                    type="text"
                                    id="provider-name"
                                    className={`form-control ${errors.name ? 'border-danger' : ''}`}
                                    style={errors.name ? { borderColor: 'red' } : {}}
                                    placeholder="e.g. John Doe"
                                    {...register("name")}
                                />
                            </div>
                            {errors.name && (
                                <span className="text-danger text-red-500 text-xs mt-1 block">{errors.name.message}</span>
                            )}
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label text-xs block mb-2" htmlFor="biz-name">
                                Business / Professional Name <span className="text-danger">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-store"></i>
                                <input
                                    type="text"
                                    id="biz-name"
                                    className={`form-control ${errors.businessName ? 'border-danger' : ''}`}
                                    style={errors.businessName ? { borderColor: 'red' } : {}}
                                    placeholder="e.g. Apex Plumbing & HVAC"
                                    {...register("businessName")}
                                />
                            </div>
                            {errors.businessName && (
                                <span className="text-danger text-red-500 text-xs mt-1 block">{errors.businessName.message}</span>
                            )}
                        </div>

                        <div className="form-group mb-0">
                            <label className="form-label text-xs block mb-2" htmlFor="biz-exp">
                                Years of Professional Experience <span className="text-danger">*</span>
                            </label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-award"></i>
                                <select
                                    id="biz-exp"
                                    className={`form-control ${errors.experience ? 'border-danger' : ''}`}
                                    style={errors.experience ? { borderColor: 'red' } : {}}
                                    {...register("experience")}
                                >
                                    <option value="">Select your experience</option>
                                    <option value="1-3">1 - 3 Years</option>
                                    <option value="4-7">4 - 7 Years</option>
                                    <option value="8-12">8 - 12 Years (Master Tech)</option>
                                    <option value="12+">12+ Years (Industry Veteran)</option>
                                </select>
                            </div>
                            {errors.experience && (
                                <span className="text-danger text-red-500 text-xs mt-1 block">{errors.experience.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4 border-bottom" style={{ paddingBottom: '16px' }}>
                            <h2 className="h5 mb-0 font-bold">Professional Overview</h2>
                            <span className="text-xs text-secondary">
                                {(watchBio || "").length} / 2000
                            </span>
                        </div>
                        <p className="text-xs text-secondary mb-4">Detailed bio and pitch shown to clients on quotes.</p>

                        <div className="form-group mb-0 flex-grow flex flex-col">
                            <label className="form-label text-xs block mb-2" htmlFor="biz-bio">
                                Professional Overview / Bio <span className="text-danger">*</span>
                            </label>
                            <textarea
                                id="biz-bio"
                                className={`form-control flex-grow ${errors.bio ? 'border-danger' : ''}`}
                                style={{ minHeight: "135px", ...(errors.bio ? { borderColor: 'red' } : {}) }}
                                rows={5}
                                placeholder="Describe your trade specializations, certifications, warranty guarantees, and why clients should choose you..."
                                {...register("bio")}
                            ></textarea>
                            {errors.bio && (
                                <span className="text-danger text-red-500 text-xs mt-1 block">{errors.bio.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="btn btn-primary btn-sm"
                    >
                        {updateProfile.isPending ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-1"></i> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-1"></i> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </>
    );
};
