import { router } from "../trpc";
import { usersRouter } from "./users";
import { loggerRouter } from "./logger";
import { semesterRouter } from "./semester";
import { courseRouter } from "./course";
import { sectionRouter } from "./section";
export const appRouter = router({
  users: usersRouter,
  loggers: loggerRouter,
  semesters: semesterRouter,
  courses: courseRouter,
  sections: sectionRouter,
});

export type AppRouter = typeof appRouter;
