import { z } from "zod";

export const compareQuotationsSchema = z.object({
    serviceRequestId: z.string().uuid("Invalid service request identifier"),
    topN: z.number().int().min(1).max(5).optional()
});
