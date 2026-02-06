import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createWager = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    totalCred: v.number(),
    closesAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const normalizedTags = Array.from(
      new Set(
        (args.tags ?? []).map((tag) => tag.trim()).filter((tag) => tag.length > 0)
      )
    );
    const wagerId = await ctx.db.insert("wagers", {
      title: args.title,
      description: args.description,
      status: "Open",
      totalCred: args.totalCred,
      closesAt: args.closesAt,
    });

    if (normalizedTags.length) {
      const tagOptionMap = new Map<string, string>();
      await Promise.all(
        normalizedTags.map(async (tag) => {
          const option = await ctx.db
            .query("tagOptions")
            .withIndex("by_label", (q) => q.eq("label", tag))
            .first();
          if (option) {
            tagOptionMap.set(tag, option.label);
          }
        })
      );
      const validTags = Array.from(tagOptionMap.values());
      if (validTags.length) {
        await Promise.all(
          validTags.map((tag) => ctx.db.insert("wagerTags", { wagerId, tag }))
        );
      }
    }

    return wagerId;
  },
});
