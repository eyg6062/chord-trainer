interface Props {
  enabled: boolean;
  previewCount: number;
  onToggle: () => void;
  onPreviewCountChange: (count: number) => void;
}

export function ChordPreviewSettings({ enabled, previewCount, onToggle, onPreviewCountChange }: Props) {
  const handleChange = (raw: number) => {
    onPreviewCountChange(Math.min(4, Math.max(1, raw)));
  };

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
        <div className="flex items-center gap-3">
          <label className="text-xs text-neutral-400 w-28 shrink-0">Preview count</label>
          <input
            type="range"
            min={1}
            max={4}
            value={previewCount}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <input
            type="number"
            min={1}
            max={4}
            value={previewCount}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-16 text-sm border border-neutral-600 rounded-md px-2 py-1
                       text-center bg-neutral-800 text-neutral-200"
          />
        </div>
      </div>
    </div>
  );
}
