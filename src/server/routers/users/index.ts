import { mergeRouter } from "@/server/trpc";
import { createUserRouter } from "./create.router";
import { getUserRouter } from "./get.router";
import { deleteUserRouter } from "./delete.router";
import { updateUserRouter } from "./update.router";

export const usersRouter = mergeRouter(
  createUserRouter,
  updateUserRouter,
  getUserRouter,
  deleteUserRouter
);
