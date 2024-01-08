import type { typing_histories } from "@prisma/client";

export type HigestSpeedAndScoreType = Omit<
  typing_histories,
  "submission_id" | "updated_at"
>;

export const findHighestSpeedAndScore = (arr: HigestSpeedAndScoreType[]) => {
  const clonedArr = [...arr];
  clonedArr.sort((prev, current) => {
    if (current.score > prev.score) {
      return 1;
    } else if (current.score < prev.score) {
      return -1;
    }

    if (current.adjusted_speed > prev.adjusted_speed) {
      return 1;
    } else if (current.adjusted_speed < prev.adjusted_speed) {
      return -1;
    }

    return 0;
  });

  if (clonedArr.length === 0 || clonedArr[0] === undefined) return null;

  return clonedArr[0];
};
