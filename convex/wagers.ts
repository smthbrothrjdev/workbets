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
    const wagerId = await ctx.db.insert("wagers", {
      title: args.title,
      description: args.description,
      status: "Open",
      totalCred: args.totalCred,
      closesAt: args.closesAt,
    });

    if (args.tags?.length) {
      await Promise.all(
        args.tags.map((tag) => ctx.db.insert("wagerTags", { wagerId, tag }))
      );
    }

    return wagerId;
  },
});
