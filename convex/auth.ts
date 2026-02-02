import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyPassword } from "./authHelpers";
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

export const getAccountByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("authAccounts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
