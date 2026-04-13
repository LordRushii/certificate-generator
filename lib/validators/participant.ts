import { z } from "zod";

export const participantRowSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
});

export type ParticipantRow = z.infer<typeof participantRowSchema>;
