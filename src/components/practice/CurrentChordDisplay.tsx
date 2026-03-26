import type { Chord, ChordFeedback } from '../../types/chord';

interface Props {
  chord: Chord | null;
  feedback: ChordFeedback;
  isPoolEmpty: boolean;
}

const feedbackColorClass: Record<ChordFeedback, string> = {
  neutral:             'text-white',
  correct:             'text-green-500',
  'correct-with-wrong':'text-yellow-400',
  wrong:               'text-red-500',
  skipped:             'text-neutral-400',
};

export function CurrentChordDisplay({ chord, feedback, isPoolEmpty }: Props) {
  return (
    <div className="flex items-center justify-center h-48">
      {chord ? (
        <div className={`flex items-baseline gap-3 transition-colors duration-150 ${feedbackColorClass[feedback]}`}>
          <span className="text-8xl font-bold tracking-tight">{chord.root}</span>
          <span className="text-8xl font-bold tracking-tight">{chord.chordType}</span>
          {chord.extensions.length > 0 && (
            <span className="flex gap-2 text-5xl font-bold self-start">
              {chord.extensions.map((ext, i) => (
                <span key={i}>{ext}</span>
              ))}
            </span>
          )}
        </div>
      ) : isPoolEmpty ? (
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-semibold text-neutral-300">No chords available</span>
          <span className="text-sm text-neutral-400">Adjust your chord selection settings</span>
        </div>
      ) : (
        <span className="text-4xl text-neutral-400">—</span>
      )}
    </div>
  );
}
