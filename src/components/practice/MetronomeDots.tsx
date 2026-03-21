interface Props {
  totalTicks: number;   // ticksPerChord setting
  currentTick: number;  // how many ticks have elapsed
  enabled: boolean;
}

export function MetronomeDots({ totalTicks, currentTick, enabled }: Props) {
  if (!enabled) return null;

  return (
    <div className="flex justify-center gap-2 py-3">
      {Array.from({ length: totalTicks }, (_, i) => (
        <span
          key={i}
          className={`w-3 h-3 rounded-full border-2 transition-colors duration-100 ${
            i < currentTick
              ? 'bg-indigo-500 border-indigo-500 bg-'
              : 'bg-transparent border-neutral-400'
          }`}
        />
      ))}
    </div>
  );
}
