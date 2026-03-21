import type { ChordTypeName, NoteClass } from '../types/chord';
import { CHROMATIC_NOTES, NOTE_TO_SEMITONE } from './notes';

// ── Scale degree offsets (semitones from root) ───────────────────────────────

const MAJOR_SCALE_OFFSETS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE_OFFSETS = [0, 2, 3, 5, 7, 8, 10]; // natural minor (Aeolian)

// ── Chord types available at each scale degree ───────────────────────────────

/**
 * Major key degrees I–VII.
 * Index matches the scale degree offset above (I=0, ii=1, ..., vii°=6).
 */
const MAJOR_DEGREE_TYPES: ChordTypeName[][] = [
  // I  — tonic major
  ['Major', 'M7', 'M9', 'M11', 'M13', '6', '6/9', 'add9', 'add11', 'add13'],
  // ii — supertonic minor
  ['minor', 'm7', 'm9', 'm11', 'm13', 'm6', 'm(add9)'],
  // iii — mediant minor (rarely extended beyond m7)
  ['minor', 'm7'],
  // IV — subdominant major
  ['Major', 'M7', 'M9', 'M11', 'M13', '6', '6/9', 'add9', 'add11', 'add13'],
  // V  — dominant (major triad + dominant extensions + sus variants)
  ['Major', '7', '9', '11', '13', 'sus2', 'sus4', '7sus4'],
  // vi — submediant minor
  ['minor', 'm7', 'm9', 'm11', 'm13', 'm6', 'm(add9)'],
  // vii° — leading tone diminished
  ['dim', 'm7b5'],
];

/**
 * Minor key degrees i–VII (natural minor + harmonic minor V).
 *
 * Degree v combines both natural minor (minor, m7) and harmonic minor
 * (Major, 7, 9, 11, 13, sus) since the harmonic minor V is essential
 * for minor key practice.
 */
const MINOR_DEGREE_TYPES: ChordTypeName[][] = [
  // i  — tonic minor
  ['minor', 'm7', 'm9', 'm11', 'm13', 'm6', 'm(add9)'],
  // ii° — supertonic diminished
  ['dim', 'm7b5'],
  // III — mediant major (bIII)
  ['Major', 'M7', 'M9', 'add9'],
  // iv  — subdominant minor
  ['minor', 'm7', 'm9', 'm(add9)'],
  // v/V — natural minor v + harmonic minor V (dominant)
  ['minor', 'm7', 'Major', '7', '9', '11', '13', 'sus2', 'sus4', '7sus4'],
  // VI  — submediant major (bVI)
  ['Major', 'M7', 'M9', '6', 'add9'],
  // VII — subtonic major (bVII)
  ['Major', '7'],
];

// ── Builder ──────────────────────────────────────────────────────────────────

function buildKeySet(
  rootNote: NoteClass,
  scaleOffsets: number[],
  degreeTypes: ChordTypeName[][],
): Set<string> {
  const rootSemitone = NOTE_TO_SEMITONE[rootNote];
  const set = new Set<string>();

  scaleOffsets.forEach((offset, degreeIndex) => {
    const noteSemitone = (rootSemitone + offset) % 12;
    const note = CHROMATIC_NOTES[noteSemitone];
    for (const type of degreeTypes[degreeIndex]) {
      set.add(`${note}:${type}`);
    }
  });

  return set;
}

// ── Generate all 24 keys ─────────────────────────────────────────────────────

/**
 * Lookup table: key string → Set of "root:chordType" strings.
 *
 * Key strings are "{note} major" or "{note} minor", e.g. "C major", "A minor".
 * These match the options shown in the KeySelector component.
 *
 * Usage:
 *   DIATONIC_CHORDS["C major"].has("G:7")   // true  — V7 of C major
 *   DIATONIC_CHORDS["A minor"].has("E:7")   // true  — harmonic minor V7
 *   DIATONIC_CHORDS["C major"].has("D:Major")// false — D major is not diatonic
 */
export const DIATONIC_CHORDS: Record<string, Set<string>> = {};

for (const note of CHROMATIC_NOTES) {
  DIATONIC_CHORDS[`${note} major`] = buildKeySet(note, MAJOR_SCALE_OFFSETS, MAJOR_DEGREE_TYPES);
  DIATONIC_CHORDS[`${note} minor`] = buildKeySet(note, MINOR_SCALE_OFFSETS, MINOR_DEGREE_TYPES);
}
