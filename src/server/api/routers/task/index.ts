import { mergeRouter } from "~/server/api/trpc";
import { createTaskRouter } from "./create.router";
import { getTaskRouter } from "./get.router";
import { updateTaskRouter } from "./update.router";
import { deleteTaskRouter } from "./delete.router";

export const taskRouter = mergeRouter(
  createTaskRouter,
  getTaskRouter,
  updateTaskRouter,
  deleteTaskRouter
);
