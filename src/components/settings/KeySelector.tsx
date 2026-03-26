import { NoteSelector } from './NoteSelector';

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;

// 24 options: each note × major/minor
const KEY_OPTIONS: string[] = CHROMATIC.flatMap((note) => [
  `${note} major`,
  `${note} minor`,
]);

interface Props {
  selectedKeys: string[];
  keysFilterEnabled: boolean;
  onToggleKeysFilterEnabled: () => void;
  onToggle: (key: string) => void;
}

export function KeySelector({ selectedKeys, keysFilterEnabled, onToggleKeysFilterEnabled, onToggle }: Props) {
  return (
    <NoteSelector
      label="Limit Keys"
      options={KEY_OPTIONS}
      selected={selectedKeys}
      allEnabled={keysFilterEnabled}
      checkboxLabel="Enabled"
      sectionDisabled={!keysFilterEnabled}
      noHalfLit
      tooltip="Filters chords to only those that naturally belong to the selected keys."
      onToggleAll={onToggleKeysFilterEnabled}
      onToggle={onToggle}
    />
  );
}
