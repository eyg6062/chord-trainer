import type { Chord, ChordFeedback } from '../../types/chord';
import {
  NOTECLASS_TO_UI_STRING,
  CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING,
  EXTENSION_TO_UI_STRING,
} from '../../constants/uiMapping';

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
          <span className="text-8xl font-bold tracking-tight">{NOTECLASS_TO_UI_STRING[chord.root]}</span>
          <span className="text-8xl font-bold tracking-tight">{CHORDTYPENAME_TO_DISPLAY_CHORD_UI_STRING[chord.chordType]}</span>
          {chord.extensions.length > 0 && (
            <span className="flex gap-2 text-5xl font-bold self-start">
              {chord.extensions.map((ext, i) => (
                <span key={i}>{EXTENSION_TO_UI_STRING[ext]}</span>
              ))}
            </span>
          )}
        </div>
      ) : isPoolEmpty ? (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
              <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
              <circle cx="12" cy="17" r=".5" fill="currentColor" />
            </svg>
            <span className="text-2xl font-semibold text-neutral-300">No chords available</span>
          </div>
          <span className="text-sm text-neutral-400">(No chords can be selected from, adjust settings to widen the chord selection)</span>
        </div>
      ) : (
        <span className="text-4xl text-neutral-400">—</span>
      )}
    </div>
  );
}
