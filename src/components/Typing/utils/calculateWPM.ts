export function calculateWPM(correctChars: number, wrongChars: number, time: number) {
  // Calculate the total number of typed characters
  const totalChars = correctChars + wrongChars;

  // Calculate the net number of typed characters (subtracting wrong chars)
  const netChars = correctChars - wrongChars * 0.5; // Adjusting for accuracy

  // Calculate the number of words based on the net characters (assuming an average word length)
  const words = Math.floor(netChars / 5); // Assuming an average word length of 5 characters

  // Calculate WPM (words per minute)
  const minutes = time / 60000; // Convert time to minutes
  const wpm = Math.round(words / minutes);

  return wpm;
}
