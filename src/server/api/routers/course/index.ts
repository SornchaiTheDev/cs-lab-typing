import { mergeRouter } from "~/server/api/trpc";
import { createCourseRouter } from "./create.router";
import { getCourseRouter } from "./get.router";
import { updateCoursesRouter } from "./update.router";
import { deleteCourseRouter } from "./delete.router";

export const courseRouter = mergeRouter(
  createCourseRouter,
  getCourseRouter,
  updateCoursesRouter,
  deleteCourseRouter
);
