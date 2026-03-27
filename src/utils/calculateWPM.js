/**
 * Calculate Words Per Minute (WPM)
 * Standard WPM formula: (Characters typed / 5) / (Time in minutes)
 * @param {number} charCount - Total characters typed (including spaces)
 * @param {number} timeInSeconds - Time taken in seconds
 * @returns {number}
 */
export const calculateWPM = (charCount, timeInSeconds) => {
  if (timeInSeconds <= 0) return 0;
  const minutes = timeInSeconds / 60;
  const wpm = (charCount / 5) / minutes;
  return Math.round(wpm);
};

/**
 * Calculate Accuracy Percentage
 * @param {number} totalChars - Total characters typed
 * @param {number} mistakes - Number of incorrect characters
 * @returns {number}
 */
export const calculateAccuracy = (totalChars, mistakes) => {
  if (totalChars === 0) return 100;
  const correctChars = totalChars - mistakes;
  const accuracy = (correctChars / totalChars) * 100;
  return Math.max(0, Math.round(accuracy));
};
