"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Resend } from "resend";

export const sendCertificateEmails = action({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) throw new Error("RESEND_API_KEY is not configured");
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

    const resend = new Resend(resendKey);

    const event = await ctx.runQuery(api.events.getEvent, { eventId });
    if (!event) throw new Error("Event not found");

    const participants = await ctx.runQuery(api.participants.listParticipants, {
      eventId,
    });

    const pending = participants.filter(
      (p) => p.emailStatus !== "sent" && p.certificateStorageId
    );

    if (pending.length === 0) throw new Error("No pending certificates to send");

    await ctx.runMutation(api.events.updateEvent, { eventId, status: "emailing" });

    for (const participant of pending) {
      try {
        const pdfBlob = await ctx.storage.get(participant.certificateStorageId!);
        if (!pdfBlob) throw new Error("Certificate file not found");

        const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
        const filename = `certificate-${participant.name
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`;

        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: participant.email,
          subject: `Your certificate for ${event.name}`,
          html: `
            <p>Dear ${participant.name},</p>
            <p>Please find your certificate for <strong>${event.name}</strong> attached to this email.</p>
            <p>Congratulations!</p>
          `,
          attachments: [{ filename, content: pdfBuffer }],
        });

        if (sendError) throw new Error(sendError.message);

        await ctx.runMutation(api.participants.updateParticipantEmailStatus, {
          participantId: participant._id,
          emailStatus: "sent",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`Email failed for ${participant.email}: ${message}`);
        await ctx.runMutation(api.participants.updateParticipantEmailStatus, {
          participantId: participant._id,
          emailStatus: "failed",
          emailError: message,
        });
      }
    }

    await ctx.runMutation(api.events.updateEvent, {
      eventId,
      status: "completed",
    });
  },
});
