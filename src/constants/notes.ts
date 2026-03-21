import type { NoteClass } from '../types/chord';

export const CHROMATIC_NOTES: NoteClass[] = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

export const NOTE_TO_SEMITONE: Record<NoteClass, number> = {
  'C':  0,
  'C#': 1,
  'D':  2,
  'D#': 3,
  'E':  4,
  'F':  5,
  'F#': 6,
  'G':  7,
  'G#': 8,
  'A':  9,
  'A#': 10,
  'B':  11,
};
