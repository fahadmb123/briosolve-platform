import { z } from "zod";

export const quotationSchema = z.object({
  amount: z
    .union([z.number(), z.string()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "Quotation amount must be a positive number greater than 0" }),
  quotationType: z.enum(["FIXED", "ESTIMATED", "INSPECTION_REQUIRED"], {
    message: "Please select a quotation type"
  }),
  workDescription: z
    .string()
    .min(1, { message: "Work description is required" })
    .trim()
    .min(10, { message: "Work description must be at least 10 characters" })
    .max(1000, { message: "Work description cannot exceed 1000 characters" }),
  includedItems: z
    .array(z.string().trim().min(1))
    .min(1, { message: "Please specify at least one included item or service" }),
  excludedItems: z
    .array(z.string().trim().min(1))
    .min(1, { message: "Please specify what is not included to avoid disputes" }),
  estimatedDuration: z
    .string()
    .trim()
    .optional(),
  availableDateTime: z
    .string()
    .trim()
    .optional(),
  messageToCustomer: z
    .string()
    .trim()
    .max(500, { message: "Message to customer cannot exceed 500 characters" })
    .optional(),
  validUntil: z
    .string()
    .min(1, { message: "Please choose quotation validity period" }),
  extraChargePolicy: z
    .string()
    .min(1, { message: "Extra-charge policy is required" })
    .trim()
    .min(5, { message: "Extra-charge policy must be at least 5 characters" })
    .max(300, { message: "Extra-charge policy cannot exceed 300 characters" })
});

export type QuotationSchemaType = z.infer<typeof quotationSchema>;
