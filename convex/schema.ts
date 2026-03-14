import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    name: v.string(),
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
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("generated"),
      v.literal("emailing"),
      v.literal("completed")
    ),
    createdAt: v.number(),
  }),

  participants: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    email: v.string(),
    certificateStorageId: v.optional(v.id("_storage")),
    emailStatus: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed")
    ),
    emailError: v.optional(v.string()),
  }).index("by_event", ["eventId"]),
});
