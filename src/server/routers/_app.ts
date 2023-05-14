import { router } from "../trpc";
import { usersRouter } from "./users";
import { loggerRouter } from "./logger";
import { semesterRouter } from "./semester";
export const appRouter = router({
  users: usersRouter,
  logger: loggerRouter,
  semester: semesterRouter,
});

export type AppRouter = typeof appRouter;
