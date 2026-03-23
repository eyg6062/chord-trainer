import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { pickRandomChord } from '../../logic/chordGeneration';
import { useMetronome } from '../../hooks/useMetronome';
import { CurrentChordDisplay } from './CurrentChordDisplay';
import { MetronomeDots } from './MetronomeDots';
import { NextChordPreview } from './NextChordPreview';
import { PassedChordsList } from './PassedChordsList';
import { PracticeControls } from './PracticeControls';

export function PracticeArea() {
  const { state, dispatch, chordPool } = useApp();
  const { practice, settings } = state;

  useMetronome();

  // Initial chord generation on mount only
  useEffect(() => {
    if (chordPool.length > 0) {
      dispatch({
        type: 'INIT_CHORDS',
        payload: {
          currentChord: pickRandomChord(chordPool),
          nextChords: Array.from({ length: settings.nextChordPreviewCount }, () => pickRandomChord(chordPool)!),
        },
      });
    }
  }, []);

  // Settings change → pause + regenerate chords
  const prevSettingsRef = useRef(state.settings);
  useEffect(() => {
    if (prevSettingsRef.current === state.settings) return;
    prevSettingsRef.current = state.settings;
    dispatch({ type: 'PAUSE_PRACTICE' });
    dispatch({
      type: 'INIT_CHORDS',
      payload: {
        currentChord: chordPool.length > 0 ? pickRandomChord(chordPool) : null,
        nextChords: chordPool.length > 0
          ? Array.from({ length: settings.nextChordPreviewCount }, () => pickRandomChord(chordPool)!)
          : [],
      },
    });
  }, [state.settings]);

  function handleStart() {
    dispatch({ type: 'RESUME_PRACTICE' });
  }

  function handlePause() {
    dispatch({ type: 'PAUSE_PRACTICE' });
  }

  function handleRestart() {
    dispatch({ type: 'PAUSE_PRACTICE' });
    dispatch({
      type: 'INIT_CHORDS',
      payload: {
        currentChord: chordPool.length > 0 ? pickRandomChord(chordPool) : null,
        nextChords: chordPool.length > 0
          ? Array.from({ length: settings.nextChordPreviewCount }, () => pickRandomChord(chordPool)!)
          : [],
      },
    });
  }

  function handleNext() {
    dispatch({ type: 'SKIP_CHORD', payload: { newChord: pickRandomChord(chordPool) } });
  }

  return (
    <div className="flex gap-4 p-6">
      {/* Left column: chord history */}
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
          onStart={handleStart}
          onPause={handlePause}
          onRestart={handleRestart}
          onNext={handleNext}
          onPlayChord={() => {/* TODO: wire when useAudio is implemented */}}
        />
      </div>
    </div>
  );
}
