import { mergeRouter } from "~/server/api/trpc";
import { createSemesterRouter } from "./create.router";
import { getSemesterRouter } from "./get.router";
import { updateSemesterRouter } from "./update.router";
import { deleteSemesterRouter } from "./delete.router";

export const semesterRouter = mergeRouter(
  createSemesterRouter,
  getSemesterRouter,
  updateSemesterRouter,
  deleteSemesterRouter
);
