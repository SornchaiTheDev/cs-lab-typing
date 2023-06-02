export function calculateTypingSpeed(
  totalCharacters: number,
  totalErrors: number,
  timeInMinutes: number
) {
  // Calculate Gross Words Per Minute (GWPM)
  const rawSpeed = Number((totalCharacters / 5 / timeInMinutes).toFixed(2));

  // Calculate Net Words Per Minute (NWPM)
  const adjustedSpeed = Number(
    Math.max((totalCharacters - totalErrors) / 5 / timeInMinutes, 0).toFixed(2)
  );

  return { rawSpeed, adjustedSpeed };
}
