import type { Chord } from '../types/chord';
import {
  NOTECLASS_TO_UI_STRING,
  CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING,
  EXTENSION_TO_UI_STRING,
} from '../constants/uiMapping';

export function formatChordName(chord: Chord): string {
  const root = NOTECLASS_TO_UI_STRING[chord.root];
  const type = CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING[chord.chordType];
  const exts = chord.extensions.map((e) => EXTENSION_TO_UI_STRING[e]).join('');
  return `${root}${type}${exts}`;
}
