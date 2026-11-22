import { z } from "zod";

export const updateTicketStatusSchema = z.object({
  status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"]),
  resolutionNote: z.string().trim().max(1000).optional().nullable()
});

export type UpdateTicketStatusSchemaType = z.infer<typeof updateTicketStatusSchema>;
