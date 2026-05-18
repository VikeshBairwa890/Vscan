interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm text-zinc-500">
        <span>
          Step {current + 1} of {total}
        </span>

        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}