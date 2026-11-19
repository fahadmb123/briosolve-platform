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
    const { data: categoriesRes, isLoading } = useGetCategoriesService({ page: 1, limit: 100, filter: 'ACTIVE' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const selectedServices = watch("services") || [];

    useEffect(() => {
        if (categoriesRes?.data?.categories) {
            const activeCats = (categoriesRes.data.categories || []).map((cat: any) => ({
                ...cat,
                services: (cat.services || []).filter((s: any) => s.status === 'ACTIVE')
            }));
            setCategories(activeCats);
        }
    }, [categoriesRes]);

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
                {errors.services && <div className="login-error-msg">{errors.services.message}</div>}
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
                {isLoading ? (
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
                    <div className="pro-services-empty" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <img
                            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
                            alt="No data found"
                            style={{ width: '100%', maxWidth: '200px', maxHeight: '140px', objectFit: 'contain', margin: '0 auto 1rem', display: 'block', filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.1))' }}
                        />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No services found matching your search.</span>
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
