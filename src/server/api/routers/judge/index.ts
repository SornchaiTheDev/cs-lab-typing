import { mergeRouter } from "../../trpc";
import { getJudgeRouter } from "./get.router";
import { createJudgeRouter } from "./create.router";

export const judgeRouter = mergeRouter(createJudgeRouter, getJudgeRouter);
