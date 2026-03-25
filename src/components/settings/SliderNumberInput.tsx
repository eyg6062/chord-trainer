import { useState, useEffect } from 'react';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function SliderNumberInput({ label, value, min, max, onChange }: Props) {
  const [localValue, setLocalValue] = useState(String(value));

  // Sync when value changes externally (e.g. from slider drag)
  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const n = Number(raw);
    if (raw.trim() !== '' && !isNaN(n)) {
      const clamped = Math.min(max, Math.max(min, n));
      onChange(clamped);
      setLocalValue(String(clamped));
    } else {
      setLocalValue(String(value)); // revert invalid input
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-xs text-neutral-400 w-28 shrink-0">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
        className="flex-1 accent-indigo-500"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={() => commit(localValue)}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        className="w-16 text-sm border border-neutral-600 rounded-md px-2 py-1
                   text-center bg-neutral-800 text-neutral-200"
      />
    </div>
  );
}
