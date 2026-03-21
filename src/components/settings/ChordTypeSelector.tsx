import type { ChordTypeName } from '../../types/chord';

interface ChordGroup {
  label: string;
  types: ChordTypeName[];
}

const CHORD_GROUPS: ChordGroup[] = [
  {
    label: 'Triads',
    types: ['Major', 'minor', 'dim', 'aug', 'sus2', 'sus4'],
  },
  {
    label: 'Sevenths',
    types: ['M7', 'm7', '7', 'mM7', 'dim7', 'm7b5', 'augM7', 'aug7'],
  },
  {
    label: 'Six Chords',
    types: ['6', 'm6', '6/9'],
  },
  {
    label: 'Extended',
    types: ['M9', 'm9', '9', '11', 'M11', 'm11', '13', 'M13', 'm13'],
  },
  {
    label: 'Added Tone',
    types: ['add9', 'm(add9)', 'add11', 'add13'],
  },
  {
    label: 'Suspended',
    types: ['7sus4'],
  },
];

const ALL_CHORD_TYPES: ChordTypeName[] = CHORD_GROUPS.flatMap((g) => g.types);

interface Props {
  selectedChordTypes: ChordTypeName[];
  // TODO: wire to dispatch SET_SELECTED_CHORD_TYPES
  onToggleAll: () => void;
  onToggleGroup: (group: ChordTypeName[]) => void;
  onToggle: (type: ChordTypeName) => void;
}

interface GroupRowProps {
  group: ChordGroup;
  selectedChordTypes: ChordTypeName[];
  onToggleGroup: (types: ChordTypeName[]) => void;
  onToggle: (type: ChordTypeName) => void;
}

function GroupRow({ group, selectedChordTypes, onToggleGroup, onToggle }: GroupRowProps) {
  const allInGroup = group.types.every((t) => selectedChordTypes.includes(t));

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-20 shrink-0 dark:text-gray-500">
          {group.label}
        </span>
        <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={allInGroup}
            onChange={() => onToggleGroup(group.types)}
            className="rounded"
          />
          All
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-22">
        {group.types.map((type) => (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer
              ${selectedChordTypes.includes(type)
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-indigo-400'
              }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChordTypeSelector({
  selectedChordTypes,
  onToggleAll,
  onToggleGroup,
  onToggle,
}: Props) {
  const allSelected = ALL_CHORD_TYPES.every((t) => selectedChordTypes.includes(t));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-gray-300">Chord Types</h3>
        <label className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="rounded"
          />
          All
        </label>
      </div>

      <div className="space-y-3">
        {CHORD_GROUPS.map((group) => (
          <GroupRow
            key={group.label}
            group={group}
            selectedChordTypes={selectedChordTypes}
            onToggleGroup={onToggleGroup}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
