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
        <div className="form-step-card step-content active" id="step-4">
            <div className="step-heading-row">
                <div className="step-num-pill">4</div>
                <div>
                    <h2 className="h5 mb-0">Review & Submit</h2>
                    <p className="text-xs text-secondary mb-0">Ensure all details are correct before submitting your application.</p>
                </div>
            </div>
            
            <div className="bg-surface rounded border p-4 mb-4 text-sm" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-2" style={{ display: 'grid', rowGap: '1.5rem', columnGap: '2rem' }}>
                    <div>
                        <div className="text-xs text-secondary mb-1">Full Name</div>
                        <div className="font-medium">{values.fullName || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-secondary mb-1">Contact</div>
                        <div className="font-medium">{values.email || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-secondary mb-1">Business Name</div>
                        <div className="font-medium">{values.businessName || 'Not provided'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-secondary mb-1">Experience</div>
                        <div className="font-medium">{values.experience || 'Not provided'}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-xs text-secondary mb-1">Selected Services</div>
                        <div className="font-medium">{values.services?.length || 0} services selected</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-xs text-secondary mb-1">KYC Status</div>
                        <div className="font-medium text-warning"><i className="fas fa-clock mr-1"></i> Will be uploaded after registration in Settings</div>
                    </div>
                </div>
            </div>

            
            <div className="register-actions-footer bg-transparent p-0 border-0">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-secondary w-full justify-center mb-4">
                    <input type="checkbox" id="accept-terms" required defaultChecked className="w-4 h-4 accent-primary" />
                    <span>I accept the ReverseMarket <Link to="#" className="underline text-primary">Provider Service Terms</Link></span>
                </label>

                <div className="flex gap-3 w-full max-w-md mx-auto">
                    <button type="button" className="btn btn-secondary w-full" onClick={onBack} disabled={isPending}>
                        <i className="fas fa-arrow-left mr-2"></i> Back
                    </button>
                    <button type="button" className="btn btn-primary w-full" onClick={onSubmit} disabled={isPending}>
                        {isPending ? (
                            <><i className="fas fa-spinner fa-spin mr-2"></i> Submitting...</>
                        ) : (
                            <><i className="fas fa-check-circle mr-2"></i> Submit Application</>
                        )}
                    </button>
                </div>

                <div className="text-xs text-secondary text-center mt-4 w-full">
                    Already have an account?
                    <Link to="/login" className="font-bold text-primary ml-1">Login to Portal</Link>
                </div>
            </div>
        </div>
    );
}
