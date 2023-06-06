import { mergeRouter } from "~/server/api/trpc";
import { authLoggersRouter } from "./auth";
import { labLoggersRouter } from "./lab";
export const loggerRouter = mergeRouter(authLoggersRouter, labLoggersRouter);
