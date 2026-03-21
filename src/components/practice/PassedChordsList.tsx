import type { PassedChord, ChordFeedback } from '../../types/chord';

interface Props {
  passedChords: PassedChord[];
}

// TODO: reuse shared formatChordName util once extracted
function formatChordName(chord: PassedChord['chord']): string {
  return `${chord.root}${chord.chordType}${chord.extensions.join('')}`;
}

const feedbackBadgeClass: Record<ChordFeedback, string> = {
  neutral:              'bg-gray-700 text-gray-400',
  correct:              'bg-green-900 text-green-300',
  'correct-with-wrong': 'bg-yellow-900 text-yellow-300',
  wrong:                'bg-red-900 text-red-300',
  skipped:              'bg-gray-800 text-gray-500',
};

export function PassedChordsList({ passedChords }: Props) {
  // Display most recent first, cap at 15
  const visible = [...passedChords].reverse().slice(0, 15);

  return (
    <div className="flex flex-col gap-1 w-36 min-w-0">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
        History
      </h3>
      {visible.length === 0 && (
        <p className="text-xs text-gray-600">No chords yet</p>
      )}
      {visible.map((entry, i) => (
        <div
          key={i}
          className={`text-sm font-medium px-2 py-0.5 rounded ${feedbackBadgeClass[entry.feedback]}`}
        >
          {formatChordName(entry.chord)}
        </div>
      ))}
    </div>
  );
}
