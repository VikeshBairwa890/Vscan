import {
  CircleHelp,
  Dumbbell,
  Hotel,
  Scissors,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Utensils,
} from "lucide-react";

interface OptionCardProps {
  label: string;

  description?: string;

  icon?: string;

  selected: boolean;

  onClick: () => void;
}

const iconMap: any = {
  scissors: Scissors,
  sparkles: Sparkles,
  hotel: Hotel,
  utensils: Utensils,
  dumbbell: Dumbbell,
  stethoscope: Stethoscope,
  "shopping-bag": ShoppingBag,
  "circle-help": CircleHelp,
};

export default function OptionCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: OptionCardProps) {
  const Icon =
    iconMap[icon as keyof typeof iconMap];

  return (
    <button
      onClick={onClick}
      className={`group rounded-[28px] border p-6 text-left transition-all duration-300 ${
        selected
          ? "border-violet-500 bg-violet-50 shadow-[0_10px_30px_rgba(139,92,246,0.15)]"
          : "border-zinc-200 bg-white hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
      }`}
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
          selected
            ? "bg-violet-100"
            : "bg-zinc-100 group-hover:bg-violet-100"
        }`}
      >
        {Icon && (
          <Icon
            className={`h-7 w-7 transition-all duration-300 ${
              selected
                ? "text-violet-700"
                : "text-zinc-700 group-hover:text-violet-700"
            }`}
          />
        )}
      </div>

      <h3 className="mb-2 text-lg font-semibold text-zinc-900">
        {label}
      </h3>

      <p className="text-sm leading-relaxed text-zinc-500">
        {description}
      </p>
    </button>
  );
}