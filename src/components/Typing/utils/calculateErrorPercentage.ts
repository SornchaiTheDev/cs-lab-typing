export function calculateErrorPercentage(
  totalChars: number,
  wrongChars: number
) {
  // Calculate the total number of typed characters

  // Calculate the error percentage
  const errorPercentage = (wrongChars / totalChars) * 100;

  return errorPercentage.toFixed(2); // Limiting to 2 decimal places
}
