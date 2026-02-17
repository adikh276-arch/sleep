export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:mm (24hr internal)
  wakeTime: string; // HH:mm (24hr internal)
  totalMinutes: number;
  actualMinutes: number;
  quality: number; // 1-5
  wakeUps: number;
  wakeDurationMin: number;
  symptoms: string[];
  aids: string[];
  wakeFeeling: number; // 1-5
  notes: string;
  score: number;
}

export const SYMPTOMS = [
  'Tobacco cravings on waking',
  'Night sweats',
  'Vivid dreams',
  'Nightmares',
  'Restless legs',
  'Persistent cough',
  'Racing thoughts',
  'None',
];

export const AIDS = [
  'None',
  'Herbal drink',
  'Warm milk',
  'Melatonin',
  'Prescribed medication',
  'Other',
];

export const QUALITY_OPTIONS = [
  { emoji: '😴', label: 'Poor', value: 1 },
  { emoji: '🙁', label: 'Below avg', value: 2 },
  { emoji: '😐', label: 'Average', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '⭐', label: 'Excellent', value: 5 },
];

export const WAKING_OPTIONS = [
  { emoji: '😵', label: 'Groggy', value: 1 },
  { emoji: '😴', label: 'Unrested', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Rested', value: 4 },
  { emoji: '⚡', label: 'Refreshed', value: 5 },
];

export const FACTS = [
  '"Nicotine disrupts REM sleep architecture, normalising within 4 weeks of cessation." — Sleep Foundation',
  '"Sleep deprivation increases craving intensity. Rest supports recovery." — NIMHANS',
  '"Consistent sleep schedules support neurological recovery during cessation." — NHS, 2023',
];
