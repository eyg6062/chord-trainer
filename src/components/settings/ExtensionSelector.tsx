import type { Extension } from '../../types/chord';
import { InfoTooltip } from './InfoTooltip';

const ALL_EXTENSIONS: { value: Extension; label: string }[] = [
  { value: 'b5',  label: '♭5'  },
  { value: '#5',  label: '♯5'  },
  { value: 'b9',  label: '♭9'  },
  { value: '#9',  label: '♯9'  },
  { value: '#11', label: '♯11' },
  { value: 'b13', label: '♭13' },
  { value: 'alt', label: 'alt' },
];

export const ALL_EXTENSION_VALUES: Extension[] = ALL_EXTENSIONS.map((e) => e.value);

interface Props {
  allowedExtensions: Extension[];
  allExtensionsEnabled: boolean;
  onToggleAll: () => void;
  onToggle: (ext: Extension) => void;
}

export function ExtensionSelector({ allowedExtensions, allExtensionsEnabled, onToggleAll, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-neutral-300">Note Extensions</h3>
        <InfoTooltip text="Notes applied as optional modifiers on top of selected chord types. Selected extensions may be randomly applied to generated chords." />
        <label className="flex items-center gap-1.5 text-sm text-neutral-400 cursor-pointer">
          <input
            type="checkbox"
            checked={allExtensionsEnabled}
            onChange={onToggleAll}
            className="rounded accent-indigo-500"
          />
          All
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ALL_EXTENSIONS.map(({ value, label }) => {
          const isSelected = allowedExtensions.includes(value);
          const isHalfLit = !isSelected && allExtensionsEnabled;
          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer
                ${isSelected
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : isHalfLit
                    ? 'bg-indigo-500/25 border-indigo-400/40 text-indigo-300/70'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-300 hover:border-indigo-400'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
