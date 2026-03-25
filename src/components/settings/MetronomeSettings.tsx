import { SliderNumberInput } from './SliderNumberInput';

interface Props {
  enabled: boolean;
  bpm: number;
  ticksPerChord: number;
  onToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onTicksChange: (ticks: number) => void;
}

export function MetronomeSettings({
  enabled,
  bpm,
  ticksPerChord,
  onToggle,
  onBpmChange,
  onTicksChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-neutral-300">Metronome</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            className="rounded accent-indigo-500"
          />
          <span className="text-sm text-neutral-300">Enabled</span>
        </label>
      </div>

      <div className={`space-y-2 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <SliderNumberInput
          label="Tempo (BPM)"
          value={bpm}
          min={1}
          max={240}
          onChange={onBpmChange}
        />
        <SliderNumberInput
          label="Ticks per chord"
          value={ticksPerChord}
          min={1}
          max={24}
          onChange={onTicksChange}
        />
      </div>
    </div>
  );
}
