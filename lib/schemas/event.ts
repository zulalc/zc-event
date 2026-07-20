import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  eventDate: z.string().min(1, "Date is required"),
});
