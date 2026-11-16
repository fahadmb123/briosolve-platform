import { z } from "zod";

export const reopenServiceRequestSchema = z.object({
    urgency: z.enum(["TODAY", "THIS_WEEK", "SPECIFIC_DATE", "FLEXIBLE"]),
    specificDate: z.string().optional().nullable(),
    availableTimeFrom: z.string().optional(),
    availableTimeTo: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.urgency === "SPECIFIC_DATE") {
        if (!data.specificDate || !data.specificDate.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Specific date is required when urgency is SPECIFIC_DATE",
                path: ["specificDate"]
            });
        }
    }

    if (data.availableTimeFrom && data.availableTimeTo) {
        if (data.availableTimeFrom >= data.availableTimeTo) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Available end time must be later than start time",
                path: ["availableTimeTo"]
            });
        }
    }

    if (data.specificDate && data.availableTimeTo) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const todayStr = `${year}-${month}-${day}`;
        if (data.specificDate === todayStr) {
            const [hours, minutes] = data.availableTimeTo.split(":").map(Number);
            const deadline = new Date();
            deadline.setHours(
                !isNaN(hours) ? hours : 23,
                !isNaN(minutes) ? minutes : 59,
                59,
                999
            );
            if (now.getTime() >= deadline.getTime()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "The scheduled time for today has already passed. Please choose a future time or date.",
                    path: ["availableTimeTo"]
                });
            }
        } else if (data.specificDate < todayStr) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selected date cannot be in the past",
                path: ["specificDate"]
            });
        }
    }
});

export type ReopenServiceRequestSchema = z.infer<typeof reopenServiceRequestSchema>;
