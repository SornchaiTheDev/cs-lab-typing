export function calculateAccuracy(correctChars: number, errorChars: number) {
  const totalChars = correctChars + errorChars;
  const accuracy = (correctChars / totalChars) * 100;
  return accuracy.toFixed(2);
}