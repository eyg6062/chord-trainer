interface Props {
  isRunning: boolean;
  metronomeEnabled: boolean;
  hasCurrentChord: boolean;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
  onNext: () => void;
  onPlayChord: () => void;
}

export function PracticeControls({
  isRunning,
  metronomeEnabled,
  hasCurrentChord,
  onStart,
  onPause,
  onRestart,
  onNext,
  onPlayChord,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {/* Start / Pause — only meaningful when metronome is on */}
      {isRunning ? (
        <button
          onClick={onPause}
          disabled={!metronomeEnabled}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium
                     hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={!metronomeEnabled}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium
                     hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          Start
        </button>
      )}

      {/* Restart — always enabled */}
      <button
        onClick={onRestart}
        className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 font-medium
                   hover:bg-neutral-600 transition-colors"
      >
        Restart
      </button>

      {/* Next — always available when there's a chord */}
      <button
        onClick={onNext}
        disabled={!hasCurrentChord}
        className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 font-medium
                   hover:bg-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors"
      >
        Next
      </button>

      {/* Play Chord — plays audio of the current chord */}
      <button
        onClick={onPlayChord}
        disabled={!hasCurrentChord}
        className="px-4 py-2 rounded-lg bg-neutral-700 text-neutral-200 font-medium
                   hover:bg-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors"
      >
        Play Chord
      </button>
    </div>
  );
}
