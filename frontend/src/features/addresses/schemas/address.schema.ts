import { z } from "zod";

export const addressSchema = z.object({
  house_no: z.string().min(1, "House number is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().length(6, "Pincode must be exactly 6 characters"),
  landmark: z.string().min(1, "Landmark is required")
});

export type AddressInputType = z.infer<typeof addressSchema>;

export interface AddressPayload extends AddressInputType {
  id?: string;
  type: string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}
