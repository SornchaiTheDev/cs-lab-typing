import { mergeRouter } from "~/server/api/trpc";
import { getFrontRouter } from "~/server/api/routers/front/get.router";

export const frontRouter = mergeRouter(getFrontRouter);
