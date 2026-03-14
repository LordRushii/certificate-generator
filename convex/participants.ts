import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listParticipants = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect();
    return Promise.all(
      participants.map(async (p) => ({
        ...p,
        certificateUrl: p.certificateStorageId
          ? await ctx.storage.getUrl(p.certificateStorageId)
          : null,
      }))
    );
  },
});

export const upsertParticipants = mutation({
  args: {
    eventId: v.id("events"),
    participants: v.array(
      v.object({
        name: v.string(),
        email: v.string(),
      })
    ),
  },
  handler: async (ctx, { eventId, participants }) => {
    const existing = await ctx.db
      .query("participants")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect();
    for (const p of existing) {
      if (p.certificateStorageId) {
        await ctx.storage.delete(p.certificateStorageId);
      }
      await ctx.db.delete(p._id);
    }
    for (const p of participants) {
      await ctx.db.insert("participants", {
        eventId,
        name: p.name,
        email: p.email,
        emailStatus: "pending",
      });
    }
  },
});

export const updateParticipantName = mutation({
  args: {
    participantId: v.id("participants"),
    name: v.string(),
  },
  handler: async (ctx, { participantId, name }) => {
    await ctx.db.patch(participantId, { name });
  },
});

export const updateParticipantCertificate = mutation({
  args: {
    participantId: v.id("participants"),
    certificateStorageId: v.id("_storage"),
  },
  handler: async (ctx, { participantId, certificateStorageId }) => {
    await ctx.db.patch(participantId, { certificateStorageId });
  },
});

export const updateParticipantEmailStatus = mutation({
  args: {
    participantId: v.id("participants"),
    emailStatus: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, { participantId, emailStatus }) => {
    await ctx.db.patch(participantId, { emailStatus });
  },
});

export const deleteParticipant = mutation({
  args: { participantId: v.id("participants") },
  handler: async (ctx, { participantId }) => {
    const participant = await ctx.db.get(participantId);
    if (participant?.certificateStorageId) {
      await ctx.storage.delete(participant.certificateStorageId);
    }
    await ctx.db.delete(participantId);
  },
});
