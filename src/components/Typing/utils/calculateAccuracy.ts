export function calculateAccuracy(totalChars: number, correctChars: number) {
  const accuracy = (correctChars / totalChars) * 100;
  return accuracy.toFixed(2);
}
