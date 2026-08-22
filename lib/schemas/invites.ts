import { z } from "zod";

export const rsvpInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  status: z.enum(["pending", "accepted", "maybe", "declined"]),
});

export function parseRsvp(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    status: formData.get("status"),
  };

  return rsvpInputSchema.safeParse(raw);
}
