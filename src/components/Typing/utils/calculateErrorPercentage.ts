export function calculateErrorPercentage(
  correctChars: number,
  wrongChars: number
) {
  // Calculate the total number of typed characters
  const totalChars = correctChars + wrongChars;

  // Calculate the error percentage
  const errorPercentage = (wrongChars / totalChars) * 100;

  return errorPercentage.toFixed(2); // Limiting to 2 decimal places
}
