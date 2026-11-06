import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { useUpdateServiceRadius } from '../../hooks/provider/useUpdateBusinessProfile';
import type { Address } from '../../../addresses';
import type { ProviderProfile } from '../../../profiles';

interface ServiceAreaRadiusProps {
    onManageAddress?: () => void;
}

const PRESET_VALUES = [10, 25, 50];

export const ServiceAreaRadius: React.FC<ServiceAreaRadiusProps> = ({ onManageAddress }) => {
    const { user, profile, fetchUser } = useAuthStore();
    const providerProfile = profile as ProviderProfile | null;
    const updateRadius = useUpdateServiceRadius();

    const savedRadius = providerProfile?.service_radius_km ?? 20;
    const [radius, setRadius] = useState<number>(savedRadius);
    const [initialRadius, setInitialRadius] = useState<number>(savedRadius);

    useEffect(() => {
        if (!profile) {
            fetchUser();
        }
    }, [profile, fetchUser]);

    useEffect(() => {
        if (providerProfile?.service_radius_km !== undefined && providerProfile.service_radius_km !== null) {
            setRadius(providerProfile.service_radius_km);
            setInitialRadius(providerProfile.service_radius_km);
        }
    }, [providerProfile?.service_radius_km]);

    const currentAddress: Address | null =
        user?.current_address_id && typeof user.current_address_id === 'object'
            ? user.current_address_id
            : null;

    const baseLocationText = currentAddress
        ? [
            currentAddress.area,
            currentAddress.city,
            currentAddress.district && currentAddress.district !== currentAddress.city ? currentAddress.district : null,
            currentAddress.state
        ]
            .filter(Boolean)
            .join(', ') || 'Location configured'
        : 'No default address set';

    const handleStep = (step: number) => {
        setRadius((prev) => {
            const next = prev + step;
            if (next < 5) return 5;
            if (next > 80) return 80;
            return next;
        });
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRadius(Number(e.target.value));
    };

    const handleSave = () => {
        updateRadius.mutate(
            { service_radius_km: radius },
            {
                onSuccess: (res) => {
                    fetchUser();
                    setInitialRadius(radius);
                    toast.success(res.message || `Service radius updated to ${radius} km successfully`);
                }
            }
        );
    };

    const handleReset = () => {
        setRadius(initialRadius);
    };

    const isDirty = radius !== initialRadius;

    return (
        <div className="settings-card-panel fade-in" id="sec-service-area">
            <div className="mb-5 pb-4 border-b flex justify-between items-start flex-wrap gap-3" style={{ borderColor: 'var(--border)' }}>
                <div>
                    <h2 className="h5 mb-1 font-bold">Service Area &amp; Travel Radius</h2>
                    <p className="text-xs text-secondary mb-0">
                        Set your dispatch territory and maximum travel distance to receive matching customer requests.
                    </p>
                </div>
                {onManageAddress && (
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={onManageAddress}
                    >
                        <i className="fas fa-map-pin mr-1.5 text-primary"></i> Manage Addresses
                    </button>
                )}
            </div>

            <div
                className="p-4 rounded-xl border mb-5 flex items-center justify-between flex-wrap gap-3"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)' }}
                    >
                        <i className="fas fa-location-dot text-base"></i>
                    </div>
                    <div>
                        <div className="text-xs text-secondary font-medium">Base Dispatch Location</div>
                        <div className="text-sm font-semibold text-text">{baseLocationText}</div>
                    </div>
                </div>
                {onManageAddress && (
                    <button
                        type="button"
                        onClick={onManageAddress}
                        className="text-xs font-semibold text-primary hover:underline bg-transparent border-0 cursor-pointer p-0"
                    >
                        Change Address &rarr;
                    </button>
                )}
            </div>

            <div
                className="p-5 rounded-xl border mb-6"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
            >
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <div>
                        <label className="text-sm font-bold text-text block mb-0.5">Maximum Travel Radius</label>
                        <p className="text-xs text-secondary mb-0">
                            You will receive job leads requested within this distance from your base dispatch address.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleStep(-5)}
                            disabled={radius <= 5}
                            className="btn btn-outline btn-xs"
                            title="Decrease 5 km"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                        >
                            <i className="fas fa-minus"></i>
                        </button>
                        <span className="text-base font-black px-3 py-1 rounded-lg border text-primary min-w-[70px] text-center" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                            {radius} km
                        </span>
                        <button
                            type="button"
                            onClick={() => handleStep(5)}
                            disabled={radius >= 80}
                            className="btn btn-outline btn-xs"
                            title="Increase 5 km"
                            style={{ width: '32px', height: '32px', padding: 0 }}
                        >
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-xs text-secondary font-medium mr-1">Quick Presets:</span>
                    {PRESET_VALUES.map((presetKm) => {
                        const isSelected = radius === presetKm;
                        return (
                            <button
                                key={presetKm}
                                type="button"
                                onClick={() => setRadius(presetKm)}
                                className={`px-3 py-1 text-xs rounded-full border font-semibold transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'bg-surface text-secondary border-border hover:border-primary'
                                }`}
                            >
                                {presetKm} km
                            </button>
                        );
                    })}
                </div>

                <div className="pt-2">
                    <input
                        type="range"
                        className="custom-range-slider mb-2 cursor-pointer"
                        min="5"
                        max="80"
                        step="1"
                        value={radius}
                        onChange={handleSliderChange}
                        style={{ width: '100%' }}
                    />

                    <div className="flex justify-between text-[11px] text-secondary mt-1">
                        <span>5 km (Local)</span>
                        <span>25 km (Citywide)</span>
                        <span>50 km (Regional)</span>
                        <span>80 km (Maximum)</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-3 pt-2">
                <div>
                    {isDirty && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="btn btn-outline btn-sm"
                        >
                            <i className="fas fa-undo mr-1.5"></i> Reset to {initialRadius} km
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={updateRadius.isPending}
                    className="btn btn-primary btn-sm ml-auto"
                >
                    {updateRadius.isPending ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-1.5"></i> Saving...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save mr-1.5"></i> Save Radius Preferences
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
