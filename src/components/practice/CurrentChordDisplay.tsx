import type { Chord, ChordFeedback } from '../../types/chord';

interface Props {
  chord: Chord | null;
  feedback: ChordFeedback;
}

// TODO: format chord name with proper symbols (e.g. ♭, ♯, °, +)
function formatChordName(_chord: Chord): string {
  return `${_chord.root}${_chord.chordType}${_chord.extensions.join('')}`;
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
        <span
          className={`text-8xl font-bold tracking-tight transition-colors duration-150 ${feedbackColorClass[feedback]}`}
        >
          {formatChordName(chord)}
        </span>
      ) : (
        <span className="text-4x text-neutral-400">—</span>
      )}
    </div>
  );
}
