import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { pickRandomChord } from '../../logic/chordGeneration';
import { useMetronome } from '../../hooks/useMetronome';
import { useAudio } from '../../hooks/useAudio';
import { CurrentChordDisplay } from './CurrentChordDisplay';
import { MetronomeDots } from './MetronomeDots';
import { NextChordPreview } from './NextChordPreview';
import { PassedChordsList } from './PassedChordsList';
import { PracticeControls } from './PracticeControls';

export function PracticeArea() {
  const { state, dispatch, chordPool } = useApp();
  const { practice, settings } = state;

  useMetronome();
  const { playChord } = useAudio();

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

  // Chord pool settings changed → pause + regenerate chords
  const prevChordPoolRef = useRef(chordPool);
  useEffect(() => {
    if (prevChordPoolRef.current === chordPool) return;
    prevChordPoolRef.current = chordPool;
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
  }, [chordPool]);

  // Preview count increased → grow the queue without touching the current chord
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

        {/* Group 1: fixed-height — elements center when some are hidden */}
        <div className="flex flex-col items-center justify-center w-full h-68">
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
            previewCount={settings.chordPreviewEnabled ? settings.nextChordPreviewCount : 0}
          />
        </div>

        {/* Group 2: practice controls */}
        <PracticeControls
          isRunning={practice.isRunning}
          metronomeEnabled={settings.metronomeEnabled}
          hasCurrentChord={chordPool.length > 0}
          onStart={handleStart}
          onPause={handlePause}
          onRestart={handleRestart}
          onNext={handleNext}
          onPlayChord={() => { if (practice.currentChord) playChord(practice.currentChord); }}
        />
      </div>
    </div>
  );
}
