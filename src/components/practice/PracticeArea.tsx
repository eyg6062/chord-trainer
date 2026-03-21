import { CurrentChordDisplay } from './CurrentChordDisplay';
import { MetronomeDots } from './MetronomeDots';
import { NextChordPreview } from './NextChordPreview';
import { PassedChordsList } from './PassedChordsList';
import { PracticeControls } from './PracticeControls';

// TODO: replace with useApp() once AppContext is wired up
// Placeholder props for skeleton demonstration
interface Props {
  // Provided by AppContext / hooks in the real implementation
}

export function PracticeArea(_props: Props) {
  // TODO: const { state, dispatch } = useApp();
  // TODO: const { playChord } = useAudio();
  // TODO: useMidi();
  // TODO: useMetronome();

  // Placeholder state for layout preview
  const placeholderChord = { root: 'D' as const, chordType: 'm7' as const, extensions: [] };
  const placeholderNext = [
    { root: 'G' as const, chordType: '7' as const, extensions: [] },
    { root: 'C' as const, chordType: 'Major' as const, extensions: [] },
  ];

  return (
    <div className="flex gap-4 p-6">
      {/* Left column: chord history */}
      <aside className="flex-none pt-2">
        <PassedChordsList
          passedChords={[
            { chord: { root: 'A', chordType: 'minor', extensions: [] }, feedback: 'correct' },
            { chord: { root: 'E', chordType: 'm7b5', extensions: [] }, feedback: 'wrong' },
            { chord: { root: 'F', chordType: 'Major', extensions: [] }, feedback: 'correct-with-wrong' },
          ]}
        />
      </aside>

      {/* Center column: main practice display */}
      <div className="flex-1 flex flex-col items-center">
        <CurrentChordDisplay
          chord={placeholderChord}
          feedback="neutral"
        />

        <MetronomeDots
          totalTicks={4}
          currentTick={2}
          enabled={true}
        />

        <NextChordPreview
          chords={placeholderNext}
          previewCount={2}
        />

        <PracticeControls
          isRunning={false}
          metronomeEnabled={true}
          hasCurrentChord={true}
          onStart={() => {/* TODO */}}
          onPause={() => {/* TODO */}}
          onNext={() => {/* TODO */}}
          onPlayChord={() => {/* TODO */}}
        />
      </div>
    </div>
  );
}
