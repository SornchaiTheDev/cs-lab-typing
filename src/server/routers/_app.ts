import { router } from "../trpc";
import { usersRouter } from "./users";
import { loggerRouter } from "./logger";
import { semesterRouter } from "./semester";
import { courseRouter } from "./course";
export const appRouter = router({
  users: usersRouter,
  loggers: loggerRouter,
  semesters: semesterRouter,
  courses: courseRouter,
});

export type AppRouter = typeof appRouter;
