import { z } from "zod";

export const createServiceRequestSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    subserviceId: z.string().min(1, "Please select a service"),
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
    description: z.string().trim().min(15, "Description must be at least 15 characters").max(1000, "Description cannot exceed 1000 characters"),
    urgency: z.enum(["TODAY", "THIS_WEEK", "SPECIFIC_DATE", "FLEXIBLE"]),
    specificDate: z.string().optional().nullable(),
    selectedAddressId: z.string().min(1, "Address is required"),
    availableTimeFrom: z.string().min(1, "Available start time is required"),
    availableTimeTo: z.string().min(1, "Available end time is required"),
    budgetType: z.enum(["OPEN_BID", "FIXED"]),
    budgetAmount: z.string().optional().nullable(),
    images: z.array(z.string()).min(1, "At least 1 image is required")
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

export type CreateServiceRequestSchema = z.infer<typeof createServiceRequestSchema>;
