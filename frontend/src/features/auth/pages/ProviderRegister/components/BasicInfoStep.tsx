import { useFormContext } from 'react-hook-form';
import type { ProviderRegistrationInputType } from '../../../schemas/provider/providerRegistration.schema';
import { usePreRegisterProvider } from '../../../hooks/provider/usePreRegisterProvider';
import { OtpModal } from './OtpModal';
import { useState } from 'react';
import { PasswordInput } from '../../../../../shared/components/ui/PasswordInput/PasswordInput';

interface BasicInfoStepProps {
    isActive: boolean;
    onNext: () => void;
    onError?: (msg: string) => void;
}

export function BasicInfoStep({ isActive, onNext, onError }: BasicInfoStepProps) {
    const { register, formState: { errors }, trigger, getValues } = useFormContext<ProviderRegistrationInputType>();
    const [showOtpModal, setShowOtpModal] = useState(false);
    const preRegisterMutation = usePreRegisterProvider();
    const [isEmailVarified, setIsEmailVarified] = useState(false);
    
    if (!isActive) return null;

    const handleNext = async () => {
        if (!isEmailVarified){
            const isStepValid = await trigger([
                "fullName", 
                "email", 
                "password", 
                "confirmPassword", 
                "businessName"
            ]);
            
            if (isStepValid) {
                const data = getValues();
                preRegisterMutation.mutate(
                    { fullName: data.fullName, email: data.email, password: data.password, businessName: data.businessName },
                    {
                        onSuccess: () => {
                            setShowOtpModal(true);
                        },
                        onError: (err: any) => {
                            if (onError) {
                                onError(err?.message || "Failed to initiate registration");
                            }
                        }
                    }
                );
            }
        } else {
            onNext();
        }
    };

    const handleOtpSuccess = () => {
        setIsEmailVarified(true);
        setShowOtpModal(false);
        onNext();
    };

    return (
        <div className="pro-step-pane">
            <div className="login-input-group">
                <label className="login-label" htmlFor="fullName">Full Name</label>
                <input 
                    type="text" 
                    id="fullName" 
                    className={`login-input ${errors.fullName ? 'login-input-error' : ''}`} 
                    placeholder="e.g. Arjun Menon" 
                    {...register("fullName")}
                />
                {errors.fullName && <span className="login-error-text">{errors.fullName.message}</span>}
            </div>

            <div className="login-input-group">
                <label className="login-label" htmlFor="email">Business or Personal Email</label>
                <input 
                    type="email" 
                    id="email" 
                    className={`login-input ${errors.email ? 'login-input-error' : ''}`} 
                    placeholder="arjun.menon@example.com" 
                    {...register("email")}
                />
                {errors.email && <span className="login-error-text">{errors.email.message}</span>}
            </div>

            <div className="login-input-group">
                <label className="login-label" htmlFor="businessName">Business / Trade Name</label>
                <input 
                    type="text" 
                    id="businessName" 
                    className={`login-input ${errors.businessName ? 'login-input-error' : ''}`} 
                    placeholder="e.g. Apex Electrical Works" 
                    {...register("businessName")}
                />
                {errors.businessName && <span className="login-error-text">{errors.businessName.message}</span>}
            </div>

            <div className="login-input-group">
                <label className="login-label" htmlFor="password">Password</label>
                <PasswordInput 
                    id="password" 
                    placeholder="••••••••" 
                    icon=""
                    error={errors.password?.message}
                    wrapperClassName="login-password-wrapper"
                    className="login-input"
                    {...register("password")}
                />
            </div>

            <div className="login-input-group">
                <label className="login-label" htmlFor="confirmPassword">Confirm Password</label>
                <PasswordInput 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    icon=""
                    error={errors.confirmPassword?.message}
                    wrapperClassName="login-password-wrapper"
                    className="login-input"
                    {...register("confirmPassword")}
                />
            </div>

            <button 
                type="button" 
                className="login-submit-btn" 
                onClick={handleNext} 
                disabled={preRegisterMutation.isPending}
                style={{ marginTop: '1rem' }}
            >
                {preRegisterMutation.isPending ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Sending OTP...</span>
                    </>
                ) : (
                    <>
                        <span>Continue to Services</span>
                        <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                    </>
                )}
            </button>

            <OtpModal 
                isOpen={showOtpModal} 
                onClose={() => setShowOtpModal(false)} 
                onSuccess={handleOtpSuccess} 
                email={getValues("email")} 
            />
        </div>
    );
}
