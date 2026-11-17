import { z } from "zod";

const normalizeValidity = (val: string): "HOURS_24" | "HOURS_48" | "DAYS_3" | "DAYS_7" => {
    switch (val) {
        case "24_HOURS":
        case "HOURS_24":
            return "HOURS_24";
        case "48_HOURS":
        case "HOURS_48":
            return "HOURS_48";
        case "3_DAYS":
        case "DAYS_3":
            return "DAYS_3";
        case "7_DAYS":
        case "DAYS_7":
            return "DAYS_7";
        default:
            return "HOURS_24";
    }
};

export const updateQuotationSchema = z.object({
    amount: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine((num) => !isNaN(num) && num >= 50, "Quotation amount must be at least ₹50")
        .refine((num) => num <= 1000000, "Quotation amount cannot exceed ₹10,00,000"),
    quotationType: z.enum(["FIXED", "ESTIMATED", "INSPECTION_REQUIRED"], {
        message: "Quotation type must be FIXED, ESTIMATED, or INSPECTION_REQUIRED"
    }),
    workDescription: z
        .string()
        .trim()
        .min(15, "Work description must be at least 15 characters")
        .max(1000, "Work description cannot exceed 1000 characters"),
    includedItems: z
        .array(z.string().trim().min(2, "Each included item must be at least 2 characters").max(100))
        .min(1, "Please specify at least one included item or service"),
    excludedItems: z
        .array(z.string().trim().min(2, "Each excluded item must be at least 2 characters").max(100))
        .min(1, "Please specify what is not included to avoid disputes"),
    estimatedDuration: z.string().trim().max(60).optional().nullable(),
    availableDateTime: z.string().trim().max(80).optional().nullable(),
    validUntil: z
        .enum(["24_HOURS", "48_HOURS", "3_DAYS", "7_DAYS", "HOURS_24", "HOURS_48", "DAYS_3", "DAYS_7"])
        .transform(normalizeValidity),
    extraChargePolicy: z
        .string()
        .trim()
        .min(5, "Extra-charge policy must be at least 5 characters")
        .max(300, "Extra-charge policy cannot exceed 300 characters")
});

export type UpdateQuotationSchema = z.infer<typeof updateQuotationSchema>;
