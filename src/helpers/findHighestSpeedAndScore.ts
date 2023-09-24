import type { typing_histories } from "@prisma/client";

export type HigestSpeedAndScoreType = Omit<
  typing_histories,
  "submission_id" | "updated_at"
>;

export const findHighestSpeedAndScore = (arr: HigestSpeedAndScoreType[]) => {
  const clonedArr = [...arr];
  clonedArr.sort(
    (prev, current) =>
      current.adjusted_speed +
      current.score -
      (prev.adjusted_speed + prev.score)
  );

  if (clonedArr.length === 0 || clonedArr[0] === undefined) return null;

  return clonedArr[0];
};
