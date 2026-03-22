import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { AppState, Action, Settings } from '../types/state';
import type { Chord } from '../types/chord';
import { reducer, INITIAL_STATE, DEFAULT_SETTINGS } from './reducer';
import { buildChordPool } from '../logic/chordGeneration';
import { CHROMATIC_NOTES } from '../constants/notes';
import { CHORD_GROUPS, ALL_CHORD_TYPES } from '../components/settings/ChordTypeSelector';
import { ALL_EXTENSION_VALUES } from '../components/settings/ExtensionSelector';

// ── localStorage ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'chord-trainer-settings';

function loadSettings(): Partial<Settings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<Settings>) : {};
  } catch {
    return {};
  }
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable — ignore
  }
}

function buildInitialState(): AppState {
  const saved = loadSettings();
  return {
    ...INITIAL_STATE,
    settings: { ...DEFAULT_SETTINGS, ...saved },
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  chordPool: Chord[];
}

const AppContext = createContext<AppContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  // Persist settings whenever they change
  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  // Chord pool: recomputed when any pool-relevant setting changes
  const chordPool = useMemo(() => {
    const s = state.settings;

    const effectiveRoots = s.allRootsEnabled ? CHROMATIC_NOTES : s.selectedRoots;
    const effectiveKeys  = s.allKeysEnabled  ? []              : s.selectedKeys;
    const effectiveChordTypes = s.allChordTypesEnabled
      ? ALL_CHORD_TYPES
      : [...new Set([
          ...s.selectedChordTypes,
          ...CHORD_GROUPS.flatMap((g) => s.allGroupsEnabled[g.label] ? g.types : []),
        ])];
    const effectiveExtensions = s.allExtensionsEnabled ? ALL_EXTENSION_VALUES : s.allowedExtensions;

    return buildChordPool({
      selectedRoots: effectiveRoots,
      selectedChordTypes: effectiveChordTypes,
      allowedExtensions: effectiveExtensions,
      selectedKeys: effectiveKeys,
    });
  }, [
    state.settings.allRootsEnabled,
    state.settings.selectedRoots,
    state.settings.allKeysEnabled,
    state.settings.selectedKeys,
    state.settings.allChordTypesEnabled,
    state.settings.allGroupsEnabled,
    state.settings.selectedChordTypes,
    state.settings.allExtensionsEnabled,
    state.settings.allowedExtensions,
  ]);

  const value = useMemo(() => ({ state, dispatch, chordPool }), [state, chordPool]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
