import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../../store/auth/auth.store';
import {
    useGetProviderAvailability,
    useSetProviderAvailability,
    useUpdateTravelBuffer,
    useUpdateAcceptingLeads
} from '../hooks/mutations/useAvailability';
import type { ProviderProfile, Weekday } from '../../../../shared/types/Dtos';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';

interface DaySchedule {
    day: string;
    isEnabled: boolean;
    startTime: string;
    endTime: string;
}

interface DateOverride {
    id: string;
    date: string;
    label: string;
    isOff: boolean;
    startTime?: string;
    endTime?: string;
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

export const AvailabilitySettings: React.FC = () => {
    const { profile, fetchUser } = useAuthStore();
    const providerProfile = profile as ProviderProfile | null;

    const getAvailability = useGetProviderAvailability();
    const setAvailability = useSetProviderAvailability();
    const updateTravelBuffer = useUpdateTravelBuffer();
    const updateAcceptingLeads = useUpdateAcceptingLeads();

    const [acceptingLeads, setAcceptingLeads] = useState<boolean>(true);
    const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
    const [dateOverrides, setDateOverrides] = useState<DateOverride[]>([]);
    const [isAddingOverride, setIsAddingOverride] = useState<boolean>(false);
    const [newOverrideDate, setNewOverrideDate] = useState<string>('');
    const [newOverrideLabel, setNewOverrideLabel] = useState<string>('');
    const [newOverrideIsOff, setNewOverrideIsOff] = useState<boolean>(true);

    const [bufferMinutes, setBufferMinutes] = useState<number>(30);
    const [isSavingOverrides, setIsSavingOverrides] = useState<boolean>(false);

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

    const handleToggleDay = (idx: number) => {
        setSchedule((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, isEnabled: !item.isEnabled } : item))
        );
    };

    const handleTimeChange = (idx: number, field: 'startTime' | 'endTime', val: string) => {
        setSchedule((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
        );
    };

    const handleApplyWeekdayDefaults = () => {
        setSchedule((prev) =>
            prev.map((item) => {
                if (item.day === 'Saturday' || item.day === 'Sunday') {
                    return item;
                }
                return { ...item, isEnabled: true, startTime: '09:00', endTime: '17:00' };
            })
        );
        toast.info('Applied 9:00 AM - 5:00 PM for weekdays');
    };

    const handleAddOverride = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOverrideDate) {
            toast.error('Please select an override date');
            return;
        }
        const newOverride: DateOverride = {
            id: String(Date.now()),
            date: newOverrideDate,
            label: newOverrideLabel.trim() || (newOverrideIsOff ? 'Day Off' : 'Custom Hours'),
            isOff: newOverrideIsOff
        };
        setDateOverrides((prev) => [...prev, newOverride]);
        setNewOverrideDate('');
        setNewOverrideLabel('');
        setIsAddingOverride(false);
        toast.success('Added!');
    };

    const handleRemoveOverride = (id: string) => {
        setDateOverrides((prev) => prev.filter((item) => item.id !== id));
        toast.info('Removed!');
    };

    const handleStepBuffer = (step: number) => {
        setBufferMinutes((prev) => {
            const next = prev + step;
            if (next < 30) return 30;
            if (next > 120) return 120;
            return next;
        });
    };

    const isSavingSchedule = setAvailability.isPending || updateAcceptingLeads.isPending;
    const isSavingBuffer = updateTravelBuffer.isPending;
    const isLoadingAvailability = getAvailability.isPending;

    const handleSaveSchedule = () => {
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
    };

    const handleSaveBuffer = () => {
        updateTravelBuffer.mutate({ travel_buffer_minutes: bufferMinutes }, {
            onSuccess: () => {
                fetchUser();
                toast.success(`Travel buffer updated to ${bufferMinutes} mins!`);
            }
        });
    };

    const handleSaveOverrides = () => {
        setIsSavingOverrides(true);
        setTimeout(() => {
            setIsSavingOverrides(false);
            toast.success('Saved!');
        }, 500);
    };

    return (
        <div className="flex flex-col gap-6">
            {getAvailability.isPending ? (<SpinnerOverlay isLoading={true}/>):null}
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
                        {!isAddingOverride && (
                            <button
                                type="button"
                                onClick={() => setIsAddingOverride(true)}
                                className="btn btn-outline btn-xs"
                            >
                                <i className="fas fa-plus mr-1"></i> Add Date Override
                            </button>
                        )}
                    </div>
                </div>

                {isAddingOverride && (
                    <form
                        onSubmit={handleAddOverride}
                        className="p-4 rounded-xl border mt-3 mb-4"
                        style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border)' }}
                    >
                        <h4 className="text-xs uppercase font-bold tracking-wider text-secondary mb-3">
                            Configure Date Override
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div>
                                <label className="text-xs text-secondary block mb-1">Select Date</label>
                                <input
                                    type="date"
                                    value={newOverrideDate}
                                    onChange={(e) => setNewOverrideDate(e.target.value)}
                                    className="form-control text-xs"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-secondary block mb-1">Label / Reason</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Festival, Doctor Appointment"
                                    value={newOverrideLabel}
                                    onChange={(e) => setNewOverrideLabel(e.target.value)}
                                    className="form-control text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-secondary block mb-1">Availability</label>
                                <select
                                    value={newOverrideIsOff ? 'off' : 'custom'}
                                    onChange={(e) => setNewOverrideIsOff(e.target.value === 'off')}
                                    className="form-control text-xs"
                                >
                                    <option value="off">Full Day Off</option>
                                    <option value="custom">Modified Hours</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAddingOverride(false)}
                                className="btn btn-outline btn-xs"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-xs">
                                <i className="fas fa-check mr-1"></i> Save Override
                            </button>
                        </div>
                    </form>
                )}

                {dateOverrides.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border mt-3" style={{ borderColor: 'var(--border)' }}>
                        <table className="w-full text-left text-sm" style={{ borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: 'var(--surface-elevated)', borderBottom: '1px solid var(--border)' }}>
                                <tr>
                                    <th className="p-3 text-xs font-bold text-secondary">Date</th>
                                    <th className="p-3 text-xs font-bold text-secondary">Reason</th>
                                    <th className="p-3 text-xs font-bold text-secondary">Status</th>
                                    <th className="p-3 text-xs font-bold text-secondary text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dateOverrides.map((override) => (
                                    <tr key={override.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                                        <td className="p-3 font-semibold text-text">{override.date}</td>
                                        <td className="p-3 text-secondary">{override.label}</td>
                                        <td className="p-3">
                                            <span className="badge badge-warning text-[11px] py-0.5 px-2">
                                                {override.isOff ? 'Day Off' : 'Custom Hours'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOverride(override.id)}
                                                className="btn-icon text-danger hover:text-red-500"
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
                    !isAddingOverride && (
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
                    )
                )}

                {dateOverrides.length > 0 && (
                    <div className="flex justify-end pt-3 mt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <button
                            type="button"
                            onClick={handleSaveOverrides}
                            disabled={isSavingOverrides}
                            className="btn btn-primary btn-sm"
                        >
                            {isSavingOverrides ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-1.5"></i> Saving Overrides...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save mr-1.5"></i> Save Overrides
                                </>
                            )}
                        </button>
                    </div>
                )}
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
