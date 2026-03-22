import { describe, it, expect } from 'vitest';
import { DIATONIC_CHORDS } from './diatonicChords';

const has = (key: string, entry: string) => DIATONIC_CHORDS[key].has(entry);

describe('DIATONIC_CHORDS — major keys', () => {
  it('includes all diatonic degrees for C major', () => {
    // I — tonic
    expect(has('C major', 'C:Major')).toBe(true);
    expect(has('C major', 'C:M7')).toBe(true);
    expect(has('C major', 'C:M9')).toBe(true);
    // ii — supertonic minor
    expect(has('C major', 'D:minor')).toBe(true);
    expect(has('C major', 'D:m7')).toBe(true);
    // iii — mediant minor
    expect(has('C major', 'E:minor')).toBe(true);
    expect(has('C major', 'E:m7')).toBe(true);
    // IV — subdominant
    expect(has('C major', 'F:Major')).toBe(true);
    expect(has('C major', 'F:M7')).toBe(true);
    // V — dominant
    expect(has('C major', 'G:Major')).toBe(true);
    expect(has('C major', 'G:7')).toBe(true);
    expect(has('C major', 'G:9')).toBe(true);
    expect(has('C major', 'G:7sus4')).toBe(true);
    // vi — submediant minor
    expect(has('C major', 'A:minor')).toBe(true);
    expect(has('C major', 'A:m7')).toBe(true);
    // vii° — leading tone
    expect(has('C major', 'B:dim')).toBe(true);
    expect(has('C major', 'B:m7b5')).toBe(true);
  });

  it('excludes non-diatonic chords from C major', () => {
    expect(has('C major', 'D:Major')).toBe(false);  // D major not diatonic
    expect(has('C major', 'G:Major')).toBe(true);   // G major is (sanity check)
    expect(has('C major', 'F#:minor')).toBe(false); // F# not in C major
    expect(has('C major', 'C:minor')).toBe(false);  // C minor not diatonic to C major
    expect(has('C major', 'G:M7')).toBe(false);     // G with major 7th = F# not in C major
  });

  it('is consistent for other major keys (G major)', () => {
    // V of G major = D
    expect(has('G major', 'D:7')).toBe(true);
    // ii of G major = A minor
    expect(has('G major', 'A:minor')).toBe(true);
    expect(has('G major', 'A:m7')).toBe(true);
    // F# is the leading tone (vii°)
    expect(has('G major', 'F#:dim')).toBe(true);
    expect(has('G major', 'F#:m7b5')).toBe(true);
    // F natural is not in G major
    expect(has('G major', 'F:Major')).toBe(false);
  });

  it('generates sets for all 12 major keys', () => {
    const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    for (const note of notes) {
      expect(DIATONIC_CHORDS[`${note} major`]).toBeDefined();
      expect(DIATONIC_CHORDS[`${note} major`].size).toBeGreaterThan(0);
    }
  });
});

describe('DIATONIC_CHORDS — minor keys', () => {
  it('includes diatonic degrees for A minor', () => {
    // i — tonic minor
    expect(has('A minor', 'A:minor')).toBe(true);
    expect(has('A minor', 'A:m7')).toBe(true);
    // ii° — supertonic diminished
    expect(has('A minor', 'B:dim')).toBe(true);
    expect(has('A minor', 'B:m7b5')).toBe(true);
    // III — mediant major (bIII)
    expect(has('A minor', 'C:Major')).toBe(true);
    expect(has('A minor', 'C:M7')).toBe(true);
    // iv — subdominant minor
    expect(has('A minor', 'D:minor')).toBe(true);
    expect(has('A minor', 'D:m7')).toBe(true);
    // VI — submediant major (bVI)
    expect(has('A minor', 'F:Major')).toBe(true);
    expect(has('A minor', 'F:M7')).toBe(true);
    // VII — subtonic major (bVII)
    expect(has('A minor', 'G:Major')).toBe(true);
  });

  it('includes harmonic minor V7 in A minor', () => {
    expect(has('A minor', 'E:7')).toBe(true);
    expect(has('A minor', 'E:Major')).toBe(true);
  });

  it('also includes natural minor v in A minor', () => {
    expect(has('A minor', 'E:minor')).toBe(true);
    expect(has('A minor', 'E:m7')).toBe(true);
  });

  it('excludes non-diatonic chords from A minor', () => {
    expect(has('A minor', 'A:Major')).toBe(false);  // A major not diatonic
    expect(has('A minor', 'D:Major')).toBe(false);  // D major not diatonic
    expect(has('A minor', 'G#:dim')).toBe(false);   // G# only in harmonic minor melody
  });

  it('generates sets for all 12 minor keys', () => {
    const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    for (const note of notes) {
      expect(DIATONIC_CHORDS[`${note} minor`]).toBeDefined();
      expect(DIATONIC_CHORDS[`${note} minor`].size).toBeGreaterThan(0);
    }
  });
});
