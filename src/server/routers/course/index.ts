import { mergeRouter } from "@/server/trpc";
import { createCourseRouter } from "./create.router";
import { getCourseRouter } from "./get.router";
import { updateCoursesRouter } from "./update.router";

export const courseRouter = mergeRouter(
  createCourseRouter,
  getCourseRouter,
  updateCoursesRouter
);
