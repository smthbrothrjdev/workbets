import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { hashPassword, verifyPassword } from "./authHelpers";
import { ensureDemoSeeded } from "./seedHelpers";

export const authenticate = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    let accounts = await ctx.db
      .query("authAccounts")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .collect();

    if (accounts.length !== 1) {
      await ensureDemoSeeded(ctx);
      accounts = await ctx.db
        .query("authAccounts")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .collect();
      if (accounts.length !== 1) {
        return null;
      }
    }

    const isValid = await verifyPassword(
      args.password,
      accounts[0].passwordHash
    );
    if (!isValid) {
      return null;
    }

    return {
      userId: accounts[0].userId,
    };
  },
});

export const register = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    workplaceId: v.optional(v.id("workplaces")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existingUser) {
      throw new Error("An account with that email already exists.");
    }

    let resolvedWorkplaceId = args.workplaceId ?? null;
    let workplace = resolvedWorkplaceId
      ? await ctx.db.get("workplaces", resolvedWorkplaceId)
      : null;

    if (!workplace) {
      const existingWorkplaces = await ctx.db.query("workplaces").collect();
      if (existingWorkplaces.length === 0) {
        resolvedWorkplaceId = await ctx.db.insert("workplaces", {
          name: "Workbets HQ",
        });
      } else if (!args.workplaceId) {
        throw new Error("Choose a workplace to continue.");
      } else {
        throw new Error("Workplace not found.");
      }
    }

    if (!resolvedWorkplaceId) {
      throw new Error("Workplace is required.");
    }

    const name = args.email.split("@")[0] || "New User";
    const userId = await ctx.db.insert("users", {
      name,
      email: args.email,
      role: "User",
      workplaceId: resolvedWorkplaceId,
      workCred: 0,
    });

    const passwordHash = await hashPassword(args.password);
    await ctx.db.insert("authAccounts", {
      username: args.email,
      passwordHash,
      userId,
    });

    return { userId };
  },
});

export const getAccountByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("authAccounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
