import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const activity = v.object({
  time: v.string(), name: v.string(), description: v.string(), estimatedCost: v.string()
});
const day = v.object({ day: v.number(), title: v.string(), activities: v.array(activity) });

export const save = mutation({
  args: {
    destination: v.string(), days: v.number(), budget: v.string(), travelers: v.number(),
    style: v.string(), interests: v.string(), title: v.string(), overview: v.string(),
    estimatedBudget: v.string(), bestTime: v.string(), tips: v.array(v.string()),
    itinerary: v.array(day)
  },
  handler: async (ctx, args) => ctx.db.insert("trips", { ...args, createdAt: Date.now() })
});

export const recent = query({
  args: {},
  handler: async (ctx) => ctx.db.query("trips").withIndex("by_created_at").order("desc").take(20)
});