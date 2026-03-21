import { PracticeArea } from './components/practice/PracticeArea';
import { SettingsPanel } from './components/settings/SettingsPanel';
import type { NoteClass, ChordTypeName, Extension } from './types/chord';

// TODO: replace placeholder state with AppContext (useApp()) once reducer is wired
// Placeholder settings state for layout demonstration
const PLACEHOLDER_SETTINGS = {
  midiEnabled: false,
  midiDevices: [],
  selectedMidiDeviceId: null,
  metronomeEnabled: true,
  bpm: 80,
  ticksPerChord: 4,
  nextChordPreviewCount: 2,
  selectedKeys: [] as string[],
  selectedRoots: ['C','D','E','F','G','A','B'] as NoteClass[],
  selectedChordTypes: ['Major', 'minor'] as ChordTypeName[],
  allowedExtensions: [] as Extension[],
};

function App() {
  // TODO: const { state, dispatch } = useApp();

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* App header */}
      <header className="px-6 py-4 border-b border-neutral-700">
        <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Chord Trainer</h1>
      </header>

      {/* Practice area — top section */}
      <main className="flex-1">
        <PracticeArea />
      </main>

      {/* Settings panel — always visible below */}
      <SettingsPanel
        {...PLACEHOLDER_SETTINGS}
        // All handlers are no-ops until dispatch is wired
        onMidiToggle={() => {}}
        onMidiSelectDevice={() => {}}
        onMidiRefresh={() => {}}
        onMetronomeToggle={() => {}}
        onBpmChange={() => {}}
        onTicksChange={() => {}}
        onPreviewCountChange={() => {}}
        onToggleAllKeys={() => {}}
        onToggleKey={() => {}}
        onToggleAllRoots={() => {}}
        onToggleRoot={() => {}}
        onToggleAllChordTypes={() => {}}
        onToggleChordTypeGroup={() => {}}
        onToggleChordType={() => {}}
        onToggleExtension={() => {}}
      />
    </div>
  );
}

export default App;
