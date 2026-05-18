import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({
  onSend,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    onSend(input);

    setInput("");
  };

  return (
    <div className="flex items-center gap-3 border-t border-zinc-800 p-4">
      <input
        type="text"
        placeholder="Type your answer..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none"
      />

      <button
        onClick={handleSend}
        className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
      >
        Send
      </button>
    </div>
  );
}