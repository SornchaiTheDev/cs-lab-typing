import { mergeRouter } from "@/server/trpc";
import { createUserRouter } from "./create.router";
import { getUserRouter } from "./get.router";
import { deleteUserRouter } from "./delete.router";

export const usersRouter = mergeRouter(
  createUserRouter,
  getUserRouter,
  deleteUserRouter
);
