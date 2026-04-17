import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import type { Chord } from '../types/chord';
import { CHORD_INTERVALS } from '../constants/chordIntervals';
import { EXTENSION_REPLACES_DEGREE } from '../constants/extensions';
import { CHROMATIC_NOTES, NOTE_TO_SEMITONE } from '../constants/notes';
import { intervalToSemitone, getIntervalDegree } from '../logic/intervalUtils';

// True semitone offsets for extended intervals — intervalToSemitone maps these
// mod 12 (correct for pitch-class validation), but audio needs the real distance.
const INTERVAL_TRUE_SEMITONE: Record<string, number> = {
  'b9': 13, '9': 14, '#9': 15,
  '11': 17, '#11': 18,
  'b13': 20, '13': 21,
};

const ROOT_OCTAVE = 3;

function chordToNotes(chord: Chord): string[] {
  let intervals = [...CHORD_INTERVALS[chord.chordType]];

  for (const ext of chord.extensions) {
    const targetDegree = EXTENSION_REPLACES_DEGREE[ext];
    intervals = intervals.filter((iv) => getIntervalDegree(iv) !== targetDegree);
    intervals.push(ext);
  }

  intervals.sort((a, b) =>
    (INTERVAL_TRUE_SEMITONE[a] ?? intervalToSemitone(a)) -
    (INTERVAL_TRUE_SEMITONE[b] ?? intervalToSemitone(b))
  );

  const rootSemitone = NOTE_TO_SEMITONE[chord.root];
  return intervals.map((iv) => {
    const abs = rootSemitone + (INTERVAL_TRUE_SEMITONE[iv] ?? intervalToSemitone(iv));
    return `${CHROMATIC_NOTES[abs % 12]}${ROOT_OCTAVE + Math.floor(abs / 12)}`;
  });
}

export function useAudio() {
  const samplerRef = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3',   C1: 'C1.mp3',   'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',   C2: 'C2.mp3',   'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',   C3: 'C3.mp3',   'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',   C4: 'C4.mp3',   'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',   C5: 'C5.mp3',   'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',   C6: 'C6.mp3',   'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',   C7: 'C7.mp3',   'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',   C8: 'C8.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      release: 1,
    }).toDestination();

    samplerRef.current = sampler;
    return () => { sampler.dispose(); };
  }, []);

  function playChord(chord: Chord) {
    const sampler = samplerRef.current;
    if (!sampler?.loaded) return;
    sampler.releaseAll();
    const notes = chordToNotes(chord);
    const now = Tone.now();
    notes.forEach((note, i) => {
      sampler.triggerAttackRelease(note, '2n', now + i * 0.064);
    });
  }

  return { playChord };
}
