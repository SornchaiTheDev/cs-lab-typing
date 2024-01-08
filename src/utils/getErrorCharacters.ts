interface Params {
  keyStrokes: string[];
  problemKeys: string[];
}

export const getErrorsCharacters = ({ keyStrokes, problemKeys }: Params) => {
  let j = 0;
  let errorChars = 0;
  for (let i = 0; i < keyStrokes.length && j < problemKeys.length; i++) {
    if (keyStrokes[i] === "DEL") {
      j--;
      continue;
    }

    if (keyStrokes[i] !== problemKeys[j]) {
      errorChars++;
    }

    j++;
  }

  return errorChars;
};
