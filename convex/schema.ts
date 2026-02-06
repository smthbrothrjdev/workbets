import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workplaces: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    workplaceId: v.optional(v.id("workplaces")),
    workCred: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_workplace", ["workplaceId"]),
  authAccounts: defineTable({
    username: v.string(),
    passwordHash: v.string(),
    userId: v.id("users"),
  })
    .index("by_username", ["username"])
    .index("by_user", ["userId"]),
  wagers: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(),
    totalCred: v.number(),
    closesAt: v.optional(v.number()),
    createdBy: v.optional(v.id("users")),
    winnerOptionId: v.optional(v.id("wagerOptions")),
    workplaceId: v.optional(v.id("workplaces")),
  })
    .index("by_status", ["status"])
    .index("by_workplace", ["workplaceId"]),
  wagerOptions: defineTable({
    wagerId: v.id("wagers"),
    label: v.string(),
    sortOrder: v.number(),
    votePercent: v.optional(v.number()),
  }).index("by_wager", ["wagerId"]),
  tagOptions: defineTable({
    label: v.string(),
    sortOrder: v.number(),
    isSelectable: v.optional(v.boolean()),
  })
    .index("by_label", ["label"])
    .index("by_sortOrder", ["sortOrder"]),
  seedMarkers: defineTable({
    name: v.string(),
    seededAt: v.number(),
  }).index("by_name", ["name"]),
  wagerTags: defineTable({
    wagerId: v.id("wagers"),
    tag: v.string(),
  })
    .index("by_wager", ["wagerId"])
    .index("by_tag", ["tag"]),
  wagerVotes: defineTable({
    wagerId: v.id("wagers"),
    optionId: v.id("wagerOptions"),
    userId: v.id("users"),
    enhancedCred: v.optional(v.number()),
  })
    .index("by_wager", ["wagerId"])
    .index("by_user", ["userId"])
    .index("by_wager_user", ["wagerId", "userId"]),
  pointsTransactions: defineTable({
    userId: v.id("users"),
    label: v.string(),
    amount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
