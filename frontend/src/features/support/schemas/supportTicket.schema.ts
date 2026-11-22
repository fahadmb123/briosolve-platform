import { z } from "zod";

export const createSupportTicketFormSchema = z.object({
  concernType: z.enum(["BOOKING", "GENERAL"]),
  selectedBookingId: z.string().optional(),
  generalTopic: z.string().optional(),
  issueReason: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(1, { message: "Please describe what happened" })
    .min(15, { message: "Description must be at least 15 characters" })
    .max(2000, { message: "Description cannot exceed 2000 characters" })
}).superRefine((data, ctx) => {
  if (data.concernType === "BOOKING") {
    if (!data.selectedBookingId || !data.selectedBookingId.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a booking to link with this ticket",
        path: ["selectedBookingId"]
      });
    }
    if (!data.issueReason || !data.issueReason.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select the primary issue reason",
        path: ["issueReason"]
      });
    }
  } else {
    if (!data.generalTopic || !data.generalTopic.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a topic for your concern",
        path: ["generalTopic"]
      });
    }
  }
});

export type CreateSupportTicketFormData = z.infer<typeof createSupportTicketFormSchema>;
export const supportTicketSchema = createSupportTicketFormSchema;
export type SupportTicketInputType = CreateSupportTicketFormData;

export const updateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"]),
  resolutionNote: z
    .string()
    .trim()
    .max(1000, "Resolution note cannot exceed 1000 characters")
    .optional()
}).superRefine((data, ctx) => {
  if (data.status === "RESOLVED" || data.status === "CLOSED") {
    if (!data.resolutionNote || data.resolutionNote.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Resolution note is required when resolving or closing a ticket",
        path: ["resolutionNote"]
      });
    } else if (data.resolutionNote.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Resolution note must be at least 10 characters",
        path: ["resolutionNote"]
      });
    }
  }
});

export type UpdateTicketStatusFormData = z.infer<typeof updateTicketStatusSchema>;
