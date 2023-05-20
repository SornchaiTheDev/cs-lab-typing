import { mergeRouter } from "~/server/api/trpc";
import { createLabRouter } from "./create.router";
import { getLabRouter } from "./get.router";
import { deleteLabRouter } from "./delete.router";
import { updateLabRouter } from "./update.router";

export const labRouter = mergeRouter(
  createLabRouter,
  getLabRouter,
  deleteLabRouter,
  updateLabRouter
);
