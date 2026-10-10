import { z } from "zod";

export const completeProviderRegistrationSchema = z.object({
  services: z.array(z.string()).min(1, { message: "Please select at least one service" }),
  experience: z.string({ message: "Please select your years of experience" }).min(1),
  skills: z.string().optional(),
  bio: z.string().min(10, { message: "Please provide a brief professional overview" })
});

export type CompleteProviderRegistrationInputType = z.infer<typeof completeProviderRegistrationSchema>;
