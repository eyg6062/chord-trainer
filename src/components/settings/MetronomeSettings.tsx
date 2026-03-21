interface Props {
  enabled: boolean;
  bpm: number;
  ticksPerChord: number;
  nextChordPreviewCount: number;
  // TODO: wire to dispatch
  onToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onTicksChange: (ticks: number) => void;
  onPreviewCountChange: (count: number) => void;
}

interface SliderNumberInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function SliderNumberInput({ label, value, min, max, onChange }: SliderNumberInputProps) {
  const handleChange = (raw: number) => {
    onChange(Math.min(max, Math.max(min, raw)));
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-gray-400 w-28 shrink-0">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="flex-1 accent-indigo-500"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="w-16 text-sm border border-gray-600 rounded-md px-2 py-1
                   text-center bg-gray-800 text-gray-200"
      />
    </div>
  );
}

export function MetronomeSettings({
  enabled,
  bpm,
  ticksPerChord,
  nextChordPreviewCount,
  onToggle,
  onBpmChange,
  onTicksChange,
  onPreviewCountChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-300">Metronome</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={onToggle}
            className="rounded"
          />
          <span className="text-sm text-gray-300">Enabled</span>
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

      {/* Preview count is independent of metronome */}
      <SliderNumberInput
        label="Chords preview"
        value={nextChordPreviewCount}
        min={0}
        max={4}
        onChange={onPreviewCountChange}
      />
    </div>
  );
}
