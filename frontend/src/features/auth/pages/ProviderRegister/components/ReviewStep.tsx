import { Link } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import type { ProviderRegistrationInputType } from '../../../schemas/provider/providerRegistration.schema';

interface ReviewStepProps {
    isActive: boolean;
    isPending: boolean;
    onBack: () => void;
    onSubmit: () => void;
}

export function ReviewStep({ isActive, isPending, onBack, onSubmit }: ReviewStepProps) {
    const { getValues } = useFormContext<ProviderRegistrationInputType>();
    
    if (!isActive) return null;

    const values = getValues();

    return (
        <div className="pro-step-pane">
            <div className="pro-review-card">
                <div className="pro-review-row">
                    <span className="pro-review-label">Full Name</span>
                    <span className="pro-review-value">{values.fullName || 'Not provided'}</span>
                </div>
                <div className="pro-review-row">
                    <span className="pro-review-label">Email</span>
                    <span className="pro-review-value">{values.email || 'Not provided'}</span>
                </div>
                <div className="pro-review-row">
                    <span className="pro-review-label">Business Name</span>
                    <span className="pro-review-value">{values.businessName || 'Not provided'}</span>
                </div>
                <div className="pro-review-row">
                    <span className="pro-review-label">Experience</span>
                    <span className="pro-review-value">{values.experience ? `${values.experience} Years` : 'Not provided'}</span>
                </div>
                <div className="pro-review-row">
                    <span className="pro-review-label">Services</span>
                    <span className="pro-review-value">{values.services?.length || 0} services selected</span>
                </div>
                <div className="pro-review-row notice">
                    <span className="pro-review-label">KYC Verification</span>
                    <span className="pro-review-value notice">Completed immediately after account registration</span>
                </div>
            </div>

            <label className="pro-terms-row">
                <input type="checkbox" id="accept-terms" required defaultChecked className="pro-terms-checkbox" />
                <span>I agree to Briosolve's <Link to="#" className="pro-terms-link">Provider Terms & Conditions</Link></span>
            </label>

            <div className="pro-step-nav-buttons">
                <button type="button" className="login-secondary-back-btn" onClick={onBack} disabled={isPending}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <button type="button" className="login-submit-btn" onClick={onSubmit} disabled={isPending}>
                    {isPending ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i>
                            <span>Registering...</span>
                        </>
                    ) : (
                        <span>Complete Registration</span>
                    )}
                </button>
            </div>
        </div>
    );
}
