import type { NoteClass } from '../../types/chord';
import { NoteSelector } from './NoteSelector';

const ALL_ROOTS: NoteClass[] = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

interface Props {
  selectedRoots: NoteClass[];
  // TODO: wire to dispatch SET_SELECTED_ROOTS
  onToggleAll: () => void;
  onToggle: (root: NoteClass) => void;
}

export function RootSelector({ selectedRoots, onToggleAll, onToggle }: Props) {
  const allSelected = selectedRoots.length === ALL_ROOTS.length;

  return (
    <NoteSelector
      label="Roots"
      options={ALL_ROOTS}
      selected={selectedRoots}
      allSelected={allSelected}
      onToggleAll={onToggleAll}
      onToggle={(r) => onToggle(r as NoteClass)}
    />
  );
}
