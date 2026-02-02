import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const workplaces = await ctx.db.query("workplaces").collect();
    const workplaceMap = new Map(workplaces.map((w) => [w._id, w.name]));
    const users = await ctx.db.query("users").collect();

    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      workplace: workplaceMap.get(user.workplaceId) ?? "Unknown",
    }));
  },
});

export const getWagers = query({
  args: {},
  handler: async (ctx) => {
    const wagers = await ctx.db.query("wagers").collect();
    const results = [];

    for (const wager of wagers) {
      const options = await ctx.db
        .query("wagerOptions")
        .withIndex("by_wager", (q) => q.eq("wagerId", wager._id))
        .collect();
      options.sort((a, b) => a.sortOrder - b.sortOrder);
      const tags = await ctx.db
        .query("wagerTags")
        .withIndex("by_wager", (q) => q.eq("wagerId", wager._id))
        .collect();

      const winnerOption = options.find(
        (option) => option._id === wager.winnerOptionId
      );

      results.push({
        id: wager._id,
        title: wager.title,
        description: wager.description,
        options: options.map((option) => option.label),
        status: wager.status,
        tags: tags.map((tag) => tag.tag),
        totalCred: wager.totalCred,
        votes: options.map((option) => ({
          option: option.label,
          percent: option.votePercent ?? 0,
        })),
        winner: winnerOption?.label,
      });
    }

    return results;
  },
});

export const getProfile = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return null;
    }

    const workplace = await ctx.db.get("workplaces", user.workplaceId);
    const votes = await ctx.db
      .query("wagerVotes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const votingHistory = [];
    for (const vote of votes) {
      const wager = await ctx.db.get("wagers", vote.wagerId);
      const option = await ctx.db.get("wagerOptions", vote.optionId);
      if (!wager || !option) {
        continue;
      }
      votingHistory.push({
        id: vote._id,
        title: wager.title,
        choice: option.label,
        enhanced: vote.enhancedCred ?? 0,
      });
    }

    const pointsHistory = await ctx.db
      .query("pointsTransactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return {
      name: user.name,
      role: user.role,
      workCred: user.workCred,
      workplace: workplace?.name ?? "Unknown",
      votingHistory,
      pointsHistory: pointsHistory.map((entry) => ({
        id: entry._id,
        label: entry.label,
        amount: entry.amount,
      })),
    };
  },
});
