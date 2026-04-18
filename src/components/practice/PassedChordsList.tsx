import type { PassedChord, ChordFeedback } from '../../types/chord';
import {
  NOTECLASS_TO_UI_STRING,
  CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING,
  EXTENSION_TO_UI_STRING,
} from '../../constants/uiMapping';

interface Props {
  passedChords: PassedChord[];
  onClear: () => void;
}

const feedbackColorClass: Record<ChordFeedback, string> = {
  neutral:              'text-white',
  correct:              'text-green-500',
  'correct-with-wrong': 'text-yellow-400',
  wrong:                'text-red-500',
  skipped:              'text-neutral-400',
};

export function PassedChordsList({ passedChords, onClear }: Props) {
  return (
    <div className="flex flex-col gap-2 w-52 h-full">
      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
        History
      </h3>

      {/* Chord box */}
      <div className="scrollbar-dark flex-1 min-h-0 overflow-y-auto flex flex-wrap content-start gap-x-3 gap-y-1">
        {passedChords.length === 0 ? (
          <span className="text-xs text-neutral-600">No chords yet</span>
        ) : (
          passedChords.map((entry, i) => (
            <div
              key={i}
              className={`flex items-baseline gap-0.5 font-semibold ${feedbackColorClass[entry.feedback]}`}
            >
              <span className="text-sm">{NOTECLASS_TO_UI_STRING[entry.chord.root]}</span>
              <span className="text-sm">{CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING[entry.chord.chordType]}</span>
              {entry.chord.extensions.length > 0 && (
                <span className="flex gap-0.5 text-xs self-start">
                  {entry.chord.extensions.map((ext, j) => (
                    <span key={j}>{EXTENSION_TO_UI_STRING[ext]}</span>
                  ))}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Clear button */}
      {passedChords.length > 0 && (
        <button
          onClick={onClear}
          className="self-start text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
}
