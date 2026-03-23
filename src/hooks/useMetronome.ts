import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { pickRandomChord } from '../logic/chordGeneration';
import tickSound from '../assets/metronome-tick.flac';

export function useMetronome() {
  const { state, dispatch, chordPool } = useApp();
  const { practice, settings } = state;

  const currentTickRef = useRef(practice.currentTick);
  const ticksPerChordRef = useRef(settings.ticksPerChord);
  const chordPoolRef = useRef(chordPool);
  const tickAudioRef = useRef(new Audio(tickSound));

  // Keep refs in sync
  currentTickRef.current = practice.currentTick;
  ticksPerChordRef.current = settings.ticksPerChord;
  chordPoolRef.current = chordPool;

  useEffect(() => {
    if (!practice.isRunning) return;

    const intervalMs = 60000 / settings.bpm;
    const id = setInterval(() => {
      tickAudioRef.current.currentTime = 0;
      tickAudioRef.current.play().catch(() => {});

      if (currentTickRef.current >= ticksPerChordRef.current) {
        dispatch({
          type: 'ADVANCE_CHORD',
          payload: { feedback: 'neutral', newChord: pickRandomChord(chordPoolRef.current) },
        });
      } else {
        dispatch({ type: 'TICK' });
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [practice.isRunning, settings.bpm]);
}
