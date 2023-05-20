import { router } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { loggerRouter } from "~/server/api/routers/logger";
import { semesterRouter } from "~/server/api/routers/semester";
import { courseRouter } from "~/server/api/routers/course";
import { sectionRouter } from "~/server/api/routers/section";

export const appRouter = router({
  users: usersRouter,
  loggers: loggerRouter,
  semesters: semesterRouter,
  courses: courseRouter,
  sections: sectionRouter,
});

export type AppRouter = typeof appRouter;
