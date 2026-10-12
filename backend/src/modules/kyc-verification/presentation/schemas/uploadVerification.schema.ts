import { z } from "zod";

export const uploadVerificationSchema = z.object({
    document_type: z.enum(["IDENTITY", "CERTIFICATE"], {
        message: "Document type must be IDENTITY or CERTIFICATE",
    }),
    document_name: z.string().trim().min(2, "Document name must be at least 2 characters").max(100, "Document name must not exceed 100 characters"),
});

export type UploadVerificationFormData = z.infer<typeof uploadVerificationSchema>;
