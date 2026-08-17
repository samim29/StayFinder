import { z } from "zod";

export const pgSchema = z.object({
  title: z.string().trim().min(3, "PG name must be at least 3 characters").max(100),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
  rent: z.coerce.number().min(0, "Rent cannot be negative"),
  roomTypes: z.array(z.enum(["single", "double", "triple"])).min(1, "Select a room type"),
  totalBeds: z.coerce.number().int().min(1, "At least one bed is required"),
  availableBeds: z.coerce.number().int().min(0, "Available beds cannot be negative"),
  address: z.string().trim().min(5, "Enter the full address").max(300),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  amenities: z.array(z.string()),
  genderPreference: z.enum(["boys", "girls", "co-ed"]),
  contactPhone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  contactEmail: z.union([z.literal(""), z.string().email("Enter a valid email")]),
}).refine((data) => data.availableBeds <= data.totalBeds, {
  path: ["availableBeds"],
  message: "Available beds cannot exceed total beds",
});
