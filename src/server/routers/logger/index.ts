import { mergeRouter } from "@/server/trpc";
import { authLoggerRouter } from "./auth";
export const loggerRouter = mergeRouter(authLoggerRouter);
