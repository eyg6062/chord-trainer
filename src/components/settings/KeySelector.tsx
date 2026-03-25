import { NoteSelector } from './NoteSelector';

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;

// 24 options: each note × major/minor
const KEY_OPTIONS: string[] = CHROMATIC.flatMap((note) => [
  `${note} major`,
  `${note} minor`,
]);

interface Props {
  selectedKeys: string[];
  allKeysEnabled: boolean;
  onToggleAll: () => void;
  onToggle: (key: string) => void;
}

export function KeySelector({ selectedKeys, allKeysEnabled, onToggleAll, onToggle }: Props) {
  return (
    <NoteSelector
      label="Limit Keys"
      options={KEY_OPTIONS}
      selected={selectedKeys}
      allEnabled={allKeysEnabled}
      tooltip="Filters chords to only those that naturally belong to the selected keys."
      onToggleAll={onToggleAll}
      onToggle={onToggle}
    />
  );
}
