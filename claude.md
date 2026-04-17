# Chord Trainer — CLAUDE.md

## Project Overview

A React + TypeScript + Tailwind chord practice web app. Generates random chords from a configurable pool, provides metronome-driven practice flow, and validates MIDI keyboard input with color feedback.

## Stack

- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context + useReducer (single `AppContext`)
- **Persistence**: localStorage (settings only; practice state is transient)
- **Audio**: Tone.js `Sampler` with Salamander piano soundfont (loaded from CDN)
- **MIDI**: Web MIDI API (`navigator.requestMIDIAccess`)

## Commands

```bash
npm run dev    # Start dev server (Vite)
npm run build  # TypeScript compile + Vite build
npm run lint   # ESLint
```

## Directory Structure

```
src/
├── App.tsx                        # Root; wraps AppProvider, renders layout
├── main.tsx
├── assets/
│   └── metronome-tick.flac
├── types/
│   ├── chord.ts                   # Chord, ChordFeedback, PassedChord, NoteClass, Extension, ChordTypeName
│   ├── state.ts                   # Settings, PracticeState, AppState, Action
│   └── midi.ts                    # MidiDevice
├── constants/
│   ├── chordIntervals.ts          # ChordTypeName → interval[] (source of truth)
│   ├── notes.ts                   # CHROMATIC_NOTES, NOTE_TO_SEMITONE
│   ├── extensions.ts              # EXTENSION_REPLACES_DEGREE, DOMINANT_FAMILY
│   ├── diatonicChords.ts          # 24-key diatonic lookup
│   └── uiMapping.ts               # Display string maps for notes/chords/extensions
├── logic/
│   ├── chordGeneration.ts         # buildChordPool(), pickRandomChord(), getValidExtensionSubsets()
│   ├── chordValidation.ts         # getExpectedPitchClasses(), evaluatePlay(), isNoteWrong()
│   ├── intervalUtils.ts           # intervalToSemitone(), getIntervalDegree()
│   └── formatChord.ts             # formatChordName()
├── context/
│   ├── reducer.ts                 # Pure reducer + DEFAULT_SETTINGS + INITIAL_STATE
│   └── AppContext.tsx             # AppProvider, useApp() hook, localStorage sync, chordPool useMemo
├── hooks/
│   ├── useAudio.ts                # Tone.js Sampler; returns { playChord }
│   ├── useMetronome.ts            # Web Audio API scheduler; dispatches TICK/ADVANCE_CHORD
│   └── useMidi.ts                 # MIDI device enumeration + NOTE_ON dispatch; returns { refreshDevices }
└── components/
    ├── practice/
    │   ├── PracticeArea.tsx        # Main practice container; lifecycle management
    │   ├── CurrentChordDisplay.tsx # Large chord name with feedback color
    │   ├── MetronomeDots.tsx       # Visual tick counter (metronome-on only)
    │   ├── NextChordPreview.tsx    # Upcoming 1–4 chords
    │   ├── PassedChordsList.tsx    # Chord history with feedback badges
    │   └── PracticeControls.tsx   # Start/Pause/Restart/Next/Play buttons
    └── settings/
        ├── SettingsPanel.tsx
        ├── MidiSettings.tsx        # MIDI enable, device select, auto-advance toggle
        ├── MetronomeSettings.tsx   # BPM + ticks-per-chord sliders
        ├── ChordPreviewSettings.tsx
        ├── ChordTypeSelector.tsx   # Grouped selection; exports CHORD_GROUPS, ALL_CHORD_TYPES
        ├── RootSelector.tsx
        ├── KeySelector.tsx
        ├── ExtensionSelector.tsx   # Exports ALL_EXTENSION_VALUES
        ├── NoteSelector.tsx        # Reusable multi-select grid (used by Root/Key selectors)
        ├── SliderNumberInput.tsx   # Synced range + number input
        └── InfoTooltip.tsx
```

## Architecture

### Layer Order (bottom → top dependency)

1. **`constants/`** — Static data, no logic
2. **`logic/`** — Pure functions, no React
3. **`context/`** — State management
4. **`hooks/`** — Side effects (depend on context + logic)
5. **`components/`** — UI only (read `useApp()`, dispatch actions)

### Key Design Decisions

**Chord pool is built outside the reducer.** `buildChordPool` runs in a `useMemo` in `AppContext` whenever pool-relevant settings change. It's passed as a payload in `ADVANCE_CHORD`/`START_PRACTICE`/`SKIP_CHORD`/`INIT_CHORDS`. The reducer stays pure and does no random selection.

**`notesHitThisChord` is `Set<number>` in React state** (not a ref) so feedback updates reactively. Never serialized to localStorage.

**`readyToAdvance` flag drives MIDI auto-advance.** When a chord is fully played correctly, the reducer sets `readyToAdvance: true`. `useMidi` watches this and — if `autoAdvanceEnabled` — waits 500ms, dispatches `ADVANCE_CHORD`, then resumes.

**Auto-advance lives in hooks.** MIDI-on + metronome-off: `useMidi` watches `readyToAdvance`. Metronome-on: `useMetronome` watches `currentTick >= ticksPerChord`. Both dispatch `ADVANCE_CHORD`.

**Key filter = diatonic filter.** `selectedKeys` holds strings like `"C major"`, `"A minor"`. A chord passes if `"root:chordType"` exists in the diatonic set of any selected key. Filter only active when `keysFilterEnabled === true`.

**Extensions are independent modifiers.** Applied on top of chord types where musically valid (target degree must exist in base intervals). Conflicting extensions (same degree) are mutually exclusive. `"alt"` is only valid on dominant-family chords and is mutually exclusive with all other extensions.

**Next chord queue is maintained in practice state.** `nextChords: Chord[]` holds up to `nextChordPreviewCount` upcoming chords. `PracticeArea` manages the queue via `INIT_CHORDS` and keeps it topped up on each advance.

## Data Model

```ts
type NoteClass = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

type Extension = 'b5' | '#5' | 'b9' | '#9' | '#11' | 'b13' | 'alt'

type ChordFeedback = 'neutral' | 'correct' | 'correct-with-wrong' | 'wrong' | 'skipped'

interface Chord {
  root: NoteClass
  chordType: ChordTypeName    // 'Major' | 'minor' | 'm7' | 'M9' | ... (39 types total)
  extensions: Extension[]
}

interface PassedChord {
  chord: Chord
  feedback: ChordFeedback
}

interface MidiDevice {
  id: string
  name: string
  connected: boolean
}
```

## State Shape

### Settings (persisted to localStorage)

```ts
interface Settings {
  // MIDI
  midiEnabled: boolean
  selectedMidiDeviceId: string | null
  autoAdvanceEnabled: boolean         // auto-advance chord 500ms after correct MIDI play

  // Metronome
  metronomeEnabled: boolean
  bpm: number
  ticksPerChord: number

  // Chord pool
  keysFilterEnabled: boolean
  selectedKeys: string[]              // e.g. ["C major", "A minor"]; empty = no filter
  allRootsEnabled: boolean
  selectedRoots: NoteClass[]
  allChordTypesEnabled: boolean
  allGroupsEnabled: Record<string, boolean>  // keyed by group label
  selectedChordTypes: ChordTypeName[]
  allExtensionsEnabled: boolean
  allowedExtensions: Extension[]

  // Preview
  chordPreviewEnabled: boolean
  nextChordPreviewCount: number       // 1–4
}
```

### PracticeState (transient)

```ts
interface PracticeState {
  isRunning: boolean
  currentChord: Chord | null
  nextChords: Chord[]                 // upcoming chord queue
  passedChords: PassedChord[]         // history, capped at 20; newest first
  currentTick: number
  currentFeedback: ChordFeedback
  notesHitThisChord: Set<number>      // pitch classes 0–11; not serialized
  wrongNotePlayedThisChord: boolean
  readyToAdvance: boolean             // true when chord fully played correctly
}
```

## Reducer Actions

**Settings:**
`SET_MIDI_ENABLED` · `SET_MIDI_DEVICE` · `SET_AUTO_ADVANCE_ENABLED` · `SET_METRONOME_ENABLED` · `SET_BPM` · `SET_TICKS_PER_CHORD` · `SET_KEYS_FILTER_ENABLED` · `SET_SELECTED_KEYS` · `SET_ALL_ROOTS_ENABLED` · `SET_SELECTED_ROOTS` · `SET_ALL_CHORD_TYPES_ENABLED` · `SET_ALL_GROUPS_ENABLED` · `SET_SELECTED_CHORD_TYPES` · `SET_ALL_EXTENSIONS_ENABLED` · `SET_ALLOWED_EXTENSIONS` · `SET_CHORD_PREVIEW_ENABLED` · `SET_NEXT_CHORD_PREVIEW_COUNT`

**MIDI / Devices:**
`SET_MIDI_DEVICES` · `NOTE_ON { pitchClass: number }`

**Practice lifecycle:**
`INIT_CHORDS { currentChord, nextChords }` · `START_PRACTICE { pool }` · `RESUME_PRACTICE` · `PAUSE_PRACTICE` · `ADVANCE_CHORD { feedback, newChord, startTick? }` · `SKIP_CHORD { newChord }` · `TICK`

## Settings Defaults

```ts
{
  midiEnabled: false,
  selectedMidiDeviceId: null,
  autoAdvanceEnabled: false,
  metronomeEnabled: true,
  bpm: 120,
  ticksPerChord: 4,
  keysFilterEnabled: false,
  selectedKeys: [],
  allRootsEnabled: true,
  selectedRoots: [...all 12],
  allChordTypesEnabled: false,
  allGroupsEnabled: {},
  selectedChordTypes: ['Major', 'minor', 'dim', 'aug', 'M7', 'm7', '7'],
  allExtensionsEnabled: false,
  allowedExtensions: [],
  chordPreviewEnabled: true,
  nextChordPreviewCount: 2,
}
```

## UI Behavior Rules

| MIDI | Auto-advance | Metronome | Chord advances when |
|------|-------------|-----------|---------------------|
| On   | On          | Off       | Correct play → 500ms pause → advance |
| On   | Off         | Off       | Next button only |
| On   | —           | On        | N ticks elapse (color tracks correctness) |
| Off  | —           | On        | N ticks elapse |
| Off  | —           | Off       | Next button only |

- Feedback colors: neutral=white, correct=green, correct-with-wrong=yellow, wrong=red, skipped=gray
- Start/Pause disabled when metronome is off
- Next button disabled when chord pool is empty
- Passed chords capped at 20; displayed newest-first

## Chord Type Groups (ChordTypeSelector)

| Group | Types |
|-------|-------|
| Triads | Major, minor, dim, aug |
| Sevenths | M7, m7, 7, mM7, dim7, m7b5, augM7, aug7 |
| Six Chords | 6, m6, 6/9 |
| Extended | M9, m9, 9, 11, M11, m11, 13, M13, m13 |
| Added Tone | add9, m(add9), add11, add13 |
| Suspended | sus2, sus4, 7sus4 |

## Interval → Semitone Reference

```
"1"→0  "b2"→1  "2"→2   "b3"→3  "3"→4  "4"→5
"b5"→6 "5"→7   "#5"→8  "6"→9   "bb7"→9 "b7"→10 "7"→11
"b9"→1 "9"→2   "#9"→3  "11"→5  "#11"→6 "b13"→8 "13"→9
```

## Diatonic Key Coverage

**Major keys**: I(maj/M7/M9/6/6/9/add9), ii(min/m7/m9/m(add9)), iii(min/m7), IV(maj/M7/M9/6/add9), V(maj/7/9/11/13), vi(min/m7/m9), vii°(dim/m7b5)

**Natural minor keys** (+ harmonic minor V7): i(min/m7/m9), ii°(dim/m7b5), III(maj/M7), iv(min/m7), v+V(min/m7 + dom7/9 from harmonic), VI(maj/M7), VII(maj/7)
