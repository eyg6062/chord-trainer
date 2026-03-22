import { useApp } from './context/AppContext';
import { CHROMATIC_NOTES } from './constants/notes';
import { CHORD_INTERVALS } from './constants/chordIntervals';
import { PracticeArea } from './components/practice/PracticeArea';
import { SettingsPanel } from './components/settings/SettingsPanel';
import type { NoteClass, ChordTypeName, Extension } from './types/chord';

const ALL_CHORD_TYPES = Object.keys(CHORD_INTERVALS) as ChordTypeName[];

function App() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  // ── Chord pool handlers ────────────────────────────────────────────────────

  function handleToggleAllKeys() {
    // Empty array = "All" (no key filter). Clicking All always clears the filter.
    dispatch({ type: 'SET_SELECTED_KEYS', payload: [] });
  }

  function handleToggleKey(key: string) {
    const next = settings.selectedKeys.includes(key)
      ? settings.selectedKeys.filter((k) => k !== key)
      : [...settings.selectedKeys, key];
    dispatch({ type: 'SET_SELECTED_KEYS', payload: next });
  }

  function handleToggleAllRoots() {
    const allSelected = settings.selectedRoots.length === CHROMATIC_NOTES.length;
    dispatch({
      type: 'SET_SELECTED_ROOTS',
      payload: allSelected ? [] : [...CHROMATIC_NOTES],
    });
  }

  function handleToggleRoot(root: NoteClass) {
    const next = settings.selectedRoots.includes(root)
      ? settings.selectedRoots.filter((r) => r !== root)
      : [...settings.selectedRoots, root];
    dispatch({ type: 'SET_SELECTED_ROOTS', payload: next });
  }

  function handleToggleAllChordTypes() {
    const allSelected = ALL_CHORD_TYPES.every((t) => settings.selectedChordTypes.includes(t));
    dispatch({
      type: 'SET_SELECTED_CHORD_TYPES',
      payload: allSelected ? [] : ALL_CHORD_TYPES,
    });
  }

  function handleToggleChordTypeGroup(types: ChordTypeName[]) {
    const allInGroup = types.every((t) => settings.selectedChordTypes.includes(t));
    const next = allInGroup
      ? settings.selectedChordTypes.filter((t) => !types.includes(t))
      : [...settings.selectedChordTypes, ...types.filter((t) => !settings.selectedChordTypes.includes(t))];
    dispatch({ type: 'SET_SELECTED_CHORD_TYPES', payload: next });
  }

  function handleToggleChordType(type: ChordTypeName) {
    const next = settings.selectedChordTypes.includes(type)
      ? settings.selectedChordTypes.filter((t) => t !== type)
      : [...settings.selectedChordTypes, type];
    dispatch({ type: 'SET_SELECTED_CHORD_TYPES', payload: next });
  }

  function handleToggleExtension(ext: Extension) {
    const next = settings.allowedExtensions.includes(ext)
      ? settings.allowedExtensions.filter((e) => e !== ext)
      : [...settings.allowedExtensions, ext];
    dispatch({ type: 'SET_ALLOWED_EXTENSIONS', payload: next });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      <header className="px-6 py-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Chord Trainer</h1>
      </header>

      <main className="flex-1">
        <PracticeArea />
      </main>

      <SettingsPanel
        // MIDI — TODO: wire when useMidi is implemented
        midiEnabled={settings.midiEnabled}
        midiDevices={state.midiDevices}
        selectedMidiDeviceId={settings.selectedMidiDeviceId}
        onMidiToggle={() => {}}
        onMidiSelectDevice={() => {}}
        onMidiRefresh={() => {}}
        // Metronome — TODO: wire when useMetronome is implemented
        metronomeEnabled={settings.metronomeEnabled}
        bpm={settings.bpm}
        ticksPerChord={settings.ticksPerChord}
        nextChordPreviewCount={settings.nextChordPreviewCount}
        onMetronomeToggle={() => {}}
        onBpmChange={() => {}}
        onTicksChange={() => {}}
        onPreviewCountChange={() => {}}
        // Chord pool
        selectedKeys={settings.selectedKeys}
        selectedRoots={settings.selectedRoots}
        selectedChordTypes={settings.selectedChordTypes}
        allowedExtensions={settings.allowedExtensions}
        onToggleAllKeys={handleToggleAllKeys}
        onToggleKey={handleToggleKey}
        onToggleAllRoots={handleToggleAllRoots}
        onToggleRoot={handleToggleRoot}
        onToggleAllChordTypes={handleToggleAllChordTypes}
        onToggleChordTypeGroup={handleToggleChordTypeGroup}
        onToggleChordType={handleToggleChordType}
        onToggleExtension={handleToggleExtension}
      />
    </div>
  );
}

export default App;
