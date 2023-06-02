import { mergeRouter } from "~/server/api/trpc";
import { getFrontRouter } from "~/server/api/routers/front/get.router";
import { createFrontRouter } from "~/server/api/routers/front/create.router";

export const frontRouter = mergeRouter(getFrontRouter, createFrontRouter);
