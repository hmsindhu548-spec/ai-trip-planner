import arcjet, { detectBot, fixedWindow, shield } from "@arcjet/next";

const fallbackProtect = {
  protect: async (_request: Request) => ({
    isDenied: () => false,
    isAllowed: () => true,
  }),
};

export const protect =
  process.env.ARCJET_KEY && process.env.ARCJET_KEY.trim().length > 0
    ? arcjet({
        key: process.env.ARCJET_KEY,
        characteristics: ["ip.src"],
        rules: [
          shield({ mode: "LIVE" }),
          detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
          fixedWindow({ mode: "LIVE", window: "1m", max: 10 }),
        ],
      })
    : fallbackProtect;