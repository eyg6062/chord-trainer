/**
 * Reusable multi-select grid for choosing note names.
 * Used by both KeySelector (24 major/minor options) and RootSelector (12 notes).
 */
import { InfoTooltip } from './InfoTooltip';

interface Props {
  label: string;
  options: string[];           // e.g. ["C major", "C minor", ...] or ["C","C#",...]
  selected: string[];
  allEnabled: boolean;         // whether the "All"/"Enabled" toggle is on
  tooltip?: string;
  displayMap?: Record<string, string>; // optional value→label overrides for button text
  checkboxLabel?: string;      // defaults to "All"
  sectionDisabled?: boolean;   // when true, buttons are greyed out and non-interactive
  noHalfLit?: boolean;         // when true, unselected buttons never show the half-lit state
  onToggleAll: () => void;
  onToggle: (option: string) => void;
}

export function NoteSelector({
  label,
  options,
  selected,
  allEnabled,
  tooltip,
  displayMap,
  checkboxLabel,
  sectionDisabled,
  noHalfLit,
  onToggleAll,
  onToggle,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-neutral-300">{label}</h3>
        {tooltip && <InfoTooltip text={tooltip} />}
        <label className="flex items-center gap-1.5 text-sm text-neutral-400 cursor-pointer">
          <input
            type="checkbox"
            checked={allEnabled}
            onChange={onToggleAll}
            className="rounded accent-indigo-500"
          />
          {checkboxLabel ?? 'All'}
        </label>
      </div>

      <div className={`flex flex-wrap gap-1.5${sectionDisabled ? ' opacity-50 pointer-events-none' : ''}`}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isHalfLit = !isSelected && allEnabled && !noHalfLit;
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer
                ${isSelected
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : isHalfLit
                    ? 'bg-indigo-500/25 border-indigo-400/40 text-indigo-300/70'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-300 hover:border-indigo-400'
                }`}
            >
              {displayMap ? (displayMap[option] ?? option) : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
