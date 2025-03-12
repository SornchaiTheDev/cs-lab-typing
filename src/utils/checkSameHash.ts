import objectHash from "object-hash";
import type { ExamTypingResultType, TypingResultType } from "~/schemas/TypingResult";

export const checkSameHash = (input: TypingResultType | ExamTypingResultType, hash: string) => {
  const _hash = objectHash(input);

  return _hash === hash;
};
