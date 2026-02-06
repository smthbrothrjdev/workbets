import type { MutationCtx } from "./_generated/server";
import { hashPassword } from "./authHelpers";

export const ensureDemoSeeded = async (ctx: MutationCtx) => {
  const existingAuthAccounts = await ctx.db.query("authAccounts").collect();
  const existingUsers = await ctx.db.query("users").collect();
  const passwordHash = await hashPassword("workbets123");
  const ensureAdminDemoUser = async () => {
    const adminEmail = "admin@workbets.io";
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", adminEmail))
      .first();
    let adminUserId = adminUser?._id ?? null;

    if (!adminUserId) {
      const workplaces = await ctx.db.query("workplaces").collect();
      const workplaceId =
        workplaces.length > 0
          ? workplaces[0]._id
          : await ctx.db.insert("workplaces", { name: "Workbets HQ" });
      adminUserId = await ctx.db.insert("users", {
        name: "Admin Test",
        email: adminEmail,
        role: "admin",
        workplaceId,
        workCred: 210,
      });
    }

    const adminAccount = await ctx.db
      .query("authAccounts")
      .withIndex("by_username", (q) => q.eq("username", adminEmail))
      .first();
    if (!adminAccount && adminUserId) {
      await ctx.db.insert("authAccounts", {
        username: adminEmail,
        passwordHash,
        userId: adminUserId,
      });
      return true;
    }

    return !adminUser;
  };

  const tagOptions = [
    { label: "Open", isSelectable: false },
    { label: "Closed", isSelectable: false },
    { label: "Trending", isSelectable: true },
    { label: "Low risk", isSelectable: true },
    { label: "Completed", isSelectable: true },
  ];
  const existingTagOptions = await ctx.db.query("tagOptions").collect();
  if (existingTagOptions.length === 0) {
    for (const [index, option] of tagOptions.entries()) {
      await ctx.db.insert("tagOptions", {
        label: option.label,
        sortOrder: index,
        isSelectable: option.isSelectable,
      });
    }
  }

  if (existingUsers.length > 0) {
    const existingUsernames = new Set(
      existingAuthAccounts.map((account) => account.username)
    );
    let createdCount = 0;

    for (const user of existingUsers) {
      if (existingUsernames.has(user.email)) {
        continue;
      }
      await ctx.db.insert("authAccounts", {
        username: user.email,
        passwordHash,
        userId: user._id,
      });
      createdCount += 1;
    }

    const adminSeeded = await ensureAdminDemoUser();
    return {
      status: createdCount > 0 || adminSeeded ? "seeded" : "skipped",
    };
  }

  const workplaceIds = new Map();
  for (const name of ["Product Studio", "Design Guild"]) {
    const id = await ctx.db.insert("workplaces", { name });
    workplaceIds.set(name, id);
  }

  const users = [
    {
      name: "Admin Test",
      email: "admin@workbets.io",
      role: "admin",
      workplace: "Product Studio",
      workCred: 210,
    },
    {
      name: "Avery Knight",
      email: "avery@workbets.io",
      role: "admin",
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
    const username = user.email;
    const passwordHash = await hashPassword("workbets123");
    await ctx.db.insert("authAccounts", {
      username,
      passwordHash,
      userId: id,
    });
    userIds.set(user.email, id);
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
};
