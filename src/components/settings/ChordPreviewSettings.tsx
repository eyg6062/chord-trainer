import { SliderNumberInput } from './SliderNumberInput';

interface Props {
  enabled: boolean;
  previewCount: number;
  onToggle: () => void;
  onPreviewCountChange: (count: number) => void;
}

export function ChordPreviewSettings({ enabled, previewCount, onToggle, onPreviewCountChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-neutral-300">Chord Preview</h3>
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
          label="Preview count"
          value={previewCount}
          min={1}
          max={4}
          onChange={onPreviewCountChange}
        />
      </div>
    </div>
  );
}
