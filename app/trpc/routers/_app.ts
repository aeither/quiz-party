import { createTRPCRouter } from "../init";
import { aiRouter } from "./aiRouter";

export const appRouter = createTRPCRouter({
  ai: aiRouter,
});

export type AppRouter = typeof appRouter; 