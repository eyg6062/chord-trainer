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
  const { practice, settings } = state;

  // Regenerate the full queue whenever the chord pool changes (covers first load,
  // empty pool, and any setting change that affects which chords are valid).
  useEffect(() => {
    dispatch({
      type: 'INIT_CHORDS',
      payload: {
        currentChord: pickRandomChord(chordPool),
        nextChords: chordPool.length > 0
          ? Array.from({ length: settings.nextChordPreviewCount }, () => pickRandomChord(chordPool)!)
          : [],
      },
    });
  }, [chordPool]);

  // Grow the queue when the preview count increases (shrinking is handled
  // visually by NextChordPreview slicing to previewCount).
  useEffect(() => {
    if (practice.currentChord === null || chordPool.length === 0) return;
    const missing = settings.nextChordPreviewCount - practice.nextChords.length;
    if (missing > 0) {
      dispatch({
        type: 'INIT_CHORDS',
        payload: {
          currentChord: practice.currentChord,
          nextChords: [
            ...practice.nextChords,
            ...Array.from({ length: missing }, () => pickRandomChord(chordPool)!),
          ],
        },
      });
    }
  }, [settings.nextChordPreviewCount]);

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
          totalTicks={settings.ticksPerChord}
          currentTick={practice.currentTick}
          enabled={settings.metronomeEnabled}
        />

        <NextChordPreview
          chords={practice.nextChords}
          previewCount={settings.nextChordPreviewCount}
        />

        <PracticeControls
          isRunning={practice.isRunning}
          metronomeEnabled={settings.metronomeEnabled}
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
