import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSendBecomeProviderOtp, useBecomeProvider } from '../../../../hooks/customer/useBecomeProvider';
import { useAuthStore } from '../../../../../auth/stores/auth.store';
import { OtpModal } from '../../../../../auth/components/OtpModal';
import ServiceSelection from '../../../../components/customer/ServiceSelection';
import { useGetCategoriesService } from '../../../../../service-catalog';
import type { ApiError } from '../../../../../../shared/api/ApiError';
import { SpinnerOverlay } from '../../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';


type FormData = {
    businessName: string;
    experience: string;
    bio: string;
};

interface Category {
    id: string;
    name: string;
    services: { id: string; name: string }[];
}

export function BecomeProvider() {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingData, setPendingData] = useState<FormData | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [serviceError, setServiceError] = useState('');

    //const fetchUser = useAuthStore((s) => s.fetchUser);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const sendOtpMut = useSendBecomeProviderOtp();
    const becomeProviderMut = useBecomeProvider();
    const getCategories = useGetCategoriesService();   

    useEffect(() => {
        getCategories.mutate({ page: 1, limit: 100, filter: 'ACTIVE' }, {
            onSuccess: (res) => setCategories(res.data.categories)
        });
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({ mode: 'onChange' });

    const toggleService = (id: string) => {
        setServiceError('');
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const onSubmit = (data: FormData) => {
        if (selectedServices.length === 0) {
            setServiceError('Please select at least one service');
            return;
        }
        setPendingData(data);
        sendOtpMut.mutate(undefined, {
            onSuccess: () => setShowOtpModal(true),
            onError: (err: ApiError) => toast.error(err.message || 'Failed to send OTP')
        });
    };

    const handleOtpSuccess = () => {
        setShowOtpModal(false);
        if (!pendingData) return;
        becomeProviderMut.mutate({
            businessName: pendingData.businessName,
            experience: pendingData.experience,
            bio: pendingData.bio,
            services: selectedServices
        }, {
            onSuccess: async () => {
                toast.success('You are now a provider! Please sign in again.');
                clearAuth();
                window.location.href = '/login';
            },
            onError: (err: ApiError) => toast.error(err.message || 'Failed to switch account')
        });
    };

    const isLoading = sendOtpMut.isPending || becomeProviderMut.isPending;

    return (
        <div className="card p-6 fade-in">
            {isLoading && <SpinnerOverlay isLoading={true} />}

            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: 'rgba(99,102,241,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <i className="fas fa-store text-primary" style={{ fontSize: '1.1rem' }} />
                    </div>
                    <div>
                        <h2 className="h5 mb-0">Become a Service Provider</h2>
                        <p className="text-xs text-secondary mb-0">
                            Switch your account and start offering services on the marketplace.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 rounded-lg" style={{
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.25)'
                }}>
                    <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b', fontSize: '0.85rem' }} />
                    <p className="text-xs mb-0" style={{ color: '#f59e0b' }}>
                        Your customer profile and saved data will be removed. This action cannot be undone.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="flex flex-col gap-5">
                    <div className="form-group mb-0">
                        <label className="form-label">
                            Business Name <span className="text-danger">*</span>
                        </label>
                        <input
                            id="bp-business-name"
                            type="text"
                            className={`form-control ${errors.businessName ? 'is-invalid' : ''}`}
                            placeholder="e.g. John's Plumbing Services"
                            {...register('businessName', { required: 'Business name is required' })}
                        />
                        {errors.businessName && (
                            <span className="text-danger text-xs">{errors.businessName.message}</span>
                        )}
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label">
                            Years of Experience <span className="text-danger">*</span>
                        </label>
                        <input
                            id="bp-experience"
                            type="text"
                            className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                            placeholder="e.g. 5 years"
                            {...register('experience', { required: 'Experience is required' })}
                        />
                        {errors.experience && (
                            <span className="text-danger text-xs">{errors.experience.message}</span>
                        )}
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label">
                            Professional Bio <span className="text-danger">*</span>
                        </label>
                        <textarea
                            id="bp-bio"
                            rows={3}
                            className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
                            placeholder="Describe your skills and what you offer..."
                            {...register('bio', { required: 'Bio is required', minLength: { value: 10, message: 'Bio must be at least 10 characters' } })}
                        />
                        {errors.bio && (
                            <span className="text-danger text-xs">{errors.bio.message}</span>
                        )}
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label">
                            Select Services <span className="text-danger">*</span>
                        </label>
                        {serviceError && (
                            <span className="text-danger text-xs mb-3 block">{serviceError}</span>
                        )}

                        {getCategories.isPending ? (
                            <div className="text-center py-6 text-secondary text-sm">
                                <i className="fas fa-spinner fa-spin mr-2 text-primary" />
                                Loading services...
                            </div>
                        ) : (
                            <ServiceSelection
                                categories={categories}
                                selectedServices={selectedServices}
                                toggleService={toggleService}
                                serviceError={serviceError}
                            />
                        )}
                    </div>

                    <button
                        id="bp-submit-btn"
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {sendOtpMut.isPending ? 'Sending OTP...' : 'Verify & Become Provider'}
                        {!isLoading && <i className="fas fa-arrow-right ml-2" />}
                    </button>
                </div>
            </form>

            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSuccess={handleOtpSuccess}
            />
        </div>
    );
}
