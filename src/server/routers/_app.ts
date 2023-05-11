import { router } from "../trpc";
import { usersRouter } from "./users";
import { loggerRouter } from "./logger";
export const appRouter = router({
  users: usersRouter,
  logger: loggerRouter,
});

export type AppRouter = typeof appRouter;
