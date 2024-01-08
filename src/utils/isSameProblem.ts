interface Params {
  keyStrokes: string[];
  problemKeys: string[];
}

export const isSameProblem = ({ keyStrokes, problemKeys }: Params) => {
  return keyStrokes.length >= problemKeys.length;
};
