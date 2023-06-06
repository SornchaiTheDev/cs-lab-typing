import { mergeRouter } from "~/server/api/trpc";
import { getLabLogRouter } from "./get.router";

export const labLoggersRouter = mergeRouter(getLabLogRouter);
