import objectHash from "object-hash";
import type { TypingResultType } from "~/schemas/TypingResult";

export const checkSameHash = (input: TypingResultType, hash: string) => {
  const _hash = objectHash(input);

  return _hash === hash;
};
