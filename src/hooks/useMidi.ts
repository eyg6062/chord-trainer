import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { pickRandomChord } from '../logic/chordGeneration';
import type { MidiDevice } from '../types/midi';

export function useMidi(): { refreshDevices: () => void } {
  const { state, dispatch, chordPool } = useApp();
  const { practice, settings } = state;

  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);

  // Keep a ref to the latest feedback so the auto-advance timeout captures it correctly
  const currentFeedbackRef = useRef(practice.currentFeedback);
  currentFeedbackRef.current = practice.currentFeedback;

  const chordPoolRef = useRef(chordPool);
  chordPoolRef.current = chordPool;

  const selectedDeviceIdRef = useRef(settings.selectedMidiDeviceId);
  selectedDeviceIdRef.current = settings.selectedMidiDeviceId;

  // ── Request MIDI access on mount ───────────────────────────────────────────
  useEffect(() => {
    if (!navigator.requestMIDIAccess) return;

    navigator.requestMIDIAccess().then((access) => {
      setMidiAccess(access);
      syncDeviceList(access);
      access.onstatechange = () => syncDeviceList(access);
    }).catch(() => {});
  }, []);

  // ── Sync device list to state ──────────────────────────────────────────────
  function syncDeviceList(access: MIDIAccess) {
    const devices: MidiDevice[] = [];
    access.inputs.forEach((input) => {
      devices.push({
        id: input.id,
        name: input.name ?? input.id,
        connected: input.state === 'connected',
      });
    });
    dispatch({ type: 'SET_MIDI_DEVICES', payload: devices });

    if (!selectedDeviceIdRef.current && devices.length > 0) {
      dispatch({ type: 'SET_MIDI_DEVICE', payload: devices[0].id });
    }
  }

  // ── Wire MIDI message listener ─────────────────────────────────────────────
  useEffect(() => {
    if (!midiAccess) return;

    // Clear any existing listeners on all inputs
    midiAccess.inputs.forEach((input) => { input.onmidimessage = null; });

    if (!settings.midiEnabled || !settings.selectedMidiDeviceId) return;

    const input = midiAccess.inputs.get(settings.selectedMidiDeviceId);
    if (!input || input.state !== 'connected') return;

    input.onmidimessage = (event: MIDIMessageEvent) => {
      if (!event.data) return;
      const [status, note, velocity] = Array.from(event.data);
      const isNoteOn = (status & 0xF0) === 0x90 && velocity > 0;
      if (isNoteOn) {
        dispatch({ type: 'NOTE_ON', payload: { pitchClass: note % 12 } });
      }
    };

    return () => { input.onmidimessage = null; };
  }, [midiAccess, settings.midiEnabled, settings.selectedMidiDeviceId]);

  // ── Auto-advance when chord is complete (metronome off only) ───────────────
  useEffect(() => {
    if (
      !practice.readyToAdvance ||
      !settings.midiEnabled ||
      settings.metronomeEnabled
    ) return;

    const timer = setTimeout(() => {
      dispatch({
        type: 'ADVANCE_CHORD',
        payload: {
          feedback: currentFeedbackRef.current,
          newChord: pickRandomChord(chordPoolRef.current),
        },
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [practice.readyToAdvance]);

  function refreshDevices() {
    if (midiAccess) syncDeviceList(midiAccess);
  }

  return { refreshDevices };
}
