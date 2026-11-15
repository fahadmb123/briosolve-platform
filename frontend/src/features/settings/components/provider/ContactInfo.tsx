import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { emailSchema, phoneSchema, type EmailInputType, type PhoneInputType } from '../../schemas/providerSettings.schema';
import { useUpdateEmail, useUpdatePhone, useDeletePhone } from '../../hooks/customer/contact';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { useResetFlowStore } from '../../../auth/stores/reset-flow.store';
import { ConfirmModal } from '../../../../shared/components/ui/ConfirmModal/ConfirmModal';
import { OtpModal } from '../../../auth/components/OtpModal';

export const ContactInfo: React.FC = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const user = useAuthStore((state) => state.user);
    const updateEmail = useUpdateEmail();
    const updatePhone = useUpdatePhone();
    const deletePhone = useDeletePhone();
    const { setOtpFlowStarted } = useResetFlowStore();

    const {
        register: registerEmail,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors }
    } = useForm<EmailInputType>({
        resolver: zodResolver(emailSchema),
        mode: "onChange",
        values: { email: user?.email || "" }
    });

    const {
        register: registerPhone,
        handleSubmit: handlePhoneSubmit,
        watch: watchPhone,
        setValue: setPhoneValue,
        formState: { errors: phoneErrors }
    } = useForm<PhoneInputType>({
        resolver: zodResolver(phoneSchema),
        mode: "onChange",
        values: {
            countryCode: "+91",
            phoneNumber: user?.phone ? user.phone.replace(/^\+91|^\+1|^\+44|^\+61|^\+81/, '') : ""
        }
    });

    const selectedCountry = watchPhone("countryCode") || "+91";

    const onEmailSubmit = (formData: EmailInputType) => {
        if (user?.email === formData.email) {
            toast.error("This is already your current registered email address");
            return;
        }
        updateEmail.mutate(formData, {
            onSuccess: (res) => {
                setOtpFlowStarted(true);
                setShowOtpModal(true);
                if (res.message) toast.success(res.message);
            }
        });
    };

    const onPhoneSubmit = (formData: PhoneInputType) => {
        const cleanDigits = formData.phoneNumber.replace(/\D/g, "");
        const fullPhone = `${formData.countryCode}${cleanDigits}`;
        if (user?.phone === fullPhone) {
            toast.error("This is already your current registered mobile number");
            return;
        }
        updatePhone.mutate({ phone: fullPhone }, {
            onSuccess: (response) => {
                setOtpFlowStarted(true);
                setShowOtpModal(true);
                toast.success(response.message);
            }
        });
    };

    const handleOtpSuccess = () => {
        setShowOtpModal(false);
        useAuthStore.getState().fetchUser();
    };

    const handleDeletePhone = () => {
        deletePhone.mutate(undefined, {
            onSuccess: (res) => {
                toast.success(res?.message || "Phone number deleted successfully");
                setIsDeleteModalOpen(false);
            }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="card p-6 fade-in flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-bottom" style={{ paddingBottom: '16px' }}>
                    <h2 className="h5 mb-0 font-bold">Email Address</h2>
                    {user?.email_verified ? (
                        <span className="badge badge-success text-xs px-2 py-1 mb-1">
                            <i className="fas fa-check-circle mr-1"></i>Verified
                        </span>
                    ) : (
                        <span className="badge badge-warning text-xs px-2 py-1 mb-1">Not Verified</span>
                    )}
                </div>
                <p className="text-xs text-secondary mb-4">Update your business login and contact email.</p>
                <div className="form-group mb-4 flex-grow">
                    <label className="form-label text-xs block mb-2" htmlFor="prov-email">Email Address</label>
                    <div className="input-icon-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input
                            type="email"
                            id="prov-email"
                            className={`form-control ${emailErrors.email ? 'border-danger' : ''}`}
                            style={emailErrors.email ? { borderColor: 'red' } : {}}
                            {...registerEmail("email")}
                        />
                    </div>
                    {emailErrors.email && (
                        <span className="text-danger text-red-500 text-xs mt-1 block">{emailErrors.email.message}</span>
                    )}
                    <p className="text-xs text-secondary mt-2">
                        <i className="fas fa-info-circle mr-1"></i>A verification link will be sent to the new email address.
                    </p>
                </div>
                <div className="flex justify-end mt-auto pt-2">
                    <button type="submit" disabled={updateEmail.isPending} className="btn btn-primary btn-sm">
                        {updateEmail.isPending ? 'Sending...' : 'Update Email'}
                    </button>
                </div>
            </form>

            <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="card p-6 fade-in flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-bottom" style={{ paddingBottom: '16px' }}>
                    <h2 className="h5 mb-0 font-bold">Mobile Number</h2>
                    {user?.phone_verified ? (
                        <span className="badge badge-success text-xs px-2 py-1 mb-1">
                            <i className="fas fa-check-circle mr-1"></i>Verified
                        </span>
                    ) : (
                        <span className="badge badge-warning text-xs px-2 py-1 mb-1">Not Verified</span>
                    )}
                </div>
                <p className="text-xs text-secondary mb-4">Update your mobile number for project communications and alerts.</p>
                <div className="form-group mb-4 flex-grow">
                    <label className="form-label text-xs block mb-2" htmlFor="prov-phone">Mobile Number</label>
                    <div className="flex gap-2">
                        <select
                            className={`form-control ${phoneErrors.countryCode ? 'border-danger' : ''}`}
                            style={{ maxWidth: "140px", flex: "none", ...(phoneErrors.countryCode ? { borderColor: 'red' } : {}) }}
                            {...registerPhone("countryCode")}
                        >
                            <option value="+91">IN (+91)</option>
                            <option value="+1">US (+1)</option>
                            <option value="+44">UK (+44)</option>
                            <option value="+61">AU (+61)</option>
                            <option value="+81">JP (+81)</option>
                        </select>
                        <div className="input-icon-wrapper flex-grow">
                            <i className="fas fa-phone"></i>
                            <input
                                type="tel"
                                id="prov-phone"
                                className={`form-control ${phoneErrors.phoneNumber ? 'border-danger' : ''}`}
                                style={phoneErrors.phoneNumber ? { borderColor: 'red' } : {}}
                                placeholder={selectedCountry === '+91' ? 'e.g. 9876543210 (10 digits)' : 'Enter phone number'}
                                maxLength={selectedCountry === '+91' || selectedCountry === '+1' ? 10 : 14}
                                {...registerPhone("phoneNumber", {
                                    onChange: (e) => {
                                        const sanitized = e.target.value.replace(/\D/g, '');
                                        setPhoneValue("phoneNumber", sanitized, { shouldValidate: true });
                                    }
                                })}
                            />
                        </div>
                    </div>
                    {phoneErrors.phoneNumber && (
                        <span className="text-danger text-red-500 text-xs mt-1 block">{phoneErrors.phoneNumber.message}</span>
                    )}
                    {phoneErrors.countryCode && (
                        <span className="text-danger text-red-500 text-xs mt-1 block">{phoneErrors.countryCode.message}</span>
                    )}
                    <p className="text-xs text-secondary mt-2">
                        <i className="fas fa-info-circle mr-1"></i>We'll send an OTP to verify ownership.
                    </p>
                </div>
                <div className="flex justify-end mt-auto pt-2 gap-2">
                    {user?.phone && (
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={deletePhone.isPending}
                            className="btn btn-outline-danger btn-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors px-3 py-1 rounded"
                        >
                            {deletePhone.isPending ? 'Deleting...' : 'Delete Phone'}
                        </button>
                    )}
                    <button type="submit" disabled={updatePhone.isPending || !!phoneErrors.phoneNumber} className="btn btn-primary btn-sm">
                        {updatePhone.isPending ? 'Sending...' : 'Update Mobile Number'}
                    </button>
                </div>
            </form>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Delete Mobile Number"
                message="Are you sure you want to delete your mobile number? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDanger={true}
                isLoading={deletePhone.isPending}
                onConfirm={handleDeletePhone}
                onCancel={() => setIsDeleteModalOpen(false)}
            />

            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSuccess={handleOtpSuccess}
            />
        </div>
    );
};
