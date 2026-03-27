interface Props {
  text: string;
}

export function InfoTooltip({ text }: Props) {
  return (
    <div className="relative group inline-flex items-center">
      <span className="w-4 h-4 rounded-full bg-neutral-700 text-neutral-400 text-[10px] flex items-center justify-center cursor-default select-none">
        ?
      </span>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-2 rounded-md bg-neutral-800 border border-neutral-600 text-xs text-neutral-300 leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
        {text}
      </div>
    </div>
  );
}
