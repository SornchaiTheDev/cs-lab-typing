import { mergeRouter } from "@/server/trpc";
import { authLoggerRouter } from "./authLogger";
export const loggerRouter = mergeRouter(authLoggerRouter);
