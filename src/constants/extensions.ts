import type { Extension, ChordTypeName } from '../types/chord';

/**
 * Maps each extension to the degree number it targets.
 * When applying an extension, the interval in the chord whose
 * numeric degree matches this value gets replaced.
 *
 * e.g. "b5" targets degree "5" → replaces the "5" interval with "b5"
 *      "#9" targets degree "9" → replaces the "9" interval with "#9"
 *
 * "alt" is null because it is handled separately as a special case.
 */
export const EXTENSION_REPLACES_DEGREE: Record<Extension, string | null> = {
  'b5':  '5',
  '#5':  '5',
  'b9':  '9',
  '#9':  '9',
  '#11': '11',
  'b13': '13',
  'alt': null,
};

/**
 * Chord types that belong to the dominant family (have a b7, no natural 7).
 * Only these are eligible for the "alt" extension.
 */
export const DOMINANT_FAMILY: Set<ChordTypeName> = new Set([
  '7', 'aug7', '9', '11', '13', '7sus4',
]);
