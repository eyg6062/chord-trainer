import type { Chord, ChordTypeName, Extension } from '../types/chord';
import type { Settings } from '../types/state';
import { CHORD_INTERVALS } from '../constants/chordIntervals';
import { DIATONIC_CHORDS } from '../constants/diatonicChords';
import { EXTENSION_REPLACES_DEGREE } from '../constants/extensions';
import { getIntervalDegree } from './intervalUtils';

// ── Extension enumeration ────────────────────────────────────────────────────

/**
 * Returns every valid, non-conflicting subset of `allowedExtensions`
 * for the given chord type, including the empty subset (plain chord).
 *
 * Rules:
 *  - The empty subset [] is always included (represents the plain chord).
 *  - A regular extension is valid only if its target degree (from
 *    EXTENSION_REPLACES_DEGREE) exists in the chord's base intervals.
 *  - Two extensions targeting the same degree (e.g. b5 + #5) cannot
 *    coexist — at most one is chosen per degree.
 * When `allowedExtensions` is empty this returns [[]], so callers
 * always receive at least one entry and the plain chord always works.
 */
export function getValidExtensionSubsets(
  chordType: ChordTypeName,
  allowedExtensions: Extension[],
): Extension[][] {
  // Fast path: no extensions selected → only the plain chord
  if (allowedExtensions.length === 0) return [[]];

  const baseIntervals = CHORD_INTERVALS[chordType];
  const baseDegrees = new Set(baseIntervals.map(getIntervalDegree));

  const results: Extension[][] = [[]]; // plain chord is always valid

  // Keep only extensions whose target degree is present in the base chord
  // and whose interval isn't already literally present.
  const validRegular = allowedExtensions.filter((ext) => {
    const targetDegree = EXTENSION_REPLACES_DEGREE[ext];
    return baseDegrees.has(targetDegree) && !baseIntervals.includes(ext);
  });

  if (validRegular.length === 0) return results;

  // Group by target degree so we can enforce the "at most one per degree" rule.
  const byDegree = new Map<string, Extension[]>();
  for (const ext of validRegular) {
    const degree = EXTENSION_REPLACES_DEGREE[ext]!;
    const group = byDegree.get(degree);
    if (group) {
      group.push(ext);
    } else {
      byDegree.set(degree, [ext]);
    }
  }

  // Build choice lists: for each degree group, [null, ext1, ext2, ...]
  // null means "don't include this degree in this subset".
  const groups = Array.from(byDegree.values());
  const choices = groups.map((exts) => [null, ...exts] as (Extension | null)[]);

  // Enumerate the cartesian product of all choice lists.
  // Each combination that has at least one non-null choice becomes a subset.
  function enumerate(groupIndex: number, current: Extension[]): void {
    if (groupIndex === choices.length) {
      if (current.length > 0) {
        results.push([...current]);
      }
      return;
    }
    for (const choice of choices[groupIndex]) {
      if (choice === null) {
        enumerate(groupIndex + 1, current);
      } else {
        current.push(choice);
        enumerate(groupIndex + 1, current);
        current.pop();
      }
    }
  }

  enumerate(0, []);

  return results;
}

// ── Pool builder ─────────────────────────────────────────────────────────────

/**
 * Builds the full chord pool from the current settings.
 *
 * Steps:
 *  1. Cross-product selectedRoots × selectedChordTypes.
 *  2. If selectedKeys is non-empty, keep only pairs that are diatonic
 *     to at least one selected key.
 *  3. For each surviving pair, enumerate all valid extension subsets
 *     (always includes the empty subset = plain chord).
 *  4. Flatten into a Chord[].
 *
 * Returns [] if the settings produce no valid combinations.
 * This should be called in a useMemo and passed into dispatched actions,
 * keeping the reducer pure.
 */
export function buildChordPool(settings: Pick<Settings,
  'selectedRoots' | 'selectedChordTypes' | 'allowedExtensions' | 'selectedKeys'
>): Chord[] {
  const { selectedRoots, selectedChordTypes, allowedExtensions, selectedKeys } = settings;
  const keyFilterActive = selectedKeys.length > 0;
  const pool: Chord[] = [];

  for (const root of selectedRoots) {
    for (const chordType of selectedChordTypes) {
      if (keyFilterActive) {
        const isDiatonic = selectedKeys.some(
          (key) => DIATONIC_CHORDS[key]?.has(`${root}:${chordType}`),
        );
        if (!isDiatonic) continue;
      }

      const extensionSubsets = getValidExtensionSubsets(chordType, allowedExtensions);
      for (const extensions of extensionSubsets) {
        pool.push({ root, chordType, extensions });
      }
    }
  }

  return pool;
}

/**
 * Picks a uniformly random chord from the pool.
 * Returns null if the pool is empty.
 */
export function pickRandomChord(pool: Chord[]): Chord | null {
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
