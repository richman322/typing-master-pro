/**
 * Calculate professional-grade typing metrics
 * Standard: 1 Word = 5 Characters
 */
export const calculateMetrics = (typedText, targetText, timeInSeconds) => {
  const timeInMinutes = timeInSeconds / 60;
  const typedChars = typedText.length;
  
  if (typedChars === 0 || timeInSeconds === 0) {
    return { wpm: 0, raw: 0, accuracy: 100, mistakes: 0, totalTyped: 0 };
  }

  let mistakes = 0;
  let correctChars = 0;

  // Compare every typed character with the target
  for (let i = 0; i < typedChars; i++) {
    if (typedText[i] === targetText[i]) {
      correctChars++;
    } else {
      mistakes++;
    }
  }

  // Raw WPM: Total keystrokes / 5 / minutes
  const rawWpm = Math.round((typedChars / 5) / timeInMinutes);
  
  // Net WPM: (Total - Mistakes) / 5 / minutes
  const netWpm = Math.round(((typedChars - mistakes) / 5) / timeInMinutes);
  
  // Accuracy: (Correct / Total) * 100
  const accuracy = Math.round((correctChars / typedChars) * 100);

  return {
    wpm: Math.max(0, netWpm),
    raw: Math.max(0, rawWpm),
    accuracy: accuracy,
    mistakes: mistakes,
    totalTyped: typedChars
  };
};

/**
 * Persist results to localStorage for progress tracking
 */
export const saveToHistory = (result) => {
  const history = JSON.parse(localStorage.getItem('phantom_history') || '[]');
  const newEntry = {
    ...result,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  // Keep only last 50 entries
  const updatedHistory = [newEntry, ...history].slice(0, 50);
  localStorage.setItem('phantom_history', JSON.stringify(updatedHistory));
  return newEntry;
};
