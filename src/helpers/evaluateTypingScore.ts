/*
 * evaluate typing score from adjust_speed and %error
 */
export function evaluate(adj: number, error: number) {
  const MAX_SCORE = 100.0;
  let adj_score = 0.0;
  let error_score = 0.0;
  const ADJ_WEIGHT = 0.7;
  const ERROR_WEIGHT = 0.3;
  const ADJ_THRESHOLD = 30.0;
  const ERROR_THRESHOLD = 3.0;
  const MIN_ADJ = 5.0;
  const MAX_ERROR = 12.0;
  if (adj >= ADJ_THRESHOLD && error <= ERROR_THRESHOLD) return MAX_SCORE;
  if (adj >= MIN_ADJ) {
    adj_score = (adj / ADJ_THRESHOLD) * (MAX_SCORE * ADJ_WEIGHT);
  }
  if (error <= ERROR_THRESHOLD) {
    error_score = MAX_SCORE * ERROR_WEIGHT;
  } else if (error > MAX_ERROR) {
    error_score = 0.0;
  } else {
    error_score =
      ((MAX_ERROR - error) / (MAX_ERROR - ERROR_THRESHOLD)) *
      (MAX_SCORE * ERROR_WEIGHT);
  }
  const score = (adj_score + error_score).toFixed(2);
  return parseFloat(score);
}
