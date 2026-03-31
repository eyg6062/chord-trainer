import type { MidiDevice } from '../../types/midi';

interface Props {
  enabled: boolean;
  devices: MidiDevice[];
  selectedDeviceId: string | null;
  // TODO: wire to dispatch
  onToggle: () => void;
  onSelectDevice: (id: string) => void;
  onRefresh: () => void;
}

export function MidiSettings({
  enabled,
  devices,
  selectedDeviceId,
  onToggle,
  onSelectDevice,
  onRefresh,
}: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-300">MIDI Input</h3>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="rounded accent-indigo-500"
        />
        <span className="text-sm text-neutral-300">Enable MIDI device</span>
      </label>

      {enabled && (
        <div className="flex items-center gap-2 pl-5">
          <select
            value={selectedDeviceId ?? ''}
            onChange={(e) => onSelectDevice(e.target.value)}
            disabled={devices.length === 0}
            className="text-sm border border-neutral-600 rounded-md px-2 py-1
                       bg-neutral-800 text-neutral-200 disabled:opacity-50"
          >
            {devices.length === 0 ? (
              <option value="">No devices found</option>
            ) : (
              devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.connected ? d.name : `${d.name} — disconnected`}
                </option>
              ))
            )}
          </select>

          <button
            onClick={onRefresh}
            className="text-sm px-2.5 py-1 rounded-md bg-neutral-700 text-neutral-300
                       hover:bg-neutral-600 transition-colors"
            title="Rescan MIDI devices"
          >
            ↺ Refresh
          </button>
        </div>
      )}
    </div>
  );
}
