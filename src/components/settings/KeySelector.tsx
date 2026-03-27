import { NoteSelector } from './NoteSelector';
import { NOTECLASS_TO_UI_STRING } from '../../constants/uiMapping';
import type { NoteClass } from '../../types/chord';

const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const;

// 24 options: each note × major/minor
const KEY_OPTIONS: string[] = CHROMATIC.flatMap((note) => [
  `${note} major`,
  `${note} minor`,
]);

const KEY_DISPLAY_MAP: Record<string, string> = Object.fromEntries(
  KEY_OPTIONS.map((key) => {
    const [note, quality] = key.split(' ');
    return [key, `${NOTECLASS_TO_UI_STRING[note as NoteClass]} ${quality}`];
  })
);

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
      displayMap={KEY_DISPLAY_MAP}
      checkboxLabel="Enabled"
      sectionDisabled={!keysFilterEnabled}
      noHalfLit
      tooltip="Filters chords to only those that naturally belong to the selected keys."
      onToggleAll={onToggleKeysFilterEnabled}
      onToggle={onToggle}
    />
  );
}
