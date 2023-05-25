export function calculateTypingSpeed(
  totalCharacters: number,
  totalErrors: number,
  timeInMinutes: number
) {
  // Calculate Gross Words Per Minute (GWPM)
  const rawWpm = (totalCharacters / 5 / timeInMinutes).toFixed(2);

  // Calculate Net Words Per Minute (NWPM)
  const adjWpm = ((totalCharacters - totalErrors) / 5 / timeInMinutes).toFixed(
    2
  );

  return { rawWpm, adjWpm };
}
