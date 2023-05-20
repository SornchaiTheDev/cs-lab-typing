import { mergeRouter } from "../../trpc";
import { getTagRouter } from "./get.router";

export const tagRouter = mergeRouter(getTagRouter);
