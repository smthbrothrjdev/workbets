import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createWager = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    totalCred: v.number(),
    closesAt: v.optional(v.number()),
    options: v.array(v.string()),
    tags: v.optional(v.array(v.string())),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const creator = await ctx.db.get("users", args.createdBy);
    if (!creator) {
      throw new Error("Creator not found.");
    }
    const normalizedOptions = Array.from(
      new Set(
        args.options
          .map((option) => option.trim())
          .filter((option) => option.length > 0)
      )
    );
    if (normalizedOptions.length < 2) {
      throw new Error("At least two wager options are required.");
    }
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
      createdBy: args.createdBy,
      workplaceId: creator.workplaceId,
    });

    await Promise.all(
      normalizedOptions.map((label, index) =>
        ctx.db.insert("wagerOptions", {
          wagerId,
          label,
          sortOrder: index,
          votePercent: 0,
        })
      )
    );

    const openTag = "Open";
    if (normalizedTags.length) {
      const tagOptionMap = new Map<string, string>();
      await Promise.all(
        normalizedTags.map(async (tag) => {
          if (tag.toLowerCase() === openTag.toLowerCase()) {
            return;
          }
          const option = await ctx.db
            .query("tagOptions")
            .withIndex("by_label", (q) => q.eq("label", tag))
            .first();
          if (option && option.isSelectable !== false) {
            tagOptionMap.set(tag, option.label);
          }
        })
      );
      const validTags = Array.from(tagOptionMap.values());
      const tagsToInsert = Array.from(
        new Set([openTag, ...validTags.map((tag) => tag.trim())])
      );
      await Promise.all(
        tagsToInsert.map((tag) => ctx.db.insert("wagerTags", { wagerId, tag }))
      );
    } else {
      await ctx.db.insert("wagerTags", { wagerId, tag: openTag });
    }

    return wagerId;
  },
});

const assertCanManageWager = async (
  ctx: { db: { get: (table: string, id: string) => Promise<any> } },
  wagerId: string,
  userId: string
) => {
  const [wager, user] = await Promise.all([
    ctx.db.get("wagers", wagerId),
    ctx.db.get("users", userId),
  ]);

  if (!wager) {
    throw new Error("Wager not found.");
  }
  if (!user) {
    throw new Error("User not found.");
  }

  const isAdmin = user.role.toLowerCase() === "admin";
  const isCreator = wager.createdBy === user._id;
  let wagerWorkplaceId = wager.workplaceId ?? null;
  if (!wagerWorkplaceId && wager.createdBy) {
    const creator = await ctx.db.get("users", wager.createdBy);
    wagerWorkplaceId = creator?.workplaceId ?? null;
  }

  if (isAdmin && wagerWorkplaceId && wagerWorkplaceId !== user.workplaceId) {
    throw new Error("You don't have permission to modify this wager.");
  }

  if (!isAdmin && !isCreator) {
    throw new Error("You don't have permission to modify this wager.");
  }

  return { wager, user, isAdmin };
};

export const closeWager = mutation({
  args: {
    wagerId: v.id("wagers"),
    userId: v.id("users"),
    winnerOptionId: v.id("wagerOptions"),
  },
  handler: async (ctx, args) => {
    const { wager } = await assertCanManageWager(
      ctx,
      args.wagerId,
      args.userId
    );

    if (wager.status !== "Open") {
      throw new Error("Only open wagers can be closed.");
    }

    const winnerOption = await ctx.db.get("wagerOptions", args.winnerOptionId);
    if (!winnerOption || winnerOption.wagerId !== wager._id) {
      throw new Error("Selected winner is invalid.");
    }

    await ctx.db.patch(wager._id, {
      status: "Closed",
      winnerOptionId: args.winnerOptionId,
    });

    return { status: "closed" };
  },
});

export const cancelWager = mutation({
  args: {
    wagerId: v.id("wagers"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { wager } = await assertCanManageWager(
      ctx,
      args.wagerId,
      args.userId
    );

    if (wager.status !== "Open") {
      throw new Error("Only open wagers can be cancelled.");
    }

    await ctx.db.patch(wager._id, {
      status: "Cancelled",
    });

    return { status: "cancelled" };
  },
});

export const deleteWager = mutation({
  args: {
    wagerId: v.id("wagers"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { wager } = await assertCanManageWager(
      ctx,
      args.wagerId,
      args.userId
    );

    const [options, tags, votes] = await Promise.all([
      ctx.db
        .query("wagerOptions")
        .withIndex("by_wager", (q) => q.eq("wagerId", wager._id))
        .collect(),
      ctx.db
        .query("wagerTags")
        .withIndex("by_wager", (q) => q.eq("wagerId", wager._id))
        .collect(),
      ctx.db
        .query("wagerVotes")
        .withIndex("by_wager", (q) => q.eq("wagerId", wager._id))
        .collect(),
    ]);

    await Promise.all([
      ...options.map((option) => ctx.db.delete(option._id)),
      ...tags.map((tag) => ctx.db.delete(tag._id)),
      ...votes.map((vote) => ctx.db.delete(vote._id)),
      ctx.db.delete(wager._id),
    ]);

    return { status: "deleted" };
  },
});
