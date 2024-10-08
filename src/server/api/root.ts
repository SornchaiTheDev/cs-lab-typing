import { router } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { loggerRouter } from "~/server/api/routers/logger";
import { semesterRouter } from "~/server/api/routers/semester";
import { courseRouter } from "~/server/api/routers/course";
import { sectionRouter } from "~/server/api/routers/section";
import { labRouter } from "~/server/api/routers/lab";
import { tagRouter } from "~/server/api/routers/tag";
import { taskRouter } from "~/server/api/routers/task";
import { frontRouter } from "~/server/api/routers/front";
import { judgeRouter } from "./routers/judge";

export const appRouter = router({
  users: usersRouter,
  loggers: loggerRouter,
  semesters: semesterRouter,
  courses: courseRouter,
  sections: sectionRouter,
  labs: labRouter,
  tags: tagRouter,
  tasks: taskRouter,
  front: frontRouter,
  judge: judgeRouter,
});

export type AppRouter = typeof appRouter;
