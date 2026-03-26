import type { AppState, Action, Settings, PracticeState } from '../types/state';
import type { Chord, ChordFeedback } from '../types/chord';
import { CHROMATIC_NOTES } from '../constants/notes';

// ── Defaults ──────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: Settings = {
  midiEnabled: false,
  selectedMidiDeviceId: null,
  metronomeEnabled: true,
  bpm: 120,
  ticksPerChord: 4,
  allKeysEnabled: false,
  selectedKeys: [],
  allRootsEnabled: true,
  selectedRoots: [...CHROMATIC_NOTES],
  allChordTypesEnabled: false,
  allGroupsEnabled: {},
  selectedChordTypes: ['Major', 'minor', 'dim', 'aug', 'M7', 'm7', '7'],
  allExtensionsEnabled: false,
  allowedExtensions: [],
  chordPreviewEnabled: true,
  nextChordPreviewCount: 2,
};

const DEFAULT_PRACTICE: PracticeState = {
  isRunning: false,
  currentChord: null,
  nextChords: [],
  passedChords: [],
  currentTick: 0,
  currentFeedback: 'neutral',
  notesHitThisChord: new Set(),
  wrongNotePlayedThisChord: false,
  readyToAdvance: false,
};

export const INITIAL_STATE: AppState = {
  settings: DEFAULT_SETTINGS,
  practice: DEFAULT_PRACTICE,
  midiDevices: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const MAX_PASSED_CHORDS = 20;

function advanceChord(
  practice: PracticeState,
  payload: { feedback: ChordFeedback; newChord: Chord | null },
): PracticeState {
  const { feedback: fb, newChord } = payload;

  const newPassed = practice.currentChord
    ? [{ chord: practice.currentChord, feedback: fb }, ...practice.passedChords].slice(
        0,
        MAX_PASSED_CHORDS,
      )
    : practice.passedChords;

  const [next, ...rest] = practice.nextChords;

  return {
    ...practice,
    currentChord: next ?? newChord,
    nextChords: next !== undefined ? [...rest, ...(newChord ? [newChord] : [])] : [],
    passedChords: newPassed,
    currentTick: 1,
    currentFeedback: 'neutral',
    notesHitThisChord: new Set(),
    wrongNotePlayedThisChord: false,
    readyToAdvance: false,
  };
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // ── Settings ──────────────────────────────────────────────────────────────
    case 'SET_MIDI_ENABLED':
      return { ...state, settings: { ...state.settings, midiEnabled: action.payload } };

    case 'SET_MIDI_DEVICE':
      return { ...state, settings: { ...state.settings, selectedMidiDeviceId: action.payload } };

    case 'SET_METRONOME_ENABLED':
      return { ...state, settings: { ...state.settings, metronomeEnabled: action.payload } };

    case 'SET_BPM':
      return { ...state, settings: { ...state.settings, bpm: action.payload } };

    case 'SET_TICKS_PER_CHORD':
      return { ...state, settings: { ...state.settings, ticksPerChord: action.payload } };

    case 'SET_ALL_KEYS_ENABLED':
      return { ...state, settings: { ...state.settings, allKeysEnabled: action.payload } };

    case 'SET_SELECTED_KEYS':
      return { ...state, settings: { ...state.settings, selectedKeys: action.payload } };

    case 'SET_ALL_ROOTS_ENABLED':
      return { ...state, settings: { ...state.settings, allRootsEnabled: action.payload } };

    case 'SET_SELECTED_ROOTS':
      return { ...state, settings: { ...state.settings, selectedRoots: action.payload } };

    case 'SET_ALL_CHORD_TYPES_ENABLED':
      return { ...state, settings: { ...state.settings, allChordTypesEnabled: action.payload } };

    case 'SET_ALL_GROUPS_ENABLED':
      return { ...state, settings: { ...state.settings, allGroupsEnabled: action.payload } };

    case 'SET_SELECTED_CHORD_TYPES':
      return { ...state, settings: { ...state.settings, selectedChordTypes: action.payload } };

    case 'SET_ALL_EXTENSIONS_ENABLED':
      return { ...state, settings: { ...state.settings, allExtensionsEnabled: action.payload } };

    case 'SET_ALLOWED_EXTENSIONS':
      return { ...state, settings: { ...state.settings, allowedExtensions: action.payload } };

    case 'SET_CHORD_PREVIEW_ENABLED':
      return { ...state, settings: { ...state.settings, chordPreviewEnabled: action.payload } };

    case 'SET_NEXT_CHORD_PREVIEW_COUNT':
      return {
        ...state,
        settings: { ...state.settings, nextChordPreviewCount: action.payload },
      };

    // ── MIDI devices ──────────────────────────────────────────────────────────
    case 'SET_MIDI_DEVICES':
      return { ...state, midiDevices: action.payload };

    // ── NOTE_ON ───────────────────────────────────────────────────────────────
    // Updates notesHitThisChord. currentFeedback + wrongNotePlayedThisChord are
    // updated here once chordValidation.ts (evaluatePlay / isNoteWrong) exists.
    case 'NOTE_ON': {
      if (!state.practice.isRunning || state.practice.currentChord === null) return state;

      const { pitchClass } = action.payload;
      const newNotes = new Set(state.practice.notesHitThisChord).add(pitchClass);

      return {
        ...state,
        practice: { ...state.practice, notesHitThisChord: newNotes },
      };
    }

    // ── Practice lifecycle ────────────────────────────────────────────────────
    case 'INIT_CHORDS': {
      const { currentChord, nextChords } = action.payload;
      return {
        ...state,
        practice: {
          ...state.practice,
          currentChord,
          nextChords,
          currentTick: 0,
          currentFeedback: 'neutral',
          notesHitThisChord: new Set(),
          wrongNotePlayedThisChord: false,
          readyToAdvance: false,
        },
      };
    }

    case 'START_PRACTICE': {
      const { pool } = action.payload;
      if (pool.length === 0) return state;

      // Pick current + fill nextChords up to nextChordPreviewCount
      const pick = () => pool[Math.floor(Math.random() * pool.length)];
      const previewCount = state.settings.nextChordPreviewCount;

      const currentChord = pick();
      const nextChords = Array.from({ length: previewCount }, pick);

      return {
        ...state,
        practice: {
          ...DEFAULT_PRACTICE,
          isRunning: true,
          currentChord,
          nextChords,
        },
      };
    }

    case 'RESUME_PRACTICE':
      return { ...state, practice: { ...state.practice, isRunning: true } };

    case 'PAUSE_PRACTICE':
      return { ...state, practice: { ...state.practice, isRunning: false } };

    case 'ADVANCE_CHORD': {
      if (!state.practice.isRunning) return state;
      return {
        ...state,
        practice: advanceChord(state.practice, action.payload),
      };
    }

    case 'SKIP_CHORD': {
      const { newChord } = action.payload;
      const newPassed = state.practice.currentChord
        ? [
            { chord: state.practice.currentChord, feedback: 'skipped' as const },
            ...state.practice.passedChords,
          ].slice(0, MAX_PASSED_CHORDS)
        : state.practice.passedChords;

      const [next, ...rest] = state.practice.nextChords;

      return {
        ...state,
        practice: {
          ...state.practice,
          currentChord: next ?? newChord,
          nextChords: next !== undefined ? [...rest, ...(newChord ? [newChord] : [])] : [],
          passedChords: newPassed,
          currentTick: 0,
          currentFeedback: 'neutral',
          notesHitThisChord: new Set(),
          wrongNotePlayedThisChord: false,
          readyToAdvance: false,
        },
      };
    }

    case 'TICK': {
      if (!state.practice.isRunning) return state;
      return {
        ...state,
        practice: { ...state.practice, currentTick: state.practice.currentTick + 1 },
      };
    }

    default:
      return state;
  }
}
