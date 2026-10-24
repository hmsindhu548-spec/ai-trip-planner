import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trips: defineTable({
    destination: v.string(),
    days: v.number(),
    budget: v.string(),
    travelers: v.number(),
    style: v.string(),
    interests: v.string(),
    title: v.string(),
    overview: v.string(),
    estimatedBudget: v.string(),
    bestTime: v.string(),
    tips: v.array(v.string()),
    itinerary: v.array(v.object({
      day: v.number(),
      title: v.string(),
      activities: v.array(v.object({
        time: v.string(),
        name: v.string(),
        description: v.string(),
        estimatedCost: v.string()
      }))
    })),
    createdAt: v.number()
  }).index("by_created_at", ["createdAt"])
});