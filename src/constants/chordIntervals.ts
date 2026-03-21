import type { ChordTypeName } from '../types/chord';

/**
 * Maps each chord type to its base interval strings.
 *
 * Interval string notation:
 *   "1"   = root (unison)
 *   "b3"  = minor third
 *   "3"   = major third
 *   "b5"  = diminished fifth
 *   "5"   = perfect fifth
 *   "#5"  = augmented fifth
 *   "6"   = major sixth
 *   "b7"  = minor seventh
 *   "bb7" = diminished seventh (enharmonic to 6, but distinct in theory)
 *   "7"   = major seventh
 *   "9"   = major ninth (= 2 up an octave)
 *   "11"  = perfect eleventh (= 4 up an octave)
 *   "13"  = major thirteenth (= 6 up an octave)
 *
 * Extensions (b5, #5, b9, #9, #11, b13, alt) are NOT listed here —
 * they are applied on top of these base intervals by chordGeneration.ts.
 */
export const CHORD_INTERVALS: Record<ChordTypeName, string[]> = {
  // ── Triads ──────────────────────────────────────────────────────────────
  'Major':  ['1', '3',  '5'],
  'minor':  ['1', 'b3', '5'],
  'dim':    ['1', 'b3', 'b5'],
  'aug':    ['1', '3',  '#5'],
  'sus2':   ['1', '2',  '5'],
  'sus4':   ['1', '4',  '5'],

  // ── Seventh chords ───────────────────────────────────────────────────────
  'M7':     ['1', '3',  '5',  '7'],
  'm7':     ['1', 'b3', '5',  'b7'],
  '7':      ['1', '3',  '5',  'b7'],
  'mM7':    ['1', 'b3', '5',  '7'],
  'dim7':   ['1', 'b3', 'b5', 'bb7'],
  'm7b5':   ['1', 'b3', 'b5', 'b7'],
  'augM7':  ['1', '3',  '#5', '7'],
  'aug7':   ['1', '3',  '#5', 'b7'],

  // ── Six chords ───────────────────────────────────────────────────────────
  '6':      ['1', '3',  '5',  '6'],
  'm6':     ['1', 'b3', '5',  '6'],
  '6/9':    ['1', '3',  '5',  '6',  '9'],

  // ── Extended chords ──────────────────────────────────────────────────────
  'M9':     ['1', '3',  '5',  '7',  '9'],
  'm9':     ['1', 'b3', '5',  'b7', '9'],
  '9':      ['1', '3',  '5',  'b7', '9'],
  'M11':    ['1', '3',  '5',  '7',  '9', '11'],
  'm11':    ['1', 'b3', '5',  'b7', '9', '11'],
  '11':     ['1', '3',  '5',  'b7', '9', '11'],
  'M13':    ['1', '3',  '5',  '7',  '9', '11', '13'],
  'm13':    ['1', 'b3', '5',  'b7', '9', '11', '13'],
  '13':     ['1', '3',  '5',  'b7', '9', '11', '13'],

  // ── Added tone chords ────────────────────────────────────────────────────
  'add9':    ['1', '3',  '5',  '9'],
  'm(add9)': ['1', 'b3', '5',  '9'],
  'add11':   ['1', '3',  '5',  '11'],
  'add13':   ['1', '3',  '5',  '13'],

  // ── Suspended (7th) ──────────────────────────────────────────────────────
  '7sus4':  ['1', '4',  '5',  'b7'],
};
