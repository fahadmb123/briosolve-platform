import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../auth/stores/auth.store';
import {
    useGetProviderAvailability,
    useSetProviderAvailability,
    useUpdateTravelBuffer,
    useUpdateAcceptingLeads,
    useGetProviderAvailabilityOverrides,
    useCreateProviderAvailabilityOverride,
    useDeleteProviderAvailabilityOverride
} from '../hooks/useAvailability';
import type { ProviderProfile } from '../../../shared/types/Dtos';
import type { Weekday, ProviderAvailabilityOverrideItem } from '../types/availability.types';
import { SpinnerOverlay } from '../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal/ConfirmModal';
import '../../../shared/components/ui/ConfirmModal/ConfirmModal.css';

interface DaySchedule {
    day: string;
    isEnabled: boolean;
    startTime: string;
    endTime: string;
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
    { day: 'Monday', isEnabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Tuesday', isEnabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Wednesday', isEnabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Thursday', isEnabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Friday', isEnabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'Saturday', isEnabled: true, startTime: '10:00', endTime: '16:00' },
    { day: 'Sunday', isEnabled: false, startTime: '10:00', endTime: '14:00' }
];

const BUFFER_PRESETS = [30, 45, 60, 90];

const AvailabilitySettingsComponent: React.FC = () => {
    const { profile, fetchUser } = useAuthStore();
    const providerProfile = profile as ProviderProfile | null;

    const getAvailability = useGetProviderAvailability();
    const setAvailability = useSetProviderAvailability();
    const updateTravelBuffer = useUpdateTravelBuffer();
    const updateAcceptingLeads = useUpdateAcceptingLeads();
    const getOverrides = useGetProviderAvailabilityOverrides();
    const createOverride = useCreateProviderAvailabilityOverride();
    const deleteOverride = useDeleteProviderAvailabilityOverride();

    const [acceptingLeads, setAcceptingLeads] = useState<boolean>(true);
    const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
    const [dateOverrides, setDateOverrides] = useState<ProviderAvailabilityOverrideItem[]>([]);
    const [isAddingOverride, setIsAddingOverride] = useState<boolean>(false);
    const [newOverrideDate, setNewOverrideDate] = useState<string>('');
    const [newOverrideLabel, setNewOverrideLabel] = useState<string>('');
    const [newOverrideIsOff, setNewOverrideIsOff] = useState<boolean>(true);
    const [newOverrideStartTime, setNewOverrideStartTime] = useState<string>('09:00');
    const [newOverrideEndTime, setNewOverrideEndTime] = useState<string>('17:00');
    const [overrideToDelete, setOverrideToDelete] = useState<string | null>(null);

    const [bufferMinutes, setBufferMinutes] = useState<number>(30);

    useEffect(() => {
        if (!profile) {
            fetchUser();
        }
    }, [profile, fetchUser]);

    useEffect(() => {
        (()=>{
            if (providerProfile) {
                if (providerProfile.accepting_leads !== undefined) {
                    setAcceptingLeads(providerProfile.accepting_leads);
                }
                if (providerProfile.travel_buffer_minutes !== undefined && providerProfile.travel_buffer_minutes !== null) {
                    setBufferMinutes(providerProfile.travel_buffer_minutes);
                }
            }
        })()
    }, [providerProfile]);

    useEffect(() => {
        getAvailability.mutate(undefined, {
            onSuccess: (res) => {
                const slots = res.data || [];
                setSchedule((prev) =>
                    prev.map((dayItem) => {
                        const matched = slots.find(
                            (s) => s.day_of_week === (dayItem.day.toUpperCase() as Weekday)
                        );
                        if (matched) {
                            return {
                                ...dayItem,
                                isEnabled: true,
                                startTime: matched.start_time,
                                endTime: matched.end_time
                            };
                        }
                        return {
                            ...dayItem,
                            isEnabled: false
                        };
                    })
                );
            }
        });
    }, []);

    useEffect(() => {
        getOverrides.mutate(undefined, {
            onSuccess: (res) => {
                setDateOverrides(res.data || []);
            }
        });
    }, []);

    const handleToggleDay = useCallback((idx: number) => {
        setSchedule((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, isEnabled: !item.isEnabled } : item))
        );
    }, []);

    const handleTimeChange = useCallback((idx: number, field: 'startTime' | 'endTime', val: string) => {
        setSchedule((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
        );
    }, []);

    const handleApplyWeekdayDefaults = useCallback(() => {
        setSchedule((prev) =>
            prev.map((item) => {
                if (item.day === 'Saturday' || item.day === 'Sunday') {
                    return item;
                }
                return { ...item, isEnabled: true, startTime: '09:00', endTime: '17:00' };
            })
        );
        toast.success('Applied 9:00 AM - 5:00 PM for weekdays');
    }, []);

    const handleCloseOverrideModal = useCallback(() => {
        setNewOverrideDate('');
        setNewOverrideLabel('');
        setNewOverrideIsOff(true);
        setNewOverrideStartTime('09:00');
        setNewOverrideEndTime('17:00');
        setIsAddingOverride(false);
    }, []);

    const formattedDateOverrides = useMemo(() => {
        return dateOverrides.map((override) => {
            const rawDate = override.override_date.split('T')[0];
            const [y, m, d] = rawDate.split('-').map(Number);
            const dateObj = (!isNaN(y) && !isNaN(m) && !isNaN(d)) ? new Date(y, m - 1, d) : new Date(override.override_date);
            const formattedDate = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : rawDate;
            const weekdayName = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })
                : '';
            return {
                ...override,
                formattedDate,
                weekdayName
            };
        });
    }, [dateOverrides]);

    const todayString = new Date().toISOString().split('T')[0];
    const isDateAlreadyOverridden = Boolean(
        newOverrideDate && dateOverrides.some((item) => item.override_date.split('T')[0] === newOverrideDate)
    );
    const isDateInPast = Boolean(newOverrideDate && newOverrideDate < todayString);
    const isTimeInvalid = !newOverrideIsOff && (!newOverrideStartTime || !newOverrideEndTime || newOverrideStartTime >= newOverrideEndTime);
    const isReasonTooLong = newOverrideLabel.trim().length > 255;

    const handleAddOverride = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOverrideDate) {
            toast.error('Please select an override date');
            return;
        }
        if (isDateInPast) {
            toast.error('Override date cannot be in the past');
            return;
        }
        if (isDateAlreadyOverridden) {
            toast.error('An override already exists for this date');
            return;
        }
        if (!newOverrideIsOff && (!newOverrideStartTime || !newOverrideEndTime)) {
            toast.error('Please specify both start time and end time');
            return;
        }
        if (isTimeInvalid) {
            toast.error('End time must be after start time');
            return;
        }
        if (isReasonTooLong) {
            toast.error('Reason / label must be under 255 characters');
            return;
        }
        createOverride.mutate(
            {
                override_date: newOverrideDate,
                type: newOverrideIsOff ? 'DAY_OFF' : 'CUSTOM_HOURS',
                start_time: !newOverrideIsOff ? newOverrideStartTime : null,
                end_time: !newOverrideIsOff ? newOverrideEndTime : null,
                reason: newOverrideLabel.trim() || null
            },
            {
                onSuccess: (res) => {
                    if (res.data) {
                        setDateOverrides((prev) => [...prev, res.data]);
                    }
                    handleCloseOverrideModal();
                    toast.success('Override added successfully');
                }
            }
        );
    };

    const handleConfirmDeleteOverride = useCallback(() => {
        if (!overrideToDelete) return;
        deleteOverride.mutate(overrideToDelete, {
            onSuccess: () => {
                setDateOverrides((prev) => prev.filter((item) => item.id !== overrideToDelete));
                setOverrideToDelete(null);
                toast.success('Override removed successfully');
            },
            onError: () => {
                setOverrideToDelete(null);
            }
        });
    }, [overrideToDelete, deleteOverride]);

    const handleStepBuffer = useCallback((step: number) => {
        setBufferMinutes((prev) => {
            const next = prev + step;
            if (next < 30) return 30;
            if (next > 120) return 120;
            return next;
        });
    }, []);

    const isSavingSchedule = setAvailability.isPending || updateAcceptingLeads.isPending;
    const isSavingBuffer = updateTravelBuffer.isPending;
    const isLoadingAvailability = getAvailability.isPending;

    const handleSaveSchedule = useCallback(() => {
        const enabledSlots = schedule
            .filter((item) => item.isEnabled)
            .map((item) => ({
                day_of_week: item.day.toUpperCase() as Weekday,
                start_time: item.startTime,
                end_time: item.endTime
            }));

        setAvailability.mutate(enabledSlots, {
            onSuccess: () => {
                if (providerProfile?.accepting_leads !== acceptingLeads) {
                    updateAcceptingLeads.mutate({ accepting_leads: acceptingLeads }, {
                        onSuccess: () => {
                            fetchUser();
                        }
                    });
                }
                toast.success('Saved!');
            }
        });
    }, [schedule, setAvailability, providerProfile?.accepting_leads, acceptingLeads, updateAcceptingLeads, fetchUser]);

    const handleSaveBuffer = useCallback(() => {
        updateTravelBuffer.mutate({ travel_buffer_minutes: bufferMinutes }, {
            onSuccess: () => {
                fetchUser();
                toast.success(`Travel buffer updated to ${bufferMinutes} mins!`);
            }
        });
    }, [updateTravelBuffer, bufferMinutes, fetchUser]);

    return (
        <div className="flex flex-col gap-6">
            {(getAvailability.isPending || getOverrides.isPending) ? (<SpinnerOverlay isLoading={true}/>):null}
            <div className="settings-card-panel fade-in" id="sec-working-availability">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h2 className="h5 mb-1 font-bold">Availability &amp; Work Status</h2>
                        <p className="text-xs text-secondary mb-0">
                            Configure your real-time work status and weekly recurring schedule.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isLoadingAvailability && (
                            <span className="text-xs text-secondary flex items-center gap-1">
                                <i className="fas fa-spinner fa-spin"></i>
                            </span>
                        )}
                        <span className={`badge ${acceptingLeads ? 'badge-success' : 'badge-warning'} text-xs px-2.5 py-1`}>
                            <i className={`fas ${acceptingLeads ? 'fa-check-circle' : 'fa-pause-circle'} mr-1.5`}></i>
                            {acceptingLeads ? 'Accepting Leads' : 'Leads Paused'}
                        </span>
                    </div>
                </div>

                <div className="toggle-switch-row">
                    <div>
                        <div className="font-bold text-sm text-text">Accepting New Service Leads</div>
                        <div className="text-xs text-secondary">
                            Your profile appears actively in local customer searches and direct lead distribution
                        </div>
                    </div>
                    <label className="switch-slider-ctrl">
                        <input
                            type="checkbox"
                            checked={acceptingLeads}
                            onChange={(e) => setAcceptingLeads(e.target.checked)}
                        />
                        <span className="slider-round"></span>
                    </label>
                </div>


                <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                        <div>
                            <h3 className="h6 mb-0 font-bold">Weekly Working Schedule</h3>
                            <p className="text-xs text-secondary mb-0">Set your active service hours for each day of the week.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleApplyWeekdayDefaults}
                            className="btn btn-outline btn-xs"
                        >
                            <i className="fas fa-magic mr-1"></i> Default 9 AM - 5 PM
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border mb-4" style={{ borderColor: 'var(--border)' }}>
                        <table className="w-full text-left text-sm" style={{ borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th className="p-3 text-xs font-bold text-secondary uppercase tracking-wider">Day</th>
                                    <th className="p-3 text-xs font-bold text-secondary uppercase tracking-wider">Status</th>
                                    <th className="p-3 text-xs font-bold text-secondary uppercase tracking-wider">Operating Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((item, idx) => (
                                    <tr
                                        key={item.day}
                                        className="border-b transition-colors"
                                        style={{
                                            borderColor: 'var(--border)',
                                            backgroundColor: item.isEnabled ? 'transparent' : 'rgba(var(--text-rgb, 128, 128, 128), 0.02)'
                                        }}
                                    >
                                        <td className="p-3 font-semibold text-text" style={{ width: '160px' }}>
                                            <label className="flex items-center gap-2 cursor-pointer mb-0">
                                                <input
                                                    type="checkbox"
                                                    checked={item.isEnabled}
                                                    onChange={() => handleToggleDay(idx)}
                                                    style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                                                />
                                                <span className={item.isEnabled ? 'text-text' : 'text-secondary line-through'}>
                                                    {item.day}
                                                </span>
                                            </label>
                                        </td>
                                        <td className="p-3" style={{ width: '130px' }}>
                                            {item.isEnabled ? (
                                                <span className="badge badge-success text-[11px] py-0.5 px-2">
                                                    Open
                                                </span>
                                            ) : (
                                                <span className="badge badge-secondary text-[11px] py-0.5 px-2">
                                                    Day Off
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            {item.isEnabled ? (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <input
                                                        type="time"
                                                        value={item.startTime}
                                                        onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                                                        className="form-control"
                                                        style={{ width: '120px', padding: '0.35rem 0.6rem', fontSize: '0.8125rem' }}
                                                    />
                                                    <span className="text-secondary text-xs font-medium">to</span>
                                                    <input
                                                        type="time"
                                                        value={item.endTime}
                                                        onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                                                        className="form-control"
                                                        style={{ width: '120px', padding: '0.35rem 0.6rem', fontSize: '0.8125rem' }}
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs text-secondary italic">Not accepting appointments</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleSaveSchedule}
                        disabled={isSavingSchedule}
                        className="btn btn-primary btn-sm"
                    >
                        {isSavingSchedule ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-1.5"></i> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-1.5"></i> Save Schedule
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="settings-card-panel fade-in" id="sec-date-overrides">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h2 className="h5 mb-1 font-bold">Specific Date Overrides</h2>
                        <p className="text-xs text-secondary mb-0">
                            Set custom operating hours or take specific days off for holidays and personal leave.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {dateOverrides.length > 0 && (
                            <span className="badge badge-primary text-xs px-2 py-0.5">
                                {dateOverrides.length} Override{dateOverrides.length > 1 ? 's' : ''}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsAddingOverride(true)}
                            className="btn btn-outline btn-xs"
                        >
                            <i className="fas fa-plus mr-1"></i> Add Date Override
                        </button>
                    </div>
                </div>

                {dateOverrides.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border mt-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}>
                        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider" style={{ width: '24%' }}>Date</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider" style={{ width: '18%' }}>Type</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider" style={{ width: '22%' }}>Working Hours</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider" style={{ width: '26%' }}>Reason</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-secondary uppercase tracking-wider text-right" style={{ width: '10%' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formattedDateOverrides.map((override) => (
                                    <tr key={override.id} className="border-b transition-colors hover:bg-[rgba(255,255,255,0.02)]" style={{ borderColor: 'var(--border)' }}>
                                        <td className="py-3.5 px-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <i className="far fa-calendar-alt text-primary text-xs"></i>
                                                <div>
                                                    <span className="font-semibold text-text text-xs">{override.formattedDate}</span>
                                                    {override.weekdayName && (
                                                        <span className="text-[11px] text-secondary ml-1.5 font-normal">({override.weekdayName})</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                            <td className="py-3.5 px-4 align-middle">
                                                {override.type === 'DAY_OFF' ? (
                                                    <span
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)' }}
                                                    >
                                                        <i className="fas fa-bed text-[10px]"></i> Day Off
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                                                        style={{ backgroundColor: 'rgba(212, 172, 119, 0.15)', color: 'var(--primary)', border: '1px solid rgba(212, 172, 119, 0.3)' }}
                                                    >
                                                        <i className="fas fa-business-time text-[10px]"></i> Custom Hours
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 align-middle">
                                                {override.type === 'CUSTOM_HOURS' && override.start_time && override.end_time ? (
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
                                                        <i className="far fa-clock text-secondary text-[11px]"></i>
                                                        <span>{override.start_time} - {override.end_time}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-secondary italic">All Day Off</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 align-middle text-xs text-secondary">
                                                {override.reason ? (
                                                    <span className="text-text font-medium">{override.reason}</span>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 align-middle text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setOverrideToDelete(override.id)}
                                                    disabled={deleteOverride.isPending}
                                                    className="btn-icon text-danger hover:text-red-500 cursor-pointer"
                                                    title="Delete override"
                                                >
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            </td>
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div
                        className="text-center p-5 border rounded-xl mt-3"
                        style={{
                            borderColor: 'var(--border)',
                            borderStyle: 'dashed',
                            backgroundColor: 'var(--surface-elevated)'
                        }}
                    >
                        <i className="fas fa-calendar-check text-secondary mb-2 text-xl opacity-60"></i>
                        <p className="text-xs text-secondary mb-0">
                            No custom overrides scheduled. Your weekly schedule operates normally.
                        </p>
                    </div>
                )}

                {isAddingOverride && (
                    <div
                        className="confirm-modal-overlay"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                handleCloseOverrideModal();
                            }
                        }}
                    >
                        <div
                            className="confirm-modal-content"
                            style={{ maxWidth: '480px', width: '92%' }}
                        >
                            <div className="flex justify-between items-center mb-4 pb-2 border-bottom">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-primary"
                                        style={{ backgroundColor: 'rgba(212, 172, 119, 0.15)' }}
                                    >
                                        <i className="fas fa-calendar-alt text-xs"></i>
                                    </div>
                                    <h3 className="h6 mb-0 font-bold">Add Date Override</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCloseOverrideModal}
                                    className="text-secondary hover:text-text cursor-pointer bg-transparent border-0"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <form onSubmit={handleAddOverride}>
                                <div className="flex flex-col gap-3.5 mb-5">
                                    <div>
                                        <label className="text-xs font-semibold text-secondary block mb-1.5">
                                            Select Date <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            min={todayString}
                                            value={newOverrideDate}
                                            onChange={(e) => setNewOverrideDate(e.target.value)}
                                            className={`form-control text-xs w-full ${isDateAlreadyOverridden || isDateInPast ? 'border-danger' : ''}`}
                                            style={isDateAlreadyOverridden || isDateInPast ? { borderColor: 'var(--danger, #ef4444)' } : undefined}
                                            required
                                        />
                                        {isDateAlreadyOverridden && (
                                            <div className="text-danger text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                                                <i className="fas fa-exclamation-circle"></i>
                                                An override for this date already exists in your schedule.
                                            </div>
                                        )}
                                        {isDateInPast && (
                                            <div className="text-danger text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                                                <i className="fas fa-exclamation-circle"></i>
                                                Please select today or a future date.
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-secondary block mb-1.5">
                                            Override Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewOverrideIsOff(true)}
                                                className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                                                    newOverrideIsOff
                                                        ? 'text-primary font-semibold'
                                                        : 'text-secondary hover:text-text'
                                                }`}
                                                style={
                                                    newOverrideIsOff
                                                        ? { borderColor: 'var(--primary)', backgroundColor: 'rgba(212, 172, 119, 0.15)' }
                                                        : { borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }
                                                }
                                            >
                                                <i className="fas fa-bed mr-1.5"></i> Full Day Off
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewOverrideIsOff(false)}
                                                className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                                                    !newOverrideIsOff
                                                        ? 'text-primary font-semibold'
                                                        : 'text-secondary hover:text-text'
                                                }`}
                                                style={
                                                    !newOverrideIsOff
                                                        ? { borderColor: 'var(--primary)', backgroundColor: 'rgba(212, 172, 119, 0.15)' }
                                                        : { borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }
                                                }
                                            >
                                                <i className="fas fa-business-time mr-1.5"></i> Custom Hours
                                            </button>
                                        </div>
                                    </div>

                                    {newOverrideIsOff ? (
                                        <div
                                            className="p-3 rounded-lg border flex items-center gap-2.5 text-xs text-secondary"
                                            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-elevated)' }}
                                        >
                                            <i className="fas fa-info-circle text-primary text-sm shrink-0"></i>
                                            <span>Full day off: Leads and bookings are paused all day (no working hours).</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <div
                                                className="grid grid-cols-2 gap-3 p-3 rounded-lg border"
                                                style={{
                                                    borderColor: isTimeInvalid ? 'var(--danger, #ef4444)' : 'var(--border)',
                                                    backgroundColor: 'var(--surface-elevated)'
                                                }}
                                            >
                                                <div>
                                                    <label className="text-xs text-secondary block mb-1 font-medium">Start Time <span className="text-danger">*</span></label>
                                                    <input
                                                        type="time"
                                                        value={newOverrideStartTime}
                                                        onChange={(e) => setNewOverrideStartTime(e.target.value)}
                                                        className="form-control text-xs w-full"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-secondary block mb-1 font-medium">End Time <span className="text-danger">*</span></label>
                                                    <input
                                                        type="time"
                                                        value={newOverrideEndTime}
                                                        onChange={(e) => setNewOverrideEndTime(e.target.value)}
                                                        className="form-control text-xs w-full"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            {!newOverrideIsOff && newOverrideStartTime >= newOverrideEndTime && (
                                                <div className="text-danger text-[11px] mt-1.5 flex items-center gap-1 font-medium">
                                                    <i className="fas fa-exclamation-circle"></i>
                                                    End time must be after start time.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-semibold text-secondary block mb-0">
                                                Reason / Label
                                            </label>
                                            <span className={`text-[10px] ${newOverrideLabel.length > 255 ? 'text-danger font-bold' : 'text-muted'}`}>
                                                {newOverrideLabel.length}/255
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={255}
                                            placeholder="e.g. Festival, Doctor Appointment"
                                            value={newOverrideLabel}
                                            onChange={(e) => setNewOverrideLabel(e.target.value)}
                                            className="form-control text-xs w-full"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-top">
                                    <button
                                        type="button"
                                        onClick={handleCloseOverrideModal}
                                        className="btn btn-outline btn-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                        disabled={createOverride.isPending || isDateAlreadyOverridden || isDateInPast || isTimeInvalid || !newOverrideDate || isReasonTooLong}
                                    >
                                        {createOverride.isPending ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-1.5"></i> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check mr-1.5"></i> Save Override
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={Boolean(overrideToDelete)}
                    title="Delete Date Override"
                    message="Are you sure you want to remove this date override? Your regular weekly schedule will apply on this day."
                    confirmText="Delete"
                    cancelText="Cancel"
                    isDanger={true}
                    isLoading={deleteOverride.isPending}
                    onConfirm={handleConfirmDeleteOverride}
                    onCancel={() => setOverrideToDelete(null)}
                />
            </div>

            <div className="settings-card-panel fade-in" id="sec-travel-buffer">
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h2 className="h5 mb-1 font-bold">Travel Buffer Time</h2>
                        <p className="text-xs text-secondary mb-0">
                            Time reserved between jobs to account for travel commute and delays. Minimum is 30 mins.
                        </p>
                    </div>
                    <span className="badge badge-primary text-xs font-semibold px-2.5 py-1">
                        <i className="fas fa-clock mr-1.5"></i>
                        {bufferMinutes} Mins Buffer
                    </span>
                </div>

                <div
                    className="p-4 rounded-xl border mt-3 mb-4"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
                >
                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <div>
                            <span className="text-xs uppercase font-bold tracking-wider text-secondary block mb-1">
                                Transit Protection Buffer
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-primary">{bufferMinutes} mins</span>
                                <span className="text-xs text-muted font-medium">(Minimum 30 mins)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => handleStepBuffer(-5)}
                                disabled={bufferMinutes <= 30}
                                className="btn btn-outline btn-xs"
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Decrease 5 mins (Min 30 mins)"
                            >
                                <i className="fas fa-minus"></i>
                            </button>

                            <div className="flex items-center gap-1.5">
                                {BUFFER_PRESETS.map((mins) => {
                                    const isSelected = bufferMinutes === mins;
                                    return (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => setBufferMinutes(mins)}
                                            className={`btn btn-xs ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                                            style={{ minWidth: '48px', height: '32px' }}
                                        >
                                            {mins}m
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleStepBuffer(5)}
                                disabled={bufferMinutes >= 120}
                                className="btn btn-outline btn-xs"
                                style={{ width: '32px', height: '32px', padding: 0 }}
                                title="Increase 5 mins"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-semibold text-text">Customize Buffer Window</span>
                            <span className="text-xs font-bold text-primary">{bufferMinutes} mins</span>
                        </div>
                        <input
                            type="range"
                            className="custom-range-slider cursor-pointer"
                            min="30"
                            max="120"
                            step="5"
                            value={bufferMinutes}
                            onChange={(e) => setBufferMinutes(Math.max(30, Number(e.target.value)))}
                            style={{ width: '100%' }}
                        />
                        <div className="flex justify-between text-[11px] text-secondary mt-1">
                            <span>30m (Min)</span>
                            <span>45m</span>
                            <span>60m</span>
                            <span>90m</span>
                            <span>120m (Max)</span>
                        </div>
                    </div>

                    <div
                        className="p-3 rounded-lg border mt-3 flex items-start gap-2.5"
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                    >
                        <i className="fas fa-info-circle text-primary text-sm mt-0.5"></i>
                        <p className="text-xs text-secondary mb-0 leading-relaxed">
                            Booking calendar automatically ensures at least <strong className="text-text font-bold">{bufferMinutes} mins</strong> transit cushion after each completed job before the next customer appointment can begin.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleSaveBuffer}
                        disabled={isSavingBuffer}
                        className="btn btn-primary btn-sm"
                    >
                        {isSavingBuffer ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-1.5"></i> Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save mr-1.5"></i> Save Buffer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AvailabilitySettings = React.memo(AvailabilitySettingsComponent);
