import { z } from "zod";

export const quotationSchema = z.object({
  amount: z
    .union([z.string(), z.number()])
    .refine((val) => {
      if (val === "" || val === null || val === undefined) return false;
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "Quotation amount must be a positive number" })
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 50;
    }, { message: "Quotation amount must be at least ₹50" })
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num <= 1000000;
    }, { message: "Quotation amount cannot exceed ₹10,00,000" }),

  quotationType: z.enum(["FIXED", "ESTIMATED", "INSPECTION_REQUIRED"], {
    message: "Please select a quotation type"
  }),

  workDescription: z
    .string()
    .trim()
    .min(1, { message: "Work description is required" })
    .min(15, { message: "Work description must be at least 15 characters" })
    .max(1000, { message: "Work description cannot exceed 1000 characters" }),

  includedItems: z
    .array(
      z
        .string()
        .trim()
        .min(2, { message: "Each included item must be at least 2 characters" })
        .max(100, { message: "Included item cannot exceed 100 characters" })
    )
    .min(1, { message: "Please specify at least one included item or service" }),

  excludedItems: z
    .array(
      z
        .string()
        .trim()
        .min(2, { message: "Each excluded item must be at least 2 characters" })
        .max(100, { message: "Excluded item cannot exceed 100 characters" })
    )
    .min(1, { message: "Please specify what is not included to avoid disputes" }),

  estimatedDuration: z
    .string()
    .trim()
    .max(60, { message: "Estimated duration cannot exceed 60 characters" })
    .optional(),

  availableDateTime: z
    .string()
    .trim()
    .max(80, { message: "Available date/time cannot exceed 80 characters" })
    .optional(),

  validUntil: z.enum(["24_HOURS", "48_HOURS", "3_DAYS", "7_DAYS"], {
    message: "Please select quotation validity period"
  }),

  extraChargePolicy: z
    .string()
    .trim()
    .min(1, { message: "Extra-charge policy is required" })
    .min(5, { message: "Extra-charge policy must be at least 5 characters" })
    .max(300, { message: "Policy cannot exceed 300 characters" })
});

export type QuotationInputType = z.infer<typeof quotationSchema>;
export type QuotationSchemaType = QuotationInputType;
