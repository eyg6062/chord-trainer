import type { ChordTypeName } from '../../types/chord';
import { CHORDTYPENAME_TO_SETTINGS_UI_STRING } from '../../constants/uiMapping';

interface ChordGroup {
  label: string;
  types: ChordTypeName[];
}

export const CHORD_GROUPS: ChordGroup[] = [
  { label: 'Triads',     types: ['Major', 'minor', 'dim', 'aug'] },
  { label: 'Sevenths',   types: ['M7', 'm7', '7', 'mM7', 'dim7', 'm7b5', 'augM7', 'aug7'] },
  { label: 'Six Chords', types: ['6', 'm6', '6/9'] },
  { label: 'Extended',   types: ['M9', 'm9', '9', '11', 'M11', 'm11', '13', 'M13', 'm13'] },
  { label: 'Added Tone', types: ['add9', 'm(add9)', 'add11', 'add13'] },
  { label: 'Suspended',  types: ['sus2', 'sus4', '7sus4'] },
];

export const ALL_CHORD_TYPES: ChordTypeName[] = CHORD_GROUPS.flatMap((g) => g.types);

interface Props {
  selectedChordTypes: ChordTypeName[];
  allChordTypesEnabled: boolean;
  allGroupsEnabled: Record<string, boolean>;
  onToggleAll: () => void;
  onToggleGroup: (groupLabel: string) => void;
  onToggle: (type: ChordTypeName) => void;
}

interface GroupRowProps {
  group: ChordGroup;
  selectedChordTypes: ChordTypeName[];
  allChordTypesEnabled: boolean;
  groupAllEnabled: boolean;
  onToggleGroup: (groupLabel: string) => void;
  onToggle: (type: ChordTypeName) => void;
}

function GroupRow({
  group,
  selectedChordTypes,
  allChordTypesEnabled,
  groupAllEnabled,
  onToggleGroup,
  onToggle,
}: GroupRowProps) {
  const anyAllEnabled = allChordTypesEnabled || groupAllEnabled;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide w-20 shrink-0 dark:text-neutral-500">
          {group.label}
        </span>
        <label className="flex items-center gap-1 text-xs text-neutral-400 cursor-pointer">
          <input
            type="checkbox"
            checked={groupAllEnabled}
            onChange={() => onToggleGroup(group.label)}
            className="rounded accent-indigo-500"
          />
          All
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-22">
        {group.types.map((type) => {
          const isSelected = selectedChordTypes.includes(type);
          const isHalfLit = !isSelected && anyAllEnabled;
          return (
            <button
              key={type}
              onClick={() => onToggle(type)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer
                ${isSelected
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : isHalfLit
                    ? 'bg-indigo-500/25 border-indigo-400/40 text-indigo-300/70'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-300 hover:border-indigo-400'
                }`}
            >
              {CHORDTYPENAME_TO_SETTINGS_UI_STRING[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChordTypeSelector({
  selectedChordTypes,
  allChordTypesEnabled,
  allGroupsEnabled,
  onToggleAll,
  onToggleGroup,
  onToggle,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-neutral-300">Chord Types</h3>
        <label className="flex items-center gap-1.5 text-sm text-neutral-400 cursor-pointer">
          <input
            type="checkbox"
            checked={allChordTypesEnabled}
            onChange={onToggleAll}
            className="rounded accent-indigo-500"
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
            allChordTypesEnabled={allChordTypesEnabled}
            groupAllEnabled={allGroupsEnabled[group.label] ?? false}
            onToggleGroup={onToggleGroup}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
