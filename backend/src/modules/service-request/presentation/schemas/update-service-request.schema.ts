import { z } from "zod";

export const updateServiceRequestSchema = z.object({
    categoryId: z.string().optional(),
    subserviceId: z.string().optional().nullable(),
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters").optional(),
    description: z.string().trim().min(15, "Description must be at least 15 characters").max(1000, "Description cannot exceed 1000 characters").optional(),
    urgency: z.enum(["TODAY", "THIS_WEEK", "SPECIFIC_DATE", "FLEXIBLE"]).optional(),
    specificDate: z.string().optional().nullable(),
    selectedAddressId: z.string().optional(),
    availableTimeFrom: z.string().optional(),
    availableTimeTo: z.string().optional(),
    budgetType: z.enum(["OPEN_BID", "FIXED"]).optional(),
    budgetAmount: z.string().optional().nullable(),
    images: z.array(z.string()).max(5, "Maximum 5 images allowed").optional()
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

    if (data.budgetType === "FIXED") {
        if (!data.budgetAmount || !data.budgetAmount.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Budget amount is required for fixed budget",
                path: ["budgetAmount"]
            });
        } else {
            const num = Number(data.budgetAmount);
            if (isNaN(num) || num < 100) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Minimum budget amount is 100",
                    path: ["budgetAmount"]
                });
            }
        }
    }
});

export type UpdateServiceRequestSchema = z.infer<typeof updateServiceRequestSchema>;

