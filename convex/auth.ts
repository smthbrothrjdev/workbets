import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verifyPassword } from "./authHelpers";

export const authenticate = mutation({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("authAccounts")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!account) {
      return null;
    }

    const isValid = await verifyPassword(args.password, account.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      userId: account.userId,
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
