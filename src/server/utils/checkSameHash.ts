import objectHash from "object-hash";
import type { TypingResultType } from "~/Schemas/TypingResult";

export const checkSameHash = (input: TypingResultType, hash: string) => {
  const _hash = objectHash(input);
  console.log(_hash, hash, input);
  return _hash === hash;
};
