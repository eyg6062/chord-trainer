import type { Chord } from '../../types/chord';

interface Props {
  chords: Chord[];         // the upcoming chord queue
  previewCount: number;    // how many to show (0–4)
}

// TODO: reuse shared formatChordName util once extracted
function formatChordName(chord: Chord): string {
  return `${chord.root}${chord.chordType}${chord.extensions.join('')}`;
}

export function NextChordPreview({ chords, previewCount }: Props) {
  if (previewCount === 0) return null;

  const visible = chords.slice(0, previewCount);

  return (
    <div className="flex justify-center items-center gap-4 py-2">
      <span className="text-xs text-neutral-600 uppercase tracking-wide mr-1">Next</span>
      {visible.map((chord, i) => (
        <span
          key={i}
          className={`text-lg font-semibold ${i === 0 ? 'text-neutral-400' : 'text-neutral-500'}`}
          style={{  }}
        >
          {formatChordName(chord)}
        </span>
      ))}
      {visible.length === 0 && (
        <span className="text-neutral-400 text-sm">—</span>
      )}
    </div>
  );
}
