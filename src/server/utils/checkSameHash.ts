import objectHash from "object-hash";
import type {
  TypingResultType,
  TypingExamResultType,
} from "~/schemas/TypingResult";

export const checkSameHash = (
  input: TypingResultType | TypingExamResultType,
  hash: string
) => {
  const _hash = objectHash(input);
  console.log(_hash, hash, input);
  return _hash === hash;
};
