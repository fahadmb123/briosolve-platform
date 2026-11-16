import { useFormContext } from 'react-hook-form';
import type { ProviderRegistrationInputType } from '../../../schemas/provider/providerRegistration.schema';

interface ProfessionalDetailsStepProps {
    isActive: boolean;
    onNext: () => void;
    onBack: () => void;
}

export function ProfessionalDetailsStep({ isActive, onNext, onBack }: ProfessionalDetailsStepProps) {
    const { register, formState: { errors }, trigger } = useFormContext<ProviderRegistrationInputType>();

    if (!isActive) return null;

    const handleNext = async () => {
        const isStepValid = await trigger(["experience", "bio"]);
        if (isStepValid) {
            onNext();
        }
    };

    return (
        <div className="pro-step-pane">
            <div className="login-input-group">
                <label className="login-label" htmlFor="experience-years">Years of Professional Experience</label>
                <select 
                    id="experience-years" 
                    className={`login-input login-select ${errors.experience ? 'is-invalid' : ''}`} 
                    {...register("experience")}
                >
                    <option value="">Select your experience level</option>
                    <option value="1-3">1 - 3 Years</option>
                    <option value="4-7">4 - 7 Years</option>
                    <option value="8-12">8 - 12 Years (Master Tech)</option>
                    <option value="12+">12+ Years (Industry Veteran)</option>
                </select>
                {errors.experience && <div className="login-error-msg">{errors.experience.message}</div>}
            </div>

            <div className="login-input-group">
                <label className="login-label" htmlFor="pro-bio">Professional Overview / Client Pitch</label>
                <textarea 
                    id="pro-bio" 
                    className={`login-input login-textarea ${errors.bio ? 'is-invalid' : ''}`} 
                    rows={4} 
                    placeholder="Tell prospective clients about your expertise, background, and why they should choose your services..." 
                    {...register("bio")}
                ></textarea>
                {errors.bio && <div className="login-error-msg">{errors.bio.message}</div>}
            </div>
            
            <div className="pro-step-nav-buttons">
                <button type="button" className="login-secondary-back-btn" onClick={onBack}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <button type="button" className="login-submit-btn" onClick={handleNext}>
                    <span>Continue to Review</span>
                    <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                </button>
            </div>
        </div>
    );
}
