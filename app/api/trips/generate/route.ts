import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { protect } from "@/lib/arcjet";

export const runtime = "nodejs";

const inputSchema = z.object({
  destination: z.string().trim().min(2).max(120),
  days: z.number().int().min(1).max(14),
  budget: z.string().trim().min(1).max(80),
  travelers: z.number().int().min(1).max(10),
  style: z.string().trim().min(1).max(80),
  interests: z.string().trim().max(300).default("")
});

const outputSchema = z.object({
  title: z.string(),
  overview: z.string(),
  estimatedBudget: z.string(),
  bestTime: z.string(),
  tips: z.array(z.string()).max(8),
  itinerary: z.array(z.object({
    day: z.number().int(),
    title: z.string(),
    activities: z.array(z.object({
      time: z.string(),
      name: z.string(),
      description: z.string(),
      estimatedCost: z.string()
    })).min(2).max(6)
  }))
});

function buildDemoTrip(input: z.infer<typeof inputSchema>) {
  const { destination, days, budget, travelers, style, interests } = input;
  const normalizedBudget = budget || "₹15,000";
  const planDays = Array.from({ length: days }, (_, index) => {
    const dayNumber = index + 1;
    const activities = [
      { time: "8:30 AM", name: "Coffee & local breakfast", description: `Start the morning with a relaxed breakfast near ${destination} and get oriented to the area.`, estimatedCost: "₹400 – ₹800" },
      { time: "11:00 AM", name: "Scenic exploration", description: `Explore the most photogenic spots that match your ${style.toLowerCase()} trip style and your interests in ${interests || "local culture"}.`, estimatedCost: "₹900 – ₹1,800" },
      { time: "1:30 PM", name: "Lunch with local flavors", description: "Sample the best regional dishes and small local eateries recommended for travelers.", estimatedCost: "₹700 – ₹1,500" },
      { time: "5:00 PM", name: "Leisure or guided activity", description: "Leave room for a relaxed walk, market browsing, or a gentle cultural stop based on your pace.", estimatedCost: "₹600 – ₹1,400" }
    ];

    return {
      day: dayNumber,
      title: dayNumber === 1 ? "Arrival & neighborhood discovery" : dayNumber === days ? "Slow finish & local favorites" : `Explore ${destination.split(",")[0]} highlights`,
      activities
    };
  });

  return {
    title: `Demo itinerary for ${destination}`,
    overview: `This sample trip is designed for ${travelers} traveler${travelers > 1 ? "s" : ""} looking for ${style.toLowerCase()} vibes with a focus on ${interests || "local experiences"}. It is a clearly labeled demo plan, not a live booking or real-time price quote.`,
    estimatedBudget: `${normalizedBudget} total (approx.)`,
    bestTime: "Early morning and late afternoon for pleasant weather and fewer crowds.",
    tips: [
      "Keep your timing flexible because local attractions often run best with a slower pace.",
      "Carry cash for small local cafés, market stalls, and tips.",
      "Check the weather forecast before planning outdoor activities.",
      "Confirm opening hours and any entry requirements before finalizing your route."
    ],
    itinerary: planDays,
    demoMode: true
  };
}

export async function POST(request: NextRequest) {
  try {
    const decision = await protect.protect(request);
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
    }

    const parsed = inputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check your trip details and try again." }, { status: 400 });

    const { destination, days, budget, travelers, style, interests } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      const demoTrip = buildDemoTrip({ destination, days, budget, travelers, style, interests });
      return NextResponse.json({ trip: outputSchema.parse(demoTrip), demoMode: true, message: "Demo mode: using sample itinerary data because OPENAI_API_KEY is not configured yet." }, { status: 200 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a thoughtful travel planner. Return only valid JSON matching this shape: {title:string, overview:string, estimatedBudget:string, bestTime:string, tips:string[], itinerary:[{day:number,title:string,activities:[{time:string,name:string,description:string,estimatedCost:string}]}]}. Make exactly the requested number of days. Use realistic, clearly approximate costs in the budget's currency when possible. Do not claim live availability or exact current prices. Give practical, culturally respectful advice. Each day should have 3-4 activities with sensible pacing. If uncertain, say so in tips." },
        { role: "user", content: `Create a trip plan for destination: ${destination}. Duration: ${days} days. Total budget: ${budget}. Travellers: ${travelers}. Travel style: ${style}. Interests: ${interests || "general sightseeing"}. Estimate costs for the whole group and stay within the stated budget where feasible. Return exactly ${days} itinerary days.` }
      ]
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("The AI returned an empty response.");
    const trip = outputSchema.parse(JSON.parse(content));
    if (trip.itinerary.length !== days) {
      return NextResponse.json({ error: "The itinerary came back incomplete. Please generate it again." }, { status: 502 });
    }
    return NextResponse.json({ trip, demoMode: false });
  } catch (error) {
    console.error("Trip generation failed:", error);
    return NextResponse.json({ error: "We couldn't create the trip right now. Please try again." }, { status: 500 });
  }
}