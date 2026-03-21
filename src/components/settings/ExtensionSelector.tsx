import type { Extension } from '../../types/chord';

const ALL_EXTENSIONS: { value: Extension; label: string }[] = [
  { value: 'b5',  label: '♭5'  },
  { value: '#5',  label: '♯5'  },
  { value: 'b9',  label: '♭9'  },
  { value: '#9',  label: '♯9'  },
  { value: '#11', label: '♯11' },
  { value: 'b13', label: '♭13' },
  { value: 'alt', label: 'alt' },
];

interface Props {
  allowedExtensions: Extension[];
  // TODO: wire to dispatch SET_ALLOWED_EXTENSIONS
  onToggle: (ext: Extension) => void;
}

export function ExtensionSelector({ allowedExtensions, onToggle }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-300">Note Extensions</h3>
      <p className="text-xs text-neutral-500">
        Applied as optional modifiers on top of selected chord types.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ALL_EXTENSIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onToggle(value)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer
              ${allowedExtensions.includes(value)
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'bg-neutral-800 border-neutral-600 text-neutral-300 hover:border-indigo-400'
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
