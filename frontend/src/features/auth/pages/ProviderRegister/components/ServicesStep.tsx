import { useEffect, useState } from 'react';
import { useGetCategoriesService } from '../../../../service-catalog';
import { useFormContext } from 'react-hook-form';
import type { ProviderRegistrationInputType } from '../../../schemas/provider/providerRegistration.schema';

interface ServicesStepProps {
    isActive: boolean;
    onNext: () => void;
    onBack: () => void;
}

interface ServiceItem {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  services: ServiceItem[];
}

export function ServicesStep({ isActive, onNext, onBack }: ServicesStepProps) {
    const { register, formState: { errors }, trigger } = useFormContext<ProviderRegistrationInputType>();
    const getCategories = useGetCategoriesService();
    const [categories, setCategories] = useState<Category[]>([]);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (isActive && !hasFetched) {
            setHasFetched(true);
            getCategories.mutate({ page: 1, limit: 100, filter: 'ACTIVE' }, {
                onSuccess: (res) => {
                    setCategories(res.data.categories);
                }
            });
        }
    }, [isActive, hasFetched]);

    if (!isActive) return null;

    const handleNext = async () => {
        const isStepValid = await trigger(["services"]);
        if (isStepValid) {
            onNext();
        }
    };

    return (
        <div className="form-step-card step-content active" id="step-2">
            <div className="step-heading-row">
                <div className="step-num-pill">2</div>
                <div>
                    <h2 className="h5 mb-0">Services Provided</h2>
                    <p className="text-xs text-secondary mb-0">Select the specific categories and services you offer</p>
                </div>
            </div>

            <div className="form-group mb-0">
                <label className="form-label">Select Specific Services You Provide <span className="text-danger">*</span></label>
                {errors.services && <span className="text-danger text-xs mb-4 block">{errors.services.message}</span>}
                
                {getCategories.isPending ? (
                    <div className="text-center py-8 text-secondary text-sm">
                        <i className="fas fa-spinner fa-spin mr-2 text-primary text-xl mb-2"></i>
                        <p>Loading services...</p>
                    </div>
                ) : (
                    categories.filter(c => c.services && c.services.length > 0).length > 0 ? (
                        <div className="flex flex-col gap-6 mt-5">
                            {categories.filter(c => c.services && c.services.length > 0).map((category) => (
                                <div key={category.id} className="border border-border rounded-xl overflow-hidden bg-surface-elevated shadow-sm transition-all hover:border-primary-light">
                                    <div className="px-5 py-4 border-b border-border flex items-center gap-3" style={{ backgroundColor: 'var(--surface)' }}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-primary" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                                            <i className="fas fa-layer-group"></i>
                                        </div>
                                        <h3 className="text-base font-bold capitalize m-0 text-text">
                                            {category.name}
                                        </h3>
                                    </div>
                                    <div className="p-5">
                                        <div className="modern-chips-wrapper" style={{ justifyContent: 'flex-start' }}>
                                            {category.services.map((service) => (
                                                <label key={service.id} className="modern-service-chip">
                                                    <input 
                                                        type="checkbox" 
                                                        value={service.id} 
                                                        {...register("services")} 
                                                        className="hidden-checkbox"
                                                    />
                                                    <span className="chip-content">
                                                        <span className="check-box-icon"><i className="fas fa-check"></i></span>
                                                        <span className="service-name">{service.name}</span>
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 px-4 rounded-lg border border-dashed border-border bg-surface-elevated mt-4">
                            <i className="fas fa-clipboard-list text-4xl text-secondary mb-4 opacity-40"></i>
                            <h4 className="text-md font-bold mb-1">No Services Available</h4>
                            <p className="text-sm text-secondary">There are currently no services available for selection.</p>
                        </div>
                    )
                )}
            </div>
            
            <div className="flex justify-between mt-6 border-top" style={{ paddingTop: "1.25rem" }}>
                <button type="button" className="btn btn-secondary" onClick={onBack}><i className="fas fa-arrow-left mr-1"></i> Back</button>
                <button type="button" className="btn btn-primary" onClick={handleNext}>Next Step <i className="fas fa-arrow-right ml-1"></i></button>
            </div>
        </div>
    );
}
