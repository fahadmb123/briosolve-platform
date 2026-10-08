import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const imageFileSchema = z.object({
  mimetype: z.string().refine((val) => val.startsWith("image/"), {
    message: "File must be an image",
  }),
  size: z.number().max(MAX_FILE_SIZE, {
    message: "Image size must be less than 5MB",
  }),
}).passthrough();
