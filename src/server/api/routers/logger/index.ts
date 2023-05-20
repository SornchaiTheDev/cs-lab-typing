import { mergeRouter } from "~/server/api/trpc";
import { authLoggerRouter } from "./auth";
export const loggerRouter = mergeRouter(authLoggerRouter);
