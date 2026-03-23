import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { pickRandomChord } from '../../logic/chordGeneration';
import { CurrentChordDisplay } from './CurrentChordDisplay';
import { MetronomeDots } from './MetronomeDots';
import { NextChordPreview } from './NextChordPreview';
import { PassedChordsList } from './PassedChordsList';
import { PracticeControls } from './PracticeControls';

export function PracticeArea() {
  const { state, dispatch, chordPool } = useApp();
  const { practice } = state;

  // Auto-pick the first chord when the pool becomes available
  useEffect(() => {
    if (practice.currentChord === null && chordPool.length > 0) {
      dispatch({ type: 'SKIP_CHORD', payload: { newChord: pickRandomChord(chordPool) } });
    }
  }, [chordPool]);

  function handleNext() {
    dispatch({ type: 'SKIP_CHORD', payload: { newChord: pickRandomChord(chordPool) } });
  }

  return (
    <div className="flex gap-4 p-6">
      {/* Left column: chord history — TODO: pass real passedChords once history display is implemented */}
      <aside className="flex-none pt-2">
        <PassedChordsList passedChords={[]} />
      </aside>

      {/* Center column: main practice display */}
      <div className="flex-1 flex flex-col items-center">
        <CurrentChordDisplay
          chord={practice.currentChord}
          feedback={practice.currentFeedback}
        />

        <MetronomeDots
          totalTicks={state.settings.ticksPerChord}
          currentTick={practice.currentTick}
          enabled={state.settings.metronomeEnabled}
        />

        {/* TODO: pass real nextChords and previewCount once preview is implemented */}
        <NextChordPreview chords={[]} previewCount={0} />

        <PracticeControls
          isRunning={practice.isRunning}
          metronomeEnabled={state.settings.metronomeEnabled}
          hasCurrentChord={chordPool.length > 0}
          onStart={() => {/* TODO: wire when useMetronome is implemented */}}
          onPause={() => {/* TODO: wire when useMetronome is implemented */}}
          onNext={handleNext}
          onPlayChord={() => {/* TODO: wire when useAudio is implemented */}}
        />
      </div>
    </div>
  );
}
