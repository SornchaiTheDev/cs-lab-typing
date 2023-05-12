import { createAuthLogRouter } from "./create.router";
import { getAuthLoggerRouter } from "./get.router";
import { mergeRouter } from "@/server/trpc";

export const authLoggerRouter = mergeRouter(
  createAuthLogRouter,
  getAuthLoggerRouter
);
