import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("events").order("desc").collect();
  },
});

export const getEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) return null;
    const templateUrl = event.templateStorageId
      ? await ctx.storage.getUrl(event.templateStorageId)
      : null;
    return { ...event, templateUrl };
  },
});

export const createEvent = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { name, description }) => {
    return await ctx.db.insert("events", {
      name,
      description,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

export const updateEvent = mutation({
  args: {
    eventId: v.id("events"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    templateStorageId: v.optional(v.id("_storage")),
    templateType: v.optional(
      v.union(v.literal("pdf"), v.literal("png"), v.literal("jpg"))
    ),
    namePosition: v.optional(
      v.object({
        x: v.number(),
        y: v.number(),
        fontSize: v.number(),
        fontColor: v.optional(v.string()),
        font: v.optional(v.string()),
      })
    ),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("generating"),
        v.literal("generated"),
        v.literal("emailing"),
        v.literal("completed")
      )
    ),
  },
  handler: async (
    ctx,
    {
      eventId,
      name,
      description,
      templateStorageId,
      templateType,
      namePosition,
      status,
    }
  ) => {
    const existing = await ctx.db.get(eventId);
    if (!existing) throw new Error("Event not found");
    await ctx.db.patch(eventId, {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(templateStorageId !== undefined && { templateStorageId }),
      ...(templateType !== undefined && { templateType }),
      ...(namePosition !== undefined && { namePosition }),
      ...(status !== undefined && { status }),
    });
  },
});

export const deleteEvent = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect();
    for (const p of participants) {
      if (p.certificateStorageId) {
        await ctx.storage.delete(p.certificateStorageId);
      }
      await ctx.db.delete(p._id);
    }
    const event = await ctx.db.get(eventId);
    if (event?.templateStorageId) {
      await ctx.storage.delete(event.templateStorageId);
    }
    await ctx.db.delete(eventId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
