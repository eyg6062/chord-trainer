import { MidiSettings } from './MidiSettings';
import { MetronomeSettings } from './MetronomeSettings';
import { KeySelector } from './KeySelector';
import { RootSelector } from './RootSelector';
import { ChordTypeSelector } from './ChordTypeSelector';
import { ExtensionSelector } from './ExtensionSelector';
import type { NoteClass, ChordTypeName, Extension } from '../../types/chord';
import type { MidiDevice } from '../../types/midi';

interface Props {
  // MIDI
  midiEnabled: boolean;
  midiDevices: MidiDevice[];
  selectedMidiDeviceId: string | null;
  // Metronome
  metronomeEnabled: boolean;
  bpm: number;
  ticksPerChord: number;
  nextChordPreviewCount: number;
  // Chord pool
  allKeysEnabled: boolean;
  selectedKeys: string[];
  allRootsEnabled: boolean;
  selectedRoots: NoteClass[];
  allChordTypesEnabled: boolean;
  allGroupsEnabled: Record<string, boolean>;
  selectedChordTypes: ChordTypeName[];
  allExtensionsEnabled: boolean;
  allowedExtensions: Extension[];
  // Handlers
  onMidiToggle: () => void;
  onMidiSelectDevice: (id: string) => void;
  onMidiRefresh: () => void;
  onMetronomeToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onTicksChange: (ticks: number) => void;
  onPreviewCountChange: (count: number) => void;
  onToggleAllKeys: () => void;
  onToggleKey: (key: string) => void;
  onToggleAllRoots: () => void;
  onToggleRoot: (root: NoteClass) => void;
  onToggleAllChordTypes: () => void;
  onToggleChordTypeGroup: (groupLabel: string) => void;
  onToggleChordType: (type: ChordTypeName) => void;
  onToggleAllExtensions: () => void;
  onToggleExtension: (ext: Extension) => void;
}

const box = 'border border-neutral-700 rounded-lg p-4';

export function SettingsPanel(props: Props) {
  return (
    <section className="border-t border-neutral-700 bg-neutral-900 p-6 space-y-4">
      <h2 className="text-base font-semibold text-neutral-200">Settings</h2>

      {/* Row 1: MIDI + Metronome */}
      <div className="flex flex-wrap gap-4">
        <div className={box}>
          <MidiSettings
            enabled={props.midiEnabled}
            devices={props.midiDevices}
            selectedDeviceId={props.selectedMidiDeviceId}
            onToggle={props.onMidiToggle}
            onSelectDevice={props.onMidiSelectDevice}
            onRefresh={props.onMidiRefresh}
          />
        </div>
        <div className={box}>
          <MetronomeSettings
            enabled={props.metronomeEnabled}
            bpm={props.bpm}
            ticksPerChord={props.ticksPerChord}
            nextChordPreviewCount={props.nextChordPreviewCount}
            onToggle={props.onMetronomeToggle}
            onBpmChange={props.onBpmChange}
            onTicksChange={props.onTicksChange}
            onPreviewCountChange={props.onPreviewCountChange}
          />
        </div>
      </div>

      {/* Row 2: Chord Types | (Roots + Keys + Extensions) */}
      <div className="flex gap-4 items-start">
        <div className={`${box} flex-1`}>
          <ChordTypeSelector
            selectedChordTypes={props.selectedChordTypes}
            allChordTypesEnabled={props.allChordTypesEnabled}
            allGroupsEnabled={props.allGroupsEnabled}
            onToggleAll={props.onToggleAllChordTypes}
            onToggleGroup={props.onToggleChordTypeGroup}
            onToggle={props.onToggleChordType}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className={box}>
            <RootSelector
              selectedRoots={props.selectedRoots}
              allRootsEnabled={props.allRootsEnabled}
              onToggleAll={props.onToggleAllRoots}
              onToggle={props.onToggleRoot}
            />
          </div>
          <div className={box}>
            <KeySelector
              selectedKeys={props.selectedKeys}
              allKeysEnabled={props.allKeysEnabled}
              onToggleAll={props.onToggleAllKeys}
              onToggle={props.onToggleKey}
            />
          </div>
          <div className={box}>
            <ExtensionSelector
              allowedExtensions={props.allowedExtensions}
              allExtensionsEnabled={props.allExtensionsEnabled}
              onToggleAll={props.onToggleAllExtensions}
              onToggle={props.onToggleExtension}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
