export function calculateScore(
  totalMinutes: number,
  quality: number,
  wakeUps: number,
  symptomCount: number
): number {
  // Duration: 8hr (480min) = 50pts; ±5pts per 30min deviation
  const durationDev = Math.abs(totalMinutes - 480) / 30;
  const durationPts = Math.max(0, 50 - durationDev * 5);

  // Quality: 4pts × quality level (1-5)
  const qualityPts = 4 * quality;

  // Wake-up penalty: -3 each
  const wakePenalty = wakeUps * 3;

  // Symptom penalty: -2 each
  const symptomPenalty = symptomCount * 2;

  const raw = durationPts + qualityPts - wakePenalty - symptomPenalty;
  return Math.round(Math.max(0, Math.min(100, raw)));
}

export function getScoreBand(score: number): { label: string; className: string } {
  if (score <= 40) return { label: 'Poor', className: 'score-poor' };
  if (score <= 60) return { label: 'Below average', className: 'score-below' };
  if (score <= 80) return { label: 'Good', className: 'score-good' };
  return { label: 'Excellent', className: 'score-excellent' };
}

export function getScoreColor(score: number): string {
  if (score <= 40) return 'hsl(354, 70%, 54%)';
  if (score <= 60) return 'hsl(37, 92%, 44%)';
  if (score <= 80) return 'hsl(160, 85%, 33%)';
  return 'hsl(203, 92%, 59%)';
}
