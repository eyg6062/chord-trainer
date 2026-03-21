/**
 * Maps every interval string used in CHORD_INTERVALS (and extensions)
 * to its semitone offset from the root, mod 12.
 *
 * Extended intervals (9, 11, 13) are mapped to their pitch-class equivalent
 * (same as 2, 4, 6 respectively) because MIDI validation ignores octave.
 */
const INTERVAL_TO_SEMITONE: Record<string, number> = {
  '1':   0,
  'b2':  1,
  '2':   2,
  'b3':  3,
  '3':   4,
  '4':   5,
  'b5':  6,
  '5':   7,
  '#5':  8,
  '6':   9,
  'bb7': 9,   // diminished seventh — enharmonic to 6
  'b7':  10,
  '7':   11,
  'b9':  1,   // = b2 pitch class
  '9':   2,   // = 2 pitch class
  '#9':  3,   // = b3 pitch class
  '11':  5,   // = 4 pitch class
  '#11': 6,   // = b5 pitch class
  'b13': 8,   // = #5 pitch class
  '13':  9,   // = 6 pitch class
};

/**
 * Returns the semitone offset (0–11) for a given interval string.
 * Throws if the interval is unrecognised.
 */
export function intervalToSemitone(interval: string): number {
  const semitone = INTERVAL_TO_SEMITONE[interval];
  if (semitone === undefined) {
    throw new Error(`Unknown interval: "${interval}"`);
  }
  return semitone;
}

/**
 * Extracts the degree number from an interval string by stripping
 * any leading accidentals (b, #, bb).
 *
 * Examples:
 *   "b3"  → "3"
 *   "#5"  → "5"
 *   "bb7" → "7"
 *   "11"  → "11"
 */
export function getIntervalDegree(interval: string): string {
  return interval.replace(/^[b#]+/, '');
}
