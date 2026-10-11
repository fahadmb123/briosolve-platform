import { z } from "zod";

export const weekdayEnum = z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
]);

export const availabilitySlotSchema = z.object({
    day_of_week: weekdayEnum,
    start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format (HH:MM)"),
    end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format (HH:MM)")
});

export const setProviderAvailabilitySchema = z.object({
    slots: z.array(availabilitySlotSchema)
});

export type SetProviderAvailabilityInputType = z.infer<typeof setProviderAvailabilitySchema>;

export const createAvailabilityOverrideSchema = z.object({
    override_date: z.string(),
    type: z.enum(["DAY_OFF", "CUSTOM_HOURS"]),
    start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format (HH:MM)").optional().nullable(),
    end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format (HH:MM)").optional().nullable(),
    reason: z.string().max(255).optional().nullable()
});

export type CreateAvailabilityOverrideInputType = z.infer<typeof createAvailabilityOverrideSchema>;
