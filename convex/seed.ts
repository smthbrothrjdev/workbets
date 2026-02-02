import { mutation } from "./_generated/server";
import { ensureDemoSeeded } from "./seedHelpers";

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const seedResult = await ensureDemoSeeded(ctx);
    if (seedResult.status === "seeded") {
      await ctx.db.insert("seedMarkers", {
        name: "demo",
        seededAt: Date.now(),
      });
    }
    return seedResult;
  },
});
