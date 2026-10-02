import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, phoneSchema, type EmailInputType, type PhoneInputType } from '../../../../schemas/validation';
import { useUpdateEmail } from '../../../../hooks/mutations/contact';


import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useResetFlowStore } from '../../../../../../../store/auth/reset-flow.store';
import { useAuthStore } from '../../../../../../../store/auth/auth.store';

export const Contact = () => {
    const user = useAuthStore((state) => state.user);
    const updateEmail = useUpdateEmail()
    const navigate = useNavigate()


    const {register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors }} = useForm<EmailInputType>({
        resolver: zodResolver(emailSchema),
        mode: "onChange",
        defaultValues: { email: user?.email || "" }
    });

    const {register: registerPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors }} = useForm<PhoneInputType>({
        resolver: zodResolver(phoneSchema),
        mode: "onChange",
        defaultValues: { phone: user?.phone || "" }
    });

    const onEmailSubmit = (formData: EmailInputType) => {
        updateEmail.mutate(formData, {
            onSuccess: (res) => {
                useResetFlowStore.getState().setOtpFlowStarted(true)
                navigate("/otp-verification",{replace:true})
                if (res.message) toast.success(res.message)
            }
        })
    };

    const onPhoneSubmit = (formData: PhoneInputType) => {
        console.log("Update Phone:", formData);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Box */}
            <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="card p-6 fade-in flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-bottom pb-3">
                    <h2 className="h5 mb-0">Email Address</h2>
                    {user?.email_verified ? (
                        <span className="badge badge-success text-xs"><i className="fas fa-check-circle mr-1"></i>Verified</span>
                    ) : (
                        <span className="badge badge-warning text-xs">Not Verified</span>
                    )}
                </div>
                <p className="text-xs text-secondary mb-4">Update your sign-in email address.</p>
                <div className="form-group mb-4 flex-grow">
                    <label className="form-label text-xs block mb-2" htmlFor="prof-email">Email Address</label>
                    <div className="input-icon-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input type="email" id="prof-email" className="form-control" {...registerEmail("email")} />
                    </div>
                    {emailErrors.email && (
                        <span className="text-red-500 text-xs mt-1 block">{emailErrors.email.message}</span>
                    )}
                    <p className="text-xs text-secondary mt-2"><i className="fas fa-info-circle mr-1"></i>A verification link will be sent to new emails.</p>
                </div>
                <div className="flex justify-end mt-auto pt-2">
                    <button type="submit" disabled={updateEmail.isPending} className="btn btn-primary btn-sm">
                        {updateEmail.isPending ? 'Sending...' : 'Update Email'}
                    </button>
                </div>
            </form>

            {/* Mobile Number Box */}
            <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="card p-6 fade-in flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-bottom pb-3">
                    <h2 className="h5 mb-0">Mobile Number</h2>
                    {user?.phone_verified ? (
                        <span className="badge badge-success text-xs"><i className="fas fa-check-circle mr-1"></i>Verified</span>
                    ) : (
                        <span className="badge badge-warning text-xs">Not Verified</span>
                    )}
                </div>
                <p className="text-xs text-secondary mb-4">Update and verify your mobile number.</p>
                <div className="form-group mb-4 flex-grow">
                    <label className="form-label text-xs block mb-2" htmlFor="prof-phone">Mobile Number</label>
                    <div className="input-icon-wrapper">
                        <i className="fas fa-phone"></i>
                        <input type="tel" id="prof-phone" className="form-control" placeholder="+91 9876543210" {...registerPhone("phone")} />
                    </div>
                    {phoneErrors.phone && (
                        <span className="text-red-500 text-xs mt-1 block">{phoneErrors.phone.message}</span>
                    )}
                    <p className="text-xs text-secondary mt-2"><i className="fas fa-info-circle mr-1"></i>We'll send an OTP to verify ownership.</p>
                </div>
                <div className="flex justify-end mt-auto pt-2">
                    <button type="submit" className="btn btn-primary btn-sm">Update Mobile Number</button>
                </div>
            </form>
        </div>
    );
};
