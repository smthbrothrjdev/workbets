import { mutation } from "./_generated/server";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingSeed = await ctx.db
      .query("seedMarkers")
      .withIndex("by_name", (q) => q.eq("name", "demo"))
      .first();
    if (existingSeed) {
      return { status: "skipped" };
    }
    await ctx.db.insert("seedMarkers", {
      name: "demo",
      seededAt: Date.now(),
    });

    const workplaceIds = new Map();
    for (const name of ["Product Studio", "Design Guild"]) {
      const id = await ctx.db.insert("workplaces", { name });
      workplaceIds.set(name, id);
    }

    const users = [
      {
        name: "Avery Knight",
        email: "avery@workbets.io",
        role: "Admin",
        workplace: "Product Studio",
        workCred: 156,
      },
      {
        name: "Jordan Ellis",
        email: "jordan@workbets.io",
        role: "Creator",
        workplace: "Product Studio",
        workCred: 98,
      },
      {
        name: "Marin Patel",
        email: "marin@workbets.io",
        role: "Guest",
        workplace: "Design Guild",
        workCred: 77,
      },
      {
        name: "Riley Chen",
        email: "riley@workbets.io",
        role: "User",
        workplace: "Product Studio",
        workCred: 124,
      },
    ];

    const userIds = new Map();
    for (const user of users) {
      const id = await ctx.db.insert("users", {
        name: user.name,
        email: user.email,
        role: user.role,
        workplaceId: workplaceIds.get(user.workplace),
        workCred: user.workCred,
      });
      userIds.set(user.email, id);
    }

    const wagers = [
      {
        key: "w1",
        title: "Will the marketing site ship by Friday?",
        description:
          "Front-end polish and copy edits pending. Bets close Thursday 5pm.",
        status: "Open",
        totalCred: 48,
        tags: ["Trending", "Low risk"],
        options: [
          { label: "Yes, ship it", votePercent: 52 },
          { label: "No, still polishing", votePercent: 31 },
          { label: "Depends on review", votePercent: 17 },
        ],
        votes: [
          { email: "riley@workbets.io", option: "Yes, ship it", enhanced: 8 },
          { email: "avery@workbets.io", option: "Yes, ship it", enhanced: 17 },
          {
            email: "jordan@workbets.io",
            option: "No, still polishing",
            enhanced: 15,
          },
          {
            email: "marin@workbets.io",
            option: "Depends on review",
            enhanced: 8,
          },
        ],
      },
      {
        key: "w2",
        title: "Will support backlog clear this sprint?",
        description: "Current queue is 23 tickets. Betting closes Wednesday.",
        status: "Open",
        totalCred: 62,
        tags: ["Popular pick"],
        options: [
          { label: "Clear by Friday", votePercent: 41 },
          { label: "Still >10 tickets", votePercent: 44 },
          { label: "Need a tiger team", votePercent: 15 },
        ],
        votes: [
          {
            email: "riley@workbets.io",
            option: "Still >10 tickets",
            enhanced: 4,
          },
          { email: "avery@workbets.io", option: "Clear by Friday", enhanced: 25 },
          {
            email: "jordan@workbets.io",
            option: "Still >10 tickets",
            enhanced: 23,
          },
          {
            email: "marin@workbets.io",
            option: "Need a tiger team",
            enhanced: 10,
          },
        ],
      },
      {
        key: "w3",
        title: "Which snack wins demo day?",
        description: "Cast your vote for the snack that fuels the next big idea.",
        status: "Closed",
        totalCred: 31,
        tags: ["Completed"],
        options: [
          { label: "Mocha bar", votePercent: 28 },
          { label: "Sea salt popcorn", votePercent: 55 },
          { label: "Berry bites", votePercent: 17 },
        ],
        votes: [
          { email: "avery@workbets.io", option: "Mocha bar", enhanced: 9 },
          {
            email: "jordan@workbets.io",
            option: "Sea salt popcorn",
            enhanced: 17,
          },
          { email: "marin@workbets.io", option: "Berry bites", enhanced: 5 },
        ],
        winner: "Sea salt popcorn",
      },
    ];

    for (const wager of wagers) {
      const wagerId = await ctx.db.insert("wagers", {
        title: wager.title,
        description: wager.description,
        status: wager.status,
        totalCred: wager.totalCred,
      });

      const optionIds = new Map();
      for (const [index, option] of wager.options.entries()) {
        const optionId = await ctx.db.insert("wagerOptions", {
          wagerId,
          label: option.label,
          sortOrder: index,
          votePercent: option.votePercent,
        });
        optionIds.set(option.label, optionId);
      }

      if (wager.winner) {
        const winnerId = optionIds.get(wager.winner);
        if (winnerId) {
          await ctx.db.patch(wagerId, { winnerOptionId: winnerId });
        }
      }

      for (const tag of wager.tags) {
        await ctx.db.insert("wagerTags", { wagerId, tag });
      }

      for (const vote of wager.votes) {
        await ctx.db.insert("wagerVotes", {
          wagerId,
          optionId: optionIds.get(vote.option),
          userId: userIds.get(vote.email),
          enhancedCred: vote.enhanced,
        });
      }
    }

    const now = Date.now();
    const rileyId = userIds.get("riley@workbets.io");
    await ctx.db.insert("pointsTransactions", {
      userId: rileyId,
      label: "Won: Design system bet",
      amount: 12,
      createdAt: now - 1000 * 60 * 60 * 24 * 3,
    });
    await ctx.db.insert("pointsTransactions", {
      userId: rileyId,
      label: "Enhanced wager on backlog",
      amount: -4,
      createdAt: now - 1000 * 60 * 60 * 24 * 2,
    });
    await ctx.db.insert("pointsTransactions", {
      userId: rileyId,
      label: "Daily participation bonus",
      amount: 3,
      createdAt: now - 1000 * 60 * 60 * 24,
    });

    return { status: "seeded" };
  },
});
