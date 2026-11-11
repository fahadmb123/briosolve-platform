import { z } from "zod";

export const sendCommunicationSchema = z.object({
    recipientId: z.string().min(1, "Recipient ID is required"),
    channel: z.enum(["EMAIL", "SMS", "IN_APP", "PUSH"]),
    subject: z.string().optional().nullable(),
    content: z.string().min(1, "Content is required"),
    metadata: z.record(z.string(), z.unknown()).optional().nullable()
});

export const getCommunicationsSchema = z.object({
    channel: z.enum(["EMAIL", "SMS", "IN_APP", "PUSH"]).optional(),
    status: z.enum(["PENDING", "SENT", "DELIVERED", "FAILED", "READ"]).optional(),
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10))
});

export const generateCallTokenSchema = z.object({
    roomName: z.string().min(1, "Room name is required"),
    participantName: z.string().optional(),
    callType: z.enum(["audio", "video"]).optional().default("audio")
});

export type SendCommunicationSchema = z.infer<typeof sendCommunicationSchema>;
export type GetCommunicationsSchema = z.infer<typeof getCommunicationsSchema>;
export type GenerateCallTokenSchema = z.infer<typeof generateCallTokenSchema>;
