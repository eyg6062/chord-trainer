import type { Extension } from '../types/chord';

/**
 * Maps each extension to the degree number it targets.
 * When applying an extension, the interval in the chord whose
 * numeric degree matches this value gets replaced.
 *
 * e.g. "b5" targets degree "5" → replaces the "5" interval with "b5"
 *      "#9" targets degree "9" → replaces the "9" interval with "#9"
 */
export const EXTENSION_REPLACES_DEGREE: Record<Extension, string> = {
  'b5':  '5',
  '#5':  '5',
  'b9':  '9',
  '#9':  '9',
  '#11': '11',
  'b13': '13',
};
