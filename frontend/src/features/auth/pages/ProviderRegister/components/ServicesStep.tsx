import { useEffect, useState, useMemo } from 'react';
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
    const { register, formState: { errors }, trigger, watch } = useFormContext<ProviderRegistrationInputType>();
    const getCategories = useGetCategoriesService();
    const [categories, setCategories] = useState<Category[]>([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedServices = watch("services") || [];

    useEffect(() => {
        if (isActive && !hasFetched) {
            setHasFetched(true);
            getCategories.mutate({ page: 1, limit: 100, filter: 'ACTIVE' }, {
                onSuccess: (res) => {
                    const activeCats = (res.data?.categories || []).map((cat: any) => ({
                        ...cat,
                        services: (cat.services || []).filter((s: any) => s.status === 'ACTIVE')
                    }));
                    setCategories(activeCats);
                }
            });
        }
    }, [isActive, hasFetched]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const query = searchQuery.toLowerCase().trim();
        return categories
            .map((cat) => ({
                ...cat,
                services: cat.services.filter(
                    (s) => s.name.toLowerCase().includes(query) || cat.name.toLowerCase().includes(query)
                ),
            }))
            .filter((cat) => cat.services.length > 0);
    }, [categories, searchQuery]);

    if (!isActive) return null;

    const handleNext = async () => {
        const isStepValid = await trigger(["services"]);
        if (isStepValid) {
            onNext();
        }
    };

    return (
        <div className="pro-step-pane">
            <div className="pro-step-section-header">
                <div>
                    <span className="pro-step-subtitle">Select Services</span>
                    <span className="pro-selected-count">{selectedServices.length} Selected</span>
                </div>
                {errors.services && <span className="login-error-text">{errors.services.message}</span>}
            </div>

            <div className="login-input-group" style={{ marginBottom: '0.85rem' }}>
                <input
                    type="text"
                    placeholder="Search services or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="login-input"
                />
            </div>

            <div className="pro-services-scrollable">
                {getCategories.isPending ? (
                    <div className="pro-services-loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Loading available services...</span>
                    </div>
                ) : filteredCategories.filter(c => c.services && c.services.length > 0).length > 0 ? (
                    <div className="pro-categories-list">
                        {filteredCategories.map((category) => (
                            <div key={category.id} className="pro-category-group">
                                <span className="pro-category-tag">{category.name}</span>
                                <div className="modern-chips-wrapper">
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
                        ))}
                    </div>
                ) : (
                    <div className="pro-services-empty">
                        <i className="fas fa-search"></i>
                        <span>No services found matching your search.</span>
                    </div>
                )}
            </div>

            <div className="pro-step-nav-buttons">
                <button type="button" className="login-secondary-back-btn" onClick={onBack}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <button type="button" className="login-submit-btn" onClick={handleNext}>
                    <span>Continue to Details</span>
                    <i className="fas fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
                </button>
            </div>
        </div>
    );
}
