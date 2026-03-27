import type { Chord } from '../../types/chord';
import {
  NOTECLASS_TO_UI_STRING,
  CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING,
  EXTENSION_TO_UI_STRING,
} from '../../constants/uiMapping';

interface Props {
  chords: Chord[];         // the upcoming chord queue
  previewCount: number;    // how many to show (0–4)
}

export function NextChordPreview({ chords, previewCount }: Props) {
  if (previewCount === 0) return null;

  const visible = chords.slice(0, previewCount);

  return (
    <div className="flex justify-center items-center gap-4 py-2">
      <span className="text-xs text-neutral-600 uppercase tracking-wide mr-1">Next</span>
      {visible.map((chord, i) => (
        <div
          key={i}
          className={`flex items-baseline gap-1 font-semibold ${i === 0 ? 'text-neutral-400' : 'text-neutral-500'}`}
        >
          <span className="text-lg">{NOTECLASS_TO_UI_STRING[chord.root]}</span>
          <span className="text-lg">{CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING[chord.chordType]}</span>
          {chord.extensions.length > 0 && (
            <span className="flex gap-1 text-sm self-start">
              {chord.extensions.map((ext, j) => (
                <span key={j}>{EXTENSION_TO_UI_STRING[ext]}</span>
              ))}
            </span>
          )}
        </div>
      ))}
      {visible.length === 0 && (
        <span className="text-neutral-400 text-sm">—</span>
      )}
    </div>
  );
}
