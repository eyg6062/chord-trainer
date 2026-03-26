import type { Chord, ChordFeedback } from '../../types/chord';

interface Props {
  chord: Chord | null;
  feedback: ChordFeedback;
}

const feedbackColorClass: Record<ChordFeedback, string> = {
  neutral:             'text-white',
  correct:             'text-green-500',
  'correct-with-wrong':'text-yellow-400',
  wrong:               'text-red-500',
  skipped:             'text-neutral-400',
};

export function CurrentChordDisplay({ chord, feedback }: Props) {
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
      ) : (
        <span className="text-4xl text-neutral-400">—</span>
      )}
    </div>
  );
}
