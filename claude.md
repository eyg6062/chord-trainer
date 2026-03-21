# Chord Trainer — CLAUDE.md

## Project Overview

A React + TypeScript + Tailwind chord practice web app. Generates random chords from a configurable pool, provides metronome-driven practice flow, and validates MIDI keyboard input with color feedback.

## Stack

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context + useReducer (single `AppContext`)
- **Persistence**: localStorage (settings slice only; practice state is transient)
- **Audio**: Tone.js (`PolySynth` default; soundfont-player for piano samples)
- **MIDI**: Web MIDI API (`navigator.requestMIDIAccess`)

## Architecture

### Layers (bottom-up dependency order)

1. **`src/constants/`** — Static data; no logic
   - `chordIntervals.ts` — ChordTypeName → interval string[] mapping (source of truth for all note calculations)
   - `notes.ts` — `CHROMATIC_NOTES`, `NOTE_TO_SEMITONE`
   - `extensions.ts` — `EXTENSION_REPLACES_DEGREE` (which scale degree each extension replaces)
   - `diatonicChords.ts` — 24-key lookup: `Record<string, Set<string>>` mapping `"C major"` → Set of `"root:chordType"` strings

2. **`src/logic/`** — Pure functions, no React
   - `intervalUtils.ts` — `intervalToSemitone(interval: string): number`
   - `chordValidation.ts` — `getExpectedPitchClasses`, `evaluatePlay`, `isNoteWrong`
   - `chordGeneration.ts` — `buildChordPool(settings): Chord[]`, `pickRandomChord(pool): Chord|null`

3. **`src/context/`** — State management
   - `reducer.ts` — Pure reducer; all action handlers
   - `AppContext.tsx` — `AppProvider`, `useApp()` hook, localStorage sync effect

4. **`src/hooks/`** — Side effects
   - `useAudio.ts` — Tone.js chord playback
   - `useMetronome.ts` — Tone.Transport tick loop → dispatches TICK/ADVANCE_CHORD
   - `useMidi.ts` — Web MIDI device enumeration + NOTE_ON dispatch

5. **`src/components/`** — UI only; reads from `useApp()`, dispatches actions
   - `practice/` — CurrentChordDisplay, MetronomeDots, NextChordPreview, PassedChordsList, PracticeControls, PracticeArea
   - `settings/` — MidiSettings, MetronomeSettings, NoteSelector, KeySelector, RootSelector, ChordTypeSelector, ExtensionSelector, SettingsPanel

### Key Design Decisions

**Chord pool building is outside the reducer.** `buildChordPool` is called in a `useMemo` whenever relevant settings change, and passed as a payload into `ADVANCE_CHORD`/`START_PRACTICE`. The reducer stays pure and has no access to the pool.

**`notesHitThisChord` is a `Set<number>` in practice state.** Stored in state (not a ref) so feedback updates reactively. Never serialized to localStorage.

**Key filter = diatonic filter.** `selectedKeys` contains strings like `"C major"`, `"A minor"` (24 options total). A chord passes the key filter if its `"root:chordType"` string exists in the diatonic set of at least one selected key.

**Extensions are independent modifiers.** Extensions are applied on top of selected chord types wherever musically valid (the target degree must exist in the base chord intervals). Conflicting extensions (same target degree) are mutually exclusive within one chord instance. `"alt"` is a special case: only valid on dominant-family chords, mutually exclusive with all other extensions.

**Auto-advance logic lives in hooks, not the reducer.** When MIDI-on + metronome-off, `useMidi` watches `currentFeedback` and dispatches `ADVANCE_CHORD` when the chord is complete. When metronome-on, `useMetronome` watches `currentTick >= ticksPerChord` and dispatches `ADVANCE_CHORD`.

## Chord Data Model

```ts
interface Chord {
  root: NoteClass;          // "C" | "C#" | "D" | ...
  chordType: ChordTypeName; // "Major" | "m7" | "M9" | ...
  extensions: Extension[];  // ["b5"] | ["#9", "#11"] | []
}

type ChordFeedback = "neutral" | "correct" | "correct-with-wrong" | "wrong" | "skipped";
```

## Interval → Semitone Reference

```
"1"→0  "b2"→1  "2"→2   "b3"→3  "3"→4  "4"→5
"b5"→6 "5"→7   "#5"→8  "6"→9   "bb7"→9 "b7"→10 "7"→11
"b9"→1 "9"→2   "#9"→3  "11"→5  "#11"→6 "b13"→8 "13"→9
```

## Diatonic Key Lookup

**Major keys**: I(maj/M7/M9/6/6/9/add9), ii(min/m7/m9/m(add9)), iii(min/m7), IV(maj/M7/M9/6/add9), V(maj/7/9/11/13), vi(min/m7/m9), vii°(dim/m7b5)

**Natural minor keys** (+ harmonic minor V7): i(min/m7/m9), ii°(dim/m7b5), III(maj/M7), iv(min/m7), v+V(min/m7 + dom 7/9 from harmonic), VI(maj/M7), VII(maj/7)

## UI Behavior Rules

| MIDI | Metronome | Chord advances when |
|------|-----------|---------------------|
| On   | Off       | Correct MIDI play   |
| On   | On        | N ticks elapse (color tracks correctness) |
| Off  | On        | N ticks elapse      |
| Off  | Off       | Next button only    |

- Chord feedback colors: neutral=black, correct=green, correct-with-wrong=yellow, wrong=red
- Start/Pause buttons are greyed (disabled) when metronome is off
- Next button is always enabled when a chord is active
- Passed chords capped at 20 entries; shown in reverse order (most recent first)

## Settings Defaults

```ts
{
  midiEnabled: false,
  selectedMidiDeviceId: null,
  metronomeEnabled: false,
  bpm: 80,
  ticksPerChord: 4,
  selectedKeys: [],           // empty = "All" (no key filter applied)
  selectedRoots: [...all 12], // all roots
  selectedChordTypes: ["Major", "minor"],
  allowedExtensions: [],
  nextChordPreviewCount: 2,
}
```

`selectedKeys: []` means the "All" toggle is on — no diatonic filter applied.
`selectedRoots` containing all 12 notes = "All" roots.

## Commands

```bash
npm run dev    # Start dev server (Vite)
npm run build  # TypeScript compile + Vite build
npm run lint   # ESLint
```
