import type { NoteClass } from '../../types/chord';
import { NoteSelector } from './NoteSelector';

const ALL_ROOTS: NoteClass[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

interface Props {
  selectedRoots: NoteClass[];
  allRootsEnabled: boolean;
  onToggleAll: () => void;
  onToggle: (root: NoteClass) => void;
}

export function RootSelector({ selectedRoots, allRootsEnabled, onToggleAll, onToggle }: Props) {
  return (
    <NoteSelector
      label="Roots"
      options={ALL_ROOTS}
      selected={selectedRoots}
      allEnabled={allRootsEnabled}
      onToggleAll={onToggleAll}
      onToggle={(r) => onToggle(r as NoteClass)}
    />
  );
}
