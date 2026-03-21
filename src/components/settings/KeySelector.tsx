import { NoteSelector } from './NoteSelector';

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;

// 24 options: each note × major/minor
const KEY_OPTIONS: string[] = CHROMATIC.flatMap((note) => [
  `${note} major`,
  `${note} minor`,
]);

interface Props {
  selectedKeys: string[];    // empty = "All" (no diatonic filter applied)
  // TODO: wire to dispatch SET_SELECTED_KEYS
  onToggleAll: () => void;
  onToggle: (key: string) => void;
}

export function KeySelector({ selectedKeys, onToggleAll, onToggle }: Props) {
  const allSelected = selectedKeys.length === 0;

  return (
    <NoteSelector
      label="Keys"
      options={KEY_OPTIONS}
      selected={selectedKeys}
      allSelected={allSelected}
      onToggleAll={onToggleAll}
      onToggle={onToggle}
    />
  );
}
