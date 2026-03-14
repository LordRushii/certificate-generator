import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
