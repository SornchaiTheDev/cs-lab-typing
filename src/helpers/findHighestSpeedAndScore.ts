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
      current.percent_error -
      (prev.adjusted_speed + prev.percent_error)
  );

  if (clonedArr.length === 0 || clonedArr[0] === undefined) return null;

  return clonedArr[0];
};
