import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";

export const metadata: Metadata = {
  title: "Roamly — AI Trip Planner",
  description: "Build a thoughtful travel itinerary around your budget, interests, and pace."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ConvexClientProvider>{children}</ConvexClientProvider></body></html>;
}