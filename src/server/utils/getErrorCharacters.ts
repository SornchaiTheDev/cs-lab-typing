import type { z } from "zod";
import type { KeyStroke } from "~/schemas/TypingResult";
import { isEqual } from "lodash";

interface Params {
  keyStrokes: z.infer<typeof KeyStroke>[];
  problemKeys: string[];
}

export const getErrorsCharacters = ({ keyStrokes, problemKeys }: Params) => {
  const isSameProblem = isEqual(
    keyStrokes.map((keyStroke) => keyStroke.letter),
    problemKeys
  );

  if (!isSameProblem) {
    throw new Error("NOT_SAME_PROBLEM");
  }

  const errorChars = keyStrokes.filter(
    (keyStroke) => keyStroke.status === 2
  ).length;

  return errorChars;
};
