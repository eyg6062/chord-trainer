import { describe, it, expect } from 'vitest';
import { getValidExtensionSubsets, buildChordPool, pickRandomChord } from './chordGeneration';
import type { Chord, ChordTypeName, Extension, NoteClass } from '../types/chord';

// ── getValidExtensionSubsets ──────────────────────────────────────────────────

describe('getValidExtensionSubsets', () => {
  describe('empty allowedExtensions', () => {
    it('always returns [[]] regardless of chord type', () => {
      expect(getValidExtensionSubsets('Major', [])).toEqual([[]]);
      expect(getValidExtensionSubsets('m7', [])).toEqual([[]]);
      expect(getValidExtensionSubsets('dim7', [])).toEqual([[]]);
    });
  });

  describe('extension degree validation', () => {
    it('excludes extensions whose target degree is not in the chord', () => {
      // Major triad has no 7th, so b9 (targets 9) is invalid — no 9 in Major
      // Also no 9 in Major, no 11, no 13
      const subsets = getValidExtensionSubsets('Major', ['b9', '#9', '#11', 'b13']);
      expect(subsets).toEqual([[]]); // all extensions invalid → only plain chord
    });

    it('includes b5 on chords that have a 5th', () => {
      const subsets = getValidExtensionSubsets('m7', ['b5']);
      expect(subsets).toContainEqual([]);
      expect(subsets).toContainEqual(['b5']);
      expect(subsets).toHaveLength(2);
    });

    it('excludes b5 on chords that already have b5 as the base (dim7)', () => {
      // dim7 base intervals: 1, b3, b5, bb7 — already contains "b5" literally
      // so "b5" extension is redundant and excluded
      const subsets = getValidExtensionSubsets('dim7', ['b5']);
      expect(subsets).toEqual([[]]);
    });

    it('includes b9 on m7 which has no 9 in base — b9 targets degree 9, not present', () => {
      // m7 base = 1, b3, 5, b7 — no 9 → b9 invalid
      const subsets = getValidExtensionSubsets('m7', ['b9']);
      expect(subsets).toEqual([[]]);
    });

    it('includes b9 on 9 chord which has degree 9 in base', () => {
      // 9 chord base = 1, 3, 5, b7, 9 — has degree 9 → b9 valid
      const subsets = getValidExtensionSubsets('9', ['b9']);
      expect(subsets).toContainEqual([]);
      expect(subsets).toContainEqual(['b9']);
    });
  });

  describe('conflict prevention', () => {
    it('never produces subsets with both b5 and #5 (same target degree)', () => {
      const subsets = getValidExtensionSubsets('m7', ['b5', '#5']);
      const hasConflict = subsets.some(
        s => s.includes('b5') && s.includes('#5')
      );
      expect(hasConflict).toBe(false);
    });

    it('produces individual subsets for each conflicting extension', () => {
      const subsets = getValidExtensionSubsets('m7', ['b5', '#5']);
      expect(subsets).toContainEqual([]);
      expect(subsets).toContainEqual(['b5']);
      expect(subsets).toContainEqual(['#5']);
      expect(subsets).toHaveLength(3); // [], [b5], [#5] — not [b5, #5]
    });

    it('never produces subsets with both b9 and #9', () => {
      const subsets = getValidExtensionSubsets('9', ['b9', '#9']);
      const hasConflict = subsets.some(
        s => s.includes('b9') && s.includes('#9')
      );
      expect(hasConflict).toBe(false);
    });
  });

  describe('multiple independent extensions', () => {
    it('combines non-conflicting extensions freely', () => {
      // m9 base = 1, b3, 5, b7, 9 — has 5 and 9
      // b5 targets 5, b9 targets 9 → independent, can coexist
      const subsets = getValidExtensionSubsets('m9', ['b5', 'b9']);
      expect(subsets).toContainEqual([]);
      expect(subsets).toContainEqual(['b5']);
      expect(subsets).toContainEqual(['b9']);
      expect(subsets).toContainEqual(expect.arrayContaining(['b5', 'b9']));
    });

    it('produces the cartesian product count for independent pairs', () => {
      // 2 independent degrees × 1 choice each → 2×2 = 4 subsets ([], [b5], [b9], [b5,b9])
      const subsets = getValidExtensionSubsets('m9', ['b5', 'b9']);
      expect(subsets).toHaveLength(4);
    });

    it('handles three independent extensions', () => {
      // 13 chord base = 1, 3, 5, b7, 9, 11, 13 — has 5, 9, 13
      // b5 (→5), b9 (→9), b13 (→13) are all independent
      const subsets = getValidExtensionSubsets('13', ['b5', 'b9', 'b13']);
      expect(subsets).toHaveLength(8); // 2^3
    });
  });

});

// ── buildChordPool ────────────────────────────────────────────────────────────

const baseSettings = {
  selectedKeys: [] as string[],
  selectedRoots: ['C', 'D', 'G'] as NoteClass[],
  selectedChordTypes: ['Major', 'minor'] as ChordTypeName[],
  allowedExtensions: [] as Extension[],
};


describe('buildChordPool', () => {
  describe('basic pool construction', () => {
    it('returns an empty pool when selectedRoots is empty', () => {
      const pool = buildChordPool({ ...baseSettings, selectedRoots: [] });
      expect(pool).toHaveLength(0);
    });

    it('returns an empty pool when selectedChordTypes is empty', () => {
      const pool = buildChordPool({ ...baseSettings, selectedChordTypes: [] });
      expect(pool).toHaveLength(0);
    });

    it('produces roots × chordTypes entries with no extensions selected', () => {
      const pool = buildChordPool(baseSettings);
      // 3 roots × 2 chord types × 1 extension subset ([]) = 6
      expect(pool).toHaveLength(6);
    });

    it('contains the expected chords', () => {
      const pool = buildChordPool({
        ...baseSettings,
        selectedRoots: ['D'],
        selectedChordTypes: ['m7'],
      });
      expect(pool).toHaveLength(1);
      expect(pool[0]).toEqual({ root: 'D', chordType: 'm7', extensions: [] });
    });

    it('all pool entries have empty extensions when none are allowed', () => {
      const pool = buildChordPool(baseSettings);
      expect(pool.every(c => c.extensions.length === 0)).toBe(true);
    });
  });

  describe('extension expansion', () => {
    it('expands pool when valid extensions are allowed', () => {
      // m7 has a 5th → b5 is valid → each m7 entry appears twice: [] and [b5]
      const pool = buildChordPool({
        selectedKeys: [],
        selectedRoots: ['D'],
        selectedChordTypes: ['m7'],
        allowedExtensions: ['b5'],
      });
      expect(pool).toHaveLength(2);
      expect(pool).toContainEqual({ root: 'D', chordType: 'm7', extensions: [] });
      expect(pool).toContainEqual({ root: 'D', chordType: 'm7', extensions: ['b5'] });
    });

    it('does not expand pool for extensions invalid on that chord type', () => {
      // Major triad has no 9 → b9 is invalid → pool stays at 1 entry
      const pool = buildChordPool({
        selectedKeys: [],
        selectedRoots: ['C'],
        selectedChordTypes: ['Major'],
        allowedExtensions: ['b9'],
      });
      expect(pool).toHaveLength(1);
      expect(pool[0].extensions).toHaveLength(0);
    });

    it('correctly expands multiple chord types with different valid extensions', () => {
      // m7 → b5 valid (has 5); Major → b5 valid (has 5)
      const pool = buildChordPool({
        selectedKeys: [],
        selectedRoots: ['C'],
        selectedChordTypes: ['m7', 'Major'],
        allowedExtensions: ['b5'],
      });
      // Each chord type → 2 subsets ([], [b5]) → 4 total
      expect(pool).toHaveLength(4);
    });
  });

  describe('key filter', () => {
    it('returns full pool when selectedKeys is empty (no filter)', () => {
      const withoutFilter = buildChordPool(baseSettings);
      const withEmptyKeys = buildChordPool({ ...baseSettings, selectedKeys: [] });
      expect(withoutFilter).toHaveLength(withEmptyKeys.length);
    });

    it('keeps only diatonic chords when keys are selected', () => {
      const pool = buildChordPool({
        ...baseSettings,
        selectedRoots: ['G'],
        selectedChordTypes: ['7'],
        selectedKeys: ['C major'],
      });
      // G:7 is the V7 of C major → diatonic → included
      expect(pool).toHaveLength(1);
      expect(pool[0]).toEqual({ root: 'G', chordType: '7', extensions: [] });
    });

    it('excludes non-diatonic chords when key filter is active', () => {
      const pool = buildChordPool({
        ...baseSettings,
        selectedRoots: ['D'],
        selectedChordTypes: ['Major'],
        selectedKeys: ['C major'],
      });
      // D Major is not diatonic to C major (D is ii, which is minor)
      expect(pool).toHaveLength(0);
    });

    it('includes a chord if it is diatonic to ANY selected key', () => {
      const pool = buildChordPool({
        ...baseSettings,
        selectedRoots: ['G'],
        selectedChordTypes: ['7'],
        selectedKeys: ['C major', 'F major'], // G:7 is V7 in C major
      });
      expect(pool.length).toBeGreaterThan(0);
    });

    it('returns empty pool when no root:chordType is diatonic to the selected keys', () => {
      const pool = buildChordPool({
        selectedKeys: ['C major'],
        selectedRoots: ['C#'],
        selectedChordTypes: ['Major'],
        allowedExtensions: [],
      });
      // C# Major is not diatonic to C major
      expect(pool).toHaveLength(0);
    });

    it('harmonic minor V7 passes the A minor key filter', () => {
      const pool = buildChordPool({
        selectedKeys: ['A minor'],
        selectedRoots: ['E'],
        selectedChordTypes: ['7'],
        allowedExtensions: [],
      });
      // E:7 is the harmonic minor V7 of A minor → diatonic
      expect(pool).toHaveLength(1);
    });
  });
});

// ── pickRandomChord ───────────────────────────────────────────────────────────

describe('pickRandomChord', () => {
  it('returns null for an empty pool', () => {
    expect(pickRandomChord([])).toBeNull();
  });

  it('returns the only element from a single-entry pool', () => {
    const chord: Chord = { root: 'C', chordType: 'Major', extensions: [] };
    expect(pickRandomChord([chord])).toEqual(chord);
  });

  it('always returns an element that exists in the pool', () => {
    const pool = buildChordPool({
      selectedKeys: [],
      selectedRoots: ['C', 'D', 'E', 'F', 'G'],
      selectedChordTypes: ['Major', 'minor', 'm7', '7'],
      allowedExtensions: [],
    });
    for (let i = 0; i < 20; i++) {
      const pick = pickRandomChord(pool);
      expect(pool).toContainEqual(pick);
    }
  });
});
