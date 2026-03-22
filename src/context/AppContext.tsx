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

  // Chord pool: recomputed only when the four pool-relevant settings change
  const chordPool = useMemo(
    () =>
      buildChordPool({
        selectedRoots: state.settings.selectedRoots,
        selectedChordTypes: state.settings.selectedChordTypes,
        allowedExtensions: state.settings.allowedExtensions,
        selectedKeys: state.settings.selectedKeys,
      }),
    [
      state.settings.selectedRoots,
      state.settings.selectedChordTypes,
      state.settings.allowedExtensions,
      state.settings.selectedKeys,
    ],
  );

  const value = useMemo(() => ({ state, dispatch, chordPool }), [state, chordPool]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
