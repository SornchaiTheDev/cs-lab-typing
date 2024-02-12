import { mergeRouter } from "../../trpc";
import { getJudgeRouter } from "./get.router";

export const judgeRouter = mergeRouter(getJudgeRouter);
