import { z } from "zod";

export const serviceRequestSchema = z.object({
  categoryId: z.string().min(1, { message: "Please select a service category" }),
  subserviceId: z.string().optional(),
  title: z
    .string()
    .min(1, { message: "Job title is required" })
    .trim()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .trim()
    .min(15, { message: "Description must be at least 15 characters" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),
  urgency: z.enum(["TODAY", "THIS_WEEK", "SPECIFIC_DATE", "FLEXIBLE"], {
    message: "Please choose when you need this"
  }),
  specificDate: z.string().optional(),
  selectedAddressId: z.string().min(1, { message: "Please select a service location address" }),
  availableTimeFrom: z.string().min(1, { message: "Start time is required" }),
  availableTimeTo: z.string().min(1, { message: "End time is required" }),
  budgetType: z.enum(["OPEN_BID", "FIXED"]),
  budgetAmount: z.string().optional(),
  agreedToPolicy: z.boolean().refine((val) => val === true, {
    message: "You must accept the marketplace policy and terms before posting"
  })
}).superRefine((data, ctx) => {
  if (data.urgency === "SPECIFIC_DATE") {
    if (!data.specificDate || !data.specificDate.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a specific date",
        path: ["specificDate"]
      });
    } else {
      const todayStr = new Date().toISOString().split("T")[0];
      if (data.specificDate < todayStr) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selected date cannot be in the past",
          path: ["specificDate"]
        });
      }
    }
  }

  if (data.availableTimeFrom && data.availableTimeTo) {
    if (data.availableTimeFrom >= data.availableTimeTo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be later than start time",
        path: ["availableTimeTo"]
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
          message: "Minimum budget amount is ₹100",
          path: ["budgetAmount"]
        });
      } else if (num > 100000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum budget amount is ₹1,00,000",
          path: ["budgetAmount"]
        });
      }
    }
  }
});

export type ServiceRequestInputType = z.infer<typeof serviceRequestSchema>;
