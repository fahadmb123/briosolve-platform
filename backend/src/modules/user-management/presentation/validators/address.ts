import z from "zod";


export const addressSchema = z.object({
  houseNo: z.string().min(1, "House number is required"),
  area: z.string().min(1, "Area is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  pincode: z.string().length(6, "Pincode must be exactly 6 characters"),
  landmark: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
})




export type AddressInputType = z.infer<typeof addressSchema>;
