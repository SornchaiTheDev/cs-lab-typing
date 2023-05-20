import { router } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { loggerRouter } from "~/server/api/routers/logger";
import { semesterRouter } from "~/server/api/routers/semester";
import { courseRouter } from "~/server/api/routers/course";
import { sectionRouter } from "~/server/api/routers/section";
import { labRouter } from "~/server/api/routers/lab";
import { tagRouter } from "~/server/api/routers/tag";

export const appRouter = router({
  users: usersRouter,
  loggers: loggerRouter,
  semesters: semesterRouter,
  courses: courseRouter,
  sections: sectionRouter,
  labs: labRouter,
  tags: tagRouter,
});

export type AppRouter = typeof appRouter;
