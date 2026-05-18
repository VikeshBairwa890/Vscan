export default function AssistantHeader() {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 bg-white px-8 py-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-2xl text-white shadow-lg">
        ✨
      </div>

      <div>
        <h2 className="text-2xl font-bold text-zinc-900">
          Vscan AI
        </h2>

        <p className="text-sm text-zinc-500">
          Let's setup your business in minutes
        </p>
      </div>
    </div>
  );
}