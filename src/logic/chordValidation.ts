import type { Chord, ChordFeedback } from '../types/chord';
import { CHORD_INTERVALS } from '../constants/chordIntervals';
import { EXTENSION_REPLACES_DEGREE } from '../constants/extensions';
import { NOTE_TO_SEMITONE } from '../constants/notes';
import { intervalToSemitone, getIntervalDegree } from './intervalUtils';

/**
 * Returns the set of pitch classes (0–11) that make up the given chord,
 * accounting for any extensions applied on top of the base intervals.
 *
 * Extensions replace the base interval that shares their target degree.
 */
export function getExpectedPitchClasses(chord: Chord): Set<number> {
  const rootSemitone = NOTE_TO_SEMITONE[chord.root];
  let intervals = [...CHORD_INTERVALS[chord.chordType]];

  for (const ext of chord.extensions) {
    const targetDegree = EXTENSION_REPLACES_DEGREE[ext];
    intervals = intervals.filter((i) => getIntervalDegree(i) !== targetDegree);
    intervals.push(ext); // Extension strings are valid interval keys
  }

  return new Set(intervals.map((i) => (rootSemitone + intervalToSemitone(i)) % 12));
}

/**
 * Returns true if the given pitch class is not in the expected set.
 */
export function isNoteWrong(pitchClass: number, expected: Set<number>): boolean {
  return !expected.has(pitchClass);
}

/**
 * Derives the current chord feedback from what has been played so far.
 *
 * neutral          — chord incomplete, no wrong notes yet
 * wrong            — chord incomplete, at least one wrong note played
 * correct          — all expected notes hit, no wrong notes
 * correct-with-wrong — all expected notes hit, but some wrong notes were played
 */
export function evaluatePlay(
  expected: Set<number>,
  notesHit: Set<number>,
  wrongNotePlayed: boolean,
): ChordFeedback {
  const allHit = [...expected].every((pc) => notesHit.has(pc));
  if (allHit) {
    return wrongNotePlayed ? 'correct-with-wrong' : 'correct';
  }
  return wrongNotePlayed ? 'wrong' : 'neutral';
}
