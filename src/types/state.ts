import type{ Chord, ChordFeedback, ChordTypeName, Extension, NoteClass, PassedChord } from './chord';
import type { MidiDevice } from './midi';

export interface Settings {
  // MIDI
  midiEnabled: boolean;
  selectedMidiDeviceId: string | null;

  // Metronome
  metronomeEnabled: boolean;
  bpm: number;
  ticksPerChord: number;

  // Chord pool config
  allKeysEnabled: boolean;
  selectedKeys: string[];         // e.g. ["C major", "A minor"]
  allRootsEnabled: boolean;
  selectedRoots: NoteClass[];
  allChordTypesEnabled: boolean;
  allGroupsEnabled: Record<string, boolean>;  // keyed by group label e.g. "Triads"
  selectedChordTypes: ChordTypeName[];
  allExtensionsEnabled: boolean;
  allowedExtensions: Extension[];

  // Preview
  chordPreviewEnabled: boolean;
  nextChordPreviewCount: number;  // 1–4
}

export interface PracticeState {
  isRunning: boolean;
  currentChord: Chord | null;
  nextChords: Chord[];
  passedChords: PassedChord[];
  currentTick: number;
  currentFeedback: ChordFeedback;
  notesHitThisChord: Set<number>;     // pitch classes 0–11; not persisted
  wrongNotePlayedThisChord: boolean;
  readyToAdvance: boolean;
}

export interface AppState {
  settings: Settings;
  practice: PracticeState;
  midiDevices: MidiDevice[];
}

export type Action =
  // Settings
  | { type: 'SET_MIDI_ENABLED'; payload: boolean }
  | { type: 'SET_MIDI_DEVICE'; payload: string | null }
  | { type: 'SET_METRONOME_ENABLED'; payload: boolean }
  | { type: 'SET_BPM'; payload: number }
  | { type: 'SET_TICKS_PER_CHORD'; payload: number }
  | { type: 'SET_ALL_KEYS_ENABLED'; payload: boolean }
  | { type: 'SET_SELECTED_KEYS'; payload: string[] }
  | { type: 'SET_ALL_ROOTS_ENABLED'; payload: boolean }
  | { type: 'SET_SELECTED_ROOTS'; payload: NoteClass[] }
  | { type: 'SET_ALL_CHORD_TYPES_ENABLED'; payload: boolean }
  | { type: 'SET_ALL_GROUPS_ENABLED'; payload: Record<string, boolean> }
  | { type: 'SET_SELECTED_CHORD_TYPES'; payload: ChordTypeName[] }
  | { type: 'SET_ALL_EXTENSIONS_ENABLED'; payload: boolean }
  | { type: 'SET_ALLOWED_EXTENSIONS'; payload: Extension[] }
  | { type: 'SET_CHORD_PREVIEW_ENABLED'; payload: boolean }
  | { type: 'SET_NEXT_CHORD_PREVIEW_COUNT'; payload: number }
  // MIDI devices
  | { type: 'SET_MIDI_DEVICES'; payload: MidiDevice[] }
  | { type: 'NOTE_ON'; payload: { pitchClass: number } }
  // Practice lifecycle
  | { type: 'INIT_CHORDS'; payload: { currentChord: Chord | null; nextChords: Chord[] } }
  | { type: 'START_PRACTICE'; payload: { pool: Chord[] } }
  | { type: 'RESUME_PRACTICE' }
  | { type: 'PAUSE_PRACTICE' }
  | { type: 'ADVANCE_CHORD'; payload: { feedback: ChordFeedback; newChord: Chord | null } }
  | { type: 'SKIP_CHORD'; payload: { newChord: Chord | null } }
  | { type: 'TICK' };
