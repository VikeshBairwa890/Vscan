interface ServiceChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function ServiceChip({
  label,
  selected,
  onClick,
}: ServiceChipProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
        selected
          ? "border-violet-500 bg-violet-500 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-violet-300 hover:bg-violet-50"
      }`}
    >
      {label}
    </button>
  );
}