import { useApp } from './context/AppContext';
import { CHORD_GROUPS } from './components/settings/ChordTypeSelector';
import { PracticeArea } from './components/practice/PracticeArea';
import { SettingsPanel } from './components/settings/SettingsPanel';
import type { NoteClass, ChordTypeName, Extension } from './types/chord';

function App() {
  const { state, dispatch } = useApp();
  const { settings } = state;

  // ── Keys ──────────────────────────────────────────────────────────────────

  function handleToggleAllKeys() {
    dispatch({ type: 'SET_ALL_KEYS_ENABLED', payload: !settings.allKeysEnabled });
  }

  function handleToggleKey(key: string) {
    if (settings.allKeysEnabled) {
      dispatch({ type: 'SET_ALL_KEYS_ENABLED', payload: false });
    }
    const next = settings.selectedKeys.includes(key)
      ? settings.selectedKeys.filter((k) => k !== key)
      : [...settings.selectedKeys, key];
    dispatch({ type: 'SET_SELECTED_KEYS', payload: next });
  }

  // ── Roots ─────────────────────────────────────────────────────────────────

  function handleToggleAllRoots() {
    dispatch({ type: 'SET_ALL_ROOTS_ENABLED', payload: !settings.allRootsEnabled });
  }

  function handleToggleRoot(root: NoteClass) {
    if (settings.allRootsEnabled) {
      dispatch({ type: 'SET_ALL_ROOTS_ENABLED', payload: false });
    }
    const next = settings.selectedRoots.includes(root)
      ? settings.selectedRoots.filter((r) => r !== root)
      : [...settings.selectedRoots, root];
    dispatch({ type: 'SET_SELECTED_ROOTS', payload: next });
  }

  // ── Chord types ───────────────────────────────────────────────────────────

  function handleToggleAllChordTypes() {
    dispatch({ type: 'SET_ALL_CHORD_TYPES_ENABLED', payload: !settings.allChordTypesEnabled });
  }

  function handleToggleChordTypeGroup(groupLabel: string) {
    dispatch({
      type: 'SET_ALL_GROUPS_ENABLED',
      payload: {
        ...settings.allGroupsEnabled,
        [groupLabel]: !settings.allGroupsEnabled[groupLabel],
      },
    });
  }

  function handleToggleChordType(type: ChordTypeName) {
    // Determine which All flags cover this type and turn them off
    const group = CHORD_GROUPS.find((g) => g.types.includes(type));
    const topAllCovers = settings.allChordTypesEnabled;
    const groupAllCovers = group ? (settings.allGroupsEnabled[group.label] ?? false) : false;

    if (topAllCovers) {
      dispatch({ type: 'SET_ALL_CHORD_TYPES_ENABLED', payload: false });
    }
    if (groupAllCovers && group) {
      dispatch({
        type: 'SET_ALL_GROUPS_ENABLED',
        payload: { ...settings.allGroupsEnabled, [group.label]: false },
      });
    }

    const next = settings.selectedChordTypes.includes(type)
      ? settings.selectedChordTypes.filter((t) => t !== type)
      : [...settings.selectedChordTypes, type];
    dispatch({ type: 'SET_SELECTED_CHORD_TYPES', payload: next });
  }

  // ── Extensions ────────────────────────────────────────────────────────────

  function handleToggleAllExtensions() {
    dispatch({ type: 'SET_ALL_EXTENSIONS_ENABLED', payload: !settings.allExtensionsEnabled });
  }

  function handleToggleExtension(ext: Extension) {
    if (settings.allExtensionsEnabled) {
      dispatch({ type: 'SET_ALL_EXTENSIONS_ENABLED', payload: false });
    }
    const next = settings.allowedExtensions.includes(ext)
      ? settings.allowedExtensions.filter((e) => e !== ext)
      : [...settings.allowedExtensions, ext];
    dispatch({ type: 'SET_ALLOWED_EXTENSIONS', payload: next });
  }

  // ── Render ────────────────────────────────────────────────────────────────

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
        onMetronomeToggle={() => dispatch({ type: 'SET_METRONOME_ENABLED', payload: !settings.metronomeEnabled })}
        onBpmChange={(bpm) => dispatch({ type: 'SET_BPM', payload: bpm })}
        onTicksChange={(ticks) => dispatch({ type: 'SET_TICKS_PER_CHORD', payload: ticks })}
        onPreviewCountChange={(count) => dispatch({ type: 'SET_NEXT_CHORD_PREVIEW_COUNT', payload: count })}
        // Chord pool
        allKeysEnabled={settings.allKeysEnabled}
        selectedKeys={settings.selectedKeys}
        allRootsEnabled={settings.allRootsEnabled}
        selectedRoots={settings.selectedRoots}
        allChordTypesEnabled={settings.allChordTypesEnabled}
        allGroupsEnabled={settings.allGroupsEnabled}
        selectedChordTypes={settings.selectedChordTypes}
        allExtensionsEnabled={settings.allExtensionsEnabled}
        allowedExtensions={settings.allowedExtensions}
        onToggleAllKeys={handleToggleAllKeys}
        onToggleKey={handleToggleKey}
        onToggleAllRoots={handleToggleAllRoots}
        onToggleRoot={handleToggleRoot}
        onToggleAllChordTypes={handleToggleAllChordTypes}
        onToggleChordTypeGroup={handleToggleChordTypeGroup}
        onToggleChordType={handleToggleChordType}
        onToggleAllExtensions={handleToggleAllExtensions}
        onToggleExtension={handleToggleExtension}
      />
    </div>
  );
}

export default App;
