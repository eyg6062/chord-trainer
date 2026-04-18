import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { pickRandomChord } from '../logic/chordGeneration';
import tickSoundUrl from '../assets/metronome-tick.flac';

const LOOKAHEAD_SEC = 0.1;   // how far ahead to schedule audio
const SCHEDULER_MS  = 25;    // how often to run the scheduler

export function useMetronome() {
  const { state, dispatch, chordPool } = useApp();
  const { practice, settings } = state;

  const currentTickRef    = useRef(practice.currentTick);
  const ticksPerChordRef  = useRef(settings.ticksPerChord);
  const chordPoolRef      = useRef(chordPool);
  const bpmRef            = useRef(settings.bpm);
  const currentFeedbackRef = useRef(practice.currentFeedback);

  currentTickRef.current    = practice.currentTick;
  ticksPerChordRef.current  = settings.ticksPerChord;
  chordPoolRef.current      = chordPool;
  bpmRef.current            = settings.bpm;
  currentFeedbackRef.current = practice.currentFeedback;

  const audioCtxRef   = useRef<AudioContext | null>(null);
  const tickBufferRef = useRef<AudioBuffer | null>(null);

  // Create AudioContext and load tick sound once on mount
  useEffect(() => {
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    fetch(tickSoundUrl)
      .then((r) => r.arrayBuffer())
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => { tickBufferRef.current = decoded; })
      .catch(() => {});

    return () => { ctx.close(); };
  }, []);

  useEffect(() => {
    if (!practice.isRunning) return;

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Browser autoplay policy: resume context after user interaction
    if (ctx.state === 'suspended') ctx.resume();

    let nextBeatTime = ctx.currentTime + 0.05; // small startup delay
    let cancelled    = false;

    const scheduleBeats = () => {
      const beatInterval = 60 / bpmRef.current;

      while (nextBeatTime < ctx.currentTime + LOOKAHEAD_SEC) {
        // Schedule audio precisely on the audio clock
        if (tickBufferRef.current) {
          const source = ctx.createBufferSource();
          source.buffer = tickBufferRef.current;
          source.connect(ctx.destination);
          source.start(nextBeatTime);
        }

        // Dispatch React state update to fire at approximately the same moment
        const delayMs = Math.max(0, (nextBeatTime - ctx.currentTime) * 1000);
        setTimeout(() => {
          if (cancelled) return;
          if (currentTickRef.current >= ticksPerChordRef.current) {
            dispatch({
              type: 'ADVANCE_CHORD',
              payload: { feedback: currentFeedbackRef.current, newChord: pickRandomChord(chordPoolRef.current) },
            });
          } else {
            dispatch({ type: 'TICK' });
          }
        }, delayMs);

        nextBeatTime += beatInterval;
      }
    };

    scheduleBeats();
    const id = setInterval(scheduleBeats, SCHEDULER_MS);

    return () => {
      clearInterval(id);
      cancelled = true;
    };
  }, [practice.isRunning]);
}
