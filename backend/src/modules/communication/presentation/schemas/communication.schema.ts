import { z } from "zod";

export const generateCallTokenSchema = z.object({
    roomName: z.string().min(1, "Room name is required"),
    participantName: z.string().optional(),
    callType: z.enum(["audio", "video"]).optional().default("audio")
});

export type GenerateCallTokenSchema = z.infer<typeof generateCallTokenSchema>;
