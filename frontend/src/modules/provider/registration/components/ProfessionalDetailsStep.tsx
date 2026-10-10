import { useFormContext } from 'react-hook-form';
import type { ProviderRegistrationInputType } from '../../../auth/schemas/validation';

interface ProfessionalDetailsStepProps {
    isActive: boolean;
    onNext: () => void;
    onBack: () => void;
}

export function ProfessionalDetailsStep({ isActive, onNext, onBack }: ProfessionalDetailsStepProps) {
    const { register, formState: { errors }, trigger } = useFormContext<ProviderRegistrationInputType>();

    if (!isActive) return null;

    const handleNext = async () => {
        const isStepValid = await trigger(["experience", "skills", "bio"]);
        if (isStepValid) {
            onNext();
        }
    };

    return (
        <div className="form-step-card step-content active" id="step-3">
            <div className="step-heading-row">
                <div className="step-num-pill">3</div>
                <div>
                    <h2 className="h5 mb-0">Professional Details</h2>
                    <p className="text-xs text-secondary mb-0">Tell us more about your experience and skills</p>
                </div>
            </div>

            <div className="form-group mb-6">
                <label className="form-label" htmlFor="experience-years">Years of Professional Experience <span className="text-danger">*</span></label>
                <select id="experience-years" className="form-control" {...register("experience")}>
                    <option value="">Select your experience</option>
                    <option value="1-3">1 - 3 Years</option>
                    <option value="4-7">4 - 7 Years</option>
                    <option value="8-12">8 - 12 Years (Master Tech)</option>
                    <option value="12+">12+ Years (Industry Veteran)</option>
                </select>
                {errors.experience && <span className="text-danger text-xs mt-1 block">{errors.experience.message}</span>}
            </div>

            
            <div className="form-group mb-6">
                <label className="form-label" htmlFor="skills-input">Specific Trade Skills (Comma Separated)</label>
                <input type="text" id="skills-input" className="form-control" placeholder="e.g. Concealed Leak Detection, R32 Gas Refill, Copper Brazing" {...register("skills")} />
                {errors.skills && <span className="text-danger text-xs mt-1 block">{errors.skills.message}</span>}
            </div>

            
            <div className="form-group mb-0">
                <label className="form-label" htmlFor="pro-bio">Professional Overview / Pitch to Clients <span className="text-danger">*</span></label>
                <textarea id="pro-bio" className="form-control" rows={4} placeholder="Tell clients why they should choose your quotation..." {...register("bio")}></textarea>
                {errors.bio && <span className="text-danger text-xs mt-1 block">{errors.bio.message}</span>}
            </div>
            
            <div className="flex justify-between mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                <button type="button" className="btn btn-secondary" onClick={onBack}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
            </div>
        </div>
    );
}
