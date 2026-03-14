import { z } from "zod";

export const participantRowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export type ParticipantRow = z.infer<typeof participantRowSchema>;
