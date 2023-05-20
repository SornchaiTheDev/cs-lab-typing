import { mergeRouter } from "~/server/api/trpc";
import { createSemesterRouter } from "./create.router";
import { getSemestersRouter } from "./get.router";
import { updateSemestersRouter } from "./update.router";
import { deleteSemesterRouter } from "./delete.router";

export const semesterRouter = mergeRouter(
  createSemesterRouter,
  getSemestersRouter,
  updateSemestersRouter,
  deleteSemesterRouter
);
