
import { useFormContext } from 'react-hook-form';
import type { ProviderRegistrationInputType } from '../../../schemas/provider/providerRegistration.schema';
import { usePreRegisterProvider } from '../../../hooks/provider/usePreRegisterProvider';
import { OtpModal } from './OtpModal';
import { useState } from 'react';

interface BasicInfoStepProps {
    isActive: boolean;
    onNext: () => void;
}

export function BasicInfoStep({ isActive, onNext }: BasicInfoStepProps) {
    const { register, formState: { errors }, trigger, getValues } = useFormContext<ProviderRegistrationInputType>();
    const [showOtpModal, setShowOtpModal] = useState(false)
    const preRegisterMutation = usePreRegisterProvider()
    const [isEmailVarified,setIsEmailVarified] = useState(false)
    
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
                        }
                    }
                );
            }
        } else {
            onNext();
        }
    };

    const handleOtpSuccess = () => {
        setIsEmailVarified(true)
        setShowOtpModal(false);
        onNext();
    };

    return (
        <div className="form-step-card step-content active" id="step-1">
            <div className="step-heading-row">
                <div className="step-num-pill">1</div>
                <div>
                    <h2 className="h5 mb-0">Account Information</h2>
                    <p className="text-xs text-secondary mb-0">Your primary login and operational contact credentials</p>
                </div>
            </div>

            <div className="grid-2 gap-4 mb-4">
                <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name <span className="text-danger">*</span></label>
                    <div className="input-with-icon">
                        <i className="fas fa-user input-icon"></i>
                        <input 
                            type="text" 
                            id="fullName" 
                            className={`form-control ${errors.fullName ? 'border-danger' : ''}`} 
                            placeholder="e.g. Arjun Menon" 
                            {...register("fullName")}
                        />
                    </div>
                    {errors.fullName && <span className="text-danger text-xs mt-1 block">{errors.fullName.message}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="email">Business / Personal Email <span className="text-danger">*</span></label>
                    <div className="input-with-icon">
                        <i className="fas fa-envelope input-icon"></i>
                        <input 
                            type="email" 
                            id="email" 
                            className={`form-control ${errors.email ? 'border-danger' : ''}`} 
                            placeholder="arjun.menon@example.com" 
                            {...register("email")}
                        />
                    </div>
                    {errors.email && <span className="text-danger text-xs mt-1 block">{errors.email.message}</span>}
                </div>
            </div>

            <div className="grid-2 gap-4 mb-4">
                <div className="form-group">
                    <label className="form-label" htmlFor="password">Password <span className="text-danger">*</span></label>
                    <div className="input-with-icon">
                        <i className="fas fa-lock input-icon"></i>
                        <input 
                            type="password" 
                            id="password" 
                            className={`form-control ${errors.password ? 'border-danger' : ''}`} 
                            placeholder="••••••••" 
                            {...register("password")}
                        />
                    </div>
                    {errors.password && <span className="text-danger text-xs mt-1 block">{errors.password.message}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password <span className="text-danger">*</span></label>
                    <div className="input-with-icon">
                        <i className="fas fa-lock input-icon"></i>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            className={`form-control ${errors.confirmPassword ? 'border-danger' : ''}`} 
                            placeholder="••••••••" 
                            {...register("confirmPassword")}
                        />
                    </div>
                    {errors.confirmPassword && <span className="text-danger text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                </div>
            </div>

            <div className="form-group mb-4">
                <label className="form-label" htmlFor="businessName">Business / Professional Name <span className="text-danger">*</span></label>
                <div className="input-with-icon">
                    <i className="fas fa-briefcase input-icon"></i>
                    <input 
                        type="text" 
                        id="businessName" 
                        className={`form-control ${errors.businessName ? 'border-danger' : ''}`} 
                        placeholder="e.g. Apex Plumbing Works" 
                        {...register("businessName")}
                    />
                </div>
                {errors.businessName && <span className="text-danger text-xs mt-1 block">{errors.businessName.message}</span>}
            </div>
            
            <div className="flex justify-end mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                <button type="button" className="btn btn-primary" onClick={handleNext} disabled={preRegisterMutation.isPending}>
                    {preRegisterMutation.isPending ? "Sending OTP..." : "Next Step"} <i className="fas fa-arrow-right ml-1"></i>
                </button>
            </div>

            <OtpModal 
                isOpen={showOtpModal} 
                onClose={() => setShowOtpModal(false)} 
                onSuccess={handleOtpSuccess} 
                email={getValues("email")} 
            />
        </div>
    );
}
