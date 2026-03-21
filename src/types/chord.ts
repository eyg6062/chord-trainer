export type NoteClass =
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F'
  | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type Extension = 'b5' | '#5' | 'b9' | '#9' | '#11' | 'b13' | 'alt';

export type ChordTypeName =
  | 'Major' | 'minor' | 'dim' | 'aug' | 'sus2' | 'sus4'
  | 'M7' | 'm7' | '7' | 'mM7' | 'dim7' | 'm7b5' | 'augM7' | 'aug7'
  | '6' | 'm6' | '6/9'
  | 'M9' | 'm9' | '9' | '11' | 'M11' | 'm11' | '13' | 'M13' | 'm13'
  | 'add9' | 'm(add9)' | 'add11' | 'add13'
  | '7sus4';

export type ChordFeedback =
  | 'neutral'
  | 'correct'
  | 'correct-with-wrong'
  | 'wrong'
  | 'skipped';

export interface Chord {
  root: NoteClass;
  chordType: ChordTypeName;
  extensions: Extension[];
}

export interface PassedChord {
  chord: Chord;
  feedback: ChordFeedback;
}
