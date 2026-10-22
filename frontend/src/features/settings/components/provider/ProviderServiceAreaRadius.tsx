import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../auth/stores/auth.store';
import { useUpdateServiceRadius } from '../../hooks/provider/useUpdateBusinessProfile';
import type { Address } from '../../../addresses';
import type { ProviderProfile } from '../../../profiles';

interface ServiceAreaRadiusProps {
    onManageAddress?: () => void;
}

interface RadiusPreset {
    id: 'short' | 'medium' | 'wide';
    label: string;
    radius: number;
    description: string;
    icon: string;
    badge: string;
}

const PRESETS: RadiusPreset[] = [
    {
        id: 'short',
        label: 'Short Range',
        radius: 10,
        description: 'Hyper-local coverage with fast response & minimal commute.',
        icon: 'fas fa-walking',
        badge: 'Local Focus'
    },
    {
        id: 'medium',
        label: 'Medium Range',
        radius: 25,
        description: 'Optimal citywide perimeter balancing travel and job volume.',
        icon: 'fas fa-city',
        badge: 'Most Popular'
    },
    {
        id: 'wide',
        label: 'Wide Range',
        radius: 50,
        description: 'Expanded regional perimeter for high-ticket & specialized jobs.',
        icon: 'fas fa-route',
        badge: 'Max Reach'
    }
];

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

    const baseCoordsText = currentAddress?.latitude && currentAddress?.longitude
        ? `Coordinates: ${Math.abs(Number(currentAddress.latitude)).toFixed(4)}° ${Number(currentAddress.latitude) >= 0 ? 'N' : 'S'}, ${Math.abs(Number(currentAddress.longitude)).toFixed(4)}° ${Number(currentAddress.longitude) >= 0 ? 'E' : 'W'}`
        : currentAddress
        ? 'Coordinates: Not available'
        : 'Please configure a default address in Manage Addresses';

    const coverageArea = Math.round(Math.PI * radius * radius);
    const estimatedDriveMin = Math.round(radius * 1.4);
    const estimatedDriveMax = Math.round(radius * 2.1);

    const activePreset = PRESETS.find((p) => p.radius === radius)?.id || null;

    const handleSelectPreset = (presetRadius: number) => {
        setRadius(presetRadius);
    };

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
            <div className="flex justify-between items-center mb-2 flex-wrap gap-3">
                <div>
                    <h2 className="h5 mb-1 font-bold">Service Area &amp; Travel Radius</h2>
                    <p className="text-xs text-secondary mb-0">
                        Define your central dispatch location and maximum travel radius for receiving customer requests.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 mb-6">
                <div
                    className="p-4 rounded-xl border flex flex-col justify-between"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
                >
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                                Base Dispatch Location
                            </span>
                            <span className="badge badge-success text-[11px] py-0.5 px-2">
                                <i className="fas fa-home mr-1"></i> {currentAddress?.type || 'Default'}
                            </span>
                        </div>
                        <div
                            className={`font-bold text-base mb-1 ${currentAddress ? 'text-text' : 'text-secondary'}`}
                            id="settings-base-loc"
                        >
                            {baseLocationText}
                        </div>
                        <div className="text-xs text-muted flex items-center gap-1.5" id="settings-base-coords">
                            <i className="fas fa-compass text-primary opacity-80 text-xs"></i>
                            <span>{baseCoordsText}</span>
                        </div>
                    </div>

                    <div className="pt-3 mt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs text-secondary">Dispatch Origin</span>
                        {onManageAddress ? (
                            <button
                                type="button"
                                onClick={onManageAddress}
                                className="text-xs text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                            >
                                Change Location &rarr;
                            </button>
                        ) : null}
                    </div>
                </div>

                <div
                    className="p-4 rounded-xl border flex flex-col justify-between"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
                >
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase font-bold tracking-wider text-secondary">
                                Active Service Radius
                            </span>
                            <span className="badge badge-primary text-[11px] py-0.5 px-2">
                                <i className="fas fa-radar mr-1"></i>
                                {radius <= 15 ? 'Short' : radius <= 35 ? 'Medium' : 'Wide'}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-black text-primary" id="settings-radius-display">
                                {radius} km
                            </span>
                            <span className="text-xs text-secondary font-medium">Travel Perimeter</span>
                        </div>
                        <div className="text-xs text-muted">
                            Covers approx. <strong className="text-text">{coverageArea.toLocaleString()} km²</strong> • ~{estimatedDriveMin}-{estimatedDriveMax} min response time
                        </div>
                    </div>

                    <div className="pt-3 mt-3 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs text-secondary">Alert Filter</span>
                        <span className="text-xs font-semibold text-success flex items-center gap-1">
                            <i className="fas fa-check-circle text-xs"></i> Active Perimeter
                        </span>
                    </div>
                </div>
            </div>

            <div
                className="p-5 rounded-xl border mb-6"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
            >
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h3 className="h6 mb-0 font-bold">Customize Service Radius</h3>
                        <p className="text-xs text-secondary mb-0">
                            Click a quick preset or drag the slider to expand or narrow your travel territory.
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
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
                        <span className="text-xs font-bold px-2 text-text min-w-[50px] text-center">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                    {PRESETS.map((preset) => {
                        const isSelected = activePreset === preset.id;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleSelectPreset(preset.radius)}
                                className="p-3.5 rounded-xl border text-left transition-all cursor-pointer relative"
                                style={{
                                    backgroundColor: isSelected ? 'rgba(var(--primary-rgb), 0.08)' : 'var(--surface)',
                                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                                    boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'none'
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                                        style={{
                                            backgroundColor: isSelected ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.1)',
                                            color: isSelected ? '#ffffff' : 'var(--primary)'
                                        }}
                                    >
                                        <i className={`${preset.icon} text-sm`}></i>
                                    </div>
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: isSelected ? 'var(--primary)' : 'var(--border)',
                                            color: isSelected ? '#ffffff' : 'var(--text-secondary)'
                                        }}
                                    >
                                        {preset.badge}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1.5 mb-1">
                                    <span className="font-bold text-sm text-text">{preset.label}</span>
                                    <span className="text-xs font-bold text-primary">({preset.radius} km)</span>
                                </div>
                                <p className="text-xs text-secondary mb-0 leading-relaxed">
                                    {preset.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5 pt-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-text">Fine-Tune Radius</span>
                        <span className="text-xs font-bold text-primary">{radius} km Range</span>
                    </div>

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
                        <span>25 km (Standard)</span>
                        <span>50 km (Regional)</span>
                        <span>80 km (Maximum)</span>
                    </div>
                </div>

                <div
                    className="p-3 rounded-lg border mt-5 flex items-start gap-3"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                    <i className="fas fa-info-circle text-primary text-base mt-0.5"></i>
                    <p className="text-xs text-secondary mb-0 leading-relaxed">
                        Customer inquiries originating within <strong className="text-text font-bold">{radius} km</strong> of <strong className="text-text font-bold">{baseLocationText}</strong> will automatically appear in your leads feed.
                    </p>
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
